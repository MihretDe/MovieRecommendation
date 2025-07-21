import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string; // Auth0 user ID
        email: string;
        [key: string]: any;
      };
    }
  }
}

// Add this check before using process.env.AUTH0_DOMAIN
if (!process.env.AUTH0_DOMAIN) {
  throw new Error(
    "AUTH0_DOMAIN environment variable is not set. Please check your .env file or deployment environment."
  );
}

// Fix the JWKS client configuration
const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  // Remove duplicate jwksUri property
});

function getKey(header: any, callback: any) {
  console.log("🔑 Getting signing key for kid:", header.kid);
  console.log(
    "🔗 JWKS URI:",
    `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  );

  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("❌ Error getting signing key:", err);
      return callback(err);
    }

    if (!key) {
      console.error("❌ No key returned from JWKS client");
      return callback(new Error("No key found"));
    }

    try {
      const signingKey = key.getPublicKey();
      console.log("✅ Successfully retrieved signing key");
      callback(null, signingKey);
    } catch (keyError) {
      console.error("❌ Error extracting public key:", keyError);
      callback(keyError);
    }
  });
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("🔐 Authentication middleware triggered");

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  console.log("Auth header present:", !!authHeader);
  console.log("Token present:", !!token);

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  // Check environment variables
  if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
    console.error("❌ Missing AUTH0_DOMAIN or AUTH0_AUDIENCE");
    return res.status(500).json({
      success: false,
      error: "Server configuration error",
    });
  }

  console.log("🔍 Verifying token...");
  console.log("AUTH0_DOMAIN:", process.env.AUTH0_DOMAIN);
  console.log("AUTH0_AUDIENCE:", process.env.AUTH0_AUDIENCE);

  // First, let's decode the token to see its structure
  try {
    const decoded = jwt.decode(token, { complete: true }) as any;
    console.log("📋 Token header:", decoded?.header);
    console.log("📋 Token payload (sub):", decoded?.payload?.sub);
    console.log("📋 Token payload (aud):", decoded?.payload?.aud);
    console.log("📋 Token payload (iss):", decoded?.payload?.iss);

    // Check if the audience matches
    const tokenAudience = Array.isArray(decoded?.payload?.aud)
      ? decoded?.payload?.aud
      : [decoded?.payload?.aud];

    if (!tokenAudience.includes(process.env.AUTH0_AUDIENCE)) {
      console.error("❌ Token audience mismatch!");
      console.error("Expected:", process.env.AUTH0_AUDIENCE);
      console.error("Got:", tokenAudience);
      return res.status(403).json({
        success: false,
        error: "Token audience mismatch",
        details: {
          expected: process.env.AUTH0_AUDIENCE,
          received: tokenAudience,
        },
      });
    }
  } catch (decodeError) {
    console.error("❌ Error decoding token:", decodeError);
    return res.status(403).json({
      success: false,
      error: "Invalid token format",
    });
  }

  jwt.verify(
    token,
    getKey,
    {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ["RS256"],
    },
    (err: any, decoded: any) => {
      if (err) {
        console.error("❌ Token verification error:", err.message);
        console.error("Error details:", err);
        return res.status(403).json({
          success: false,
          error: "Invalid or expired token",
          details:
            process.env.NODE_ENV === "development" ? err.message : undefined,
        });
      }

      console.log("✅ Token verified successfully");
      console.log("User info:", { sub: decoded.sub, email: decoded.email });

      req.user = decoded;
      next();
    }
  );
};

// Alternative using Auth0's userinfo endpoint (more reliable)
export const authenticateTokenUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("🔐 UserInfo authentication middleware");

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  if (!process.env.AUTH0_DOMAIN) {
    return res.status(500).json({
      success: false,
      error: "AUTH0_DOMAIN not configured",
    });
  }

  try {
    const axios = require("axios");
    console.log("🔍 Verifying token with userinfo endpoint...");
    console.log(
      "🔗 Userinfo URL:",
      `https://${process.env.AUTH0_DOMAIN}/userinfo`
    );

    const response = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000, // 10 second timeout
      }
    );

    console.log("✅ Token verified via userinfo endpoint");
    console.log("User info:", response.data);

    req.user = response.data;
    next();
  } catch (error: any) {
    console.error(
      "❌ UserInfo verification failed:",
      error.response?.data || error.message
    );
    console.error("Status:", error.response?.status);
    console.error("Headers:", error.response?.headers);

    return res.status(403).json({
      success: false,
      error: "Invalid or expired token",
      details: error.response?.data || error.message,
    });
  }
};

// Development middleware that skips verification
export const authenticateTokenDev = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("🔐 Development authentication (no verification)");

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Access token required",
    });
  }

  try {
    const decoded = jwt.decode(token) as any;
    console.log("Decoded token:", { sub: decoded?.sub, email: decoded?.email });

    if (decoded && decoded.sub) {
      req.user = decoded;
      next();
    } else {
      throw new Error("Invalid token structure");
    }
  } catch (error) {
    console.error("Token decode error:", error);
    return res.status(403).json({
      success: false,
      error: "Invalid token",
    });
  }
};
