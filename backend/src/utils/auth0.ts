import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";

dotenv.config();

interface Auth0TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function getManagementToken(): Promise<string> {
  try {
    const response: AxiosResponse<Auth0TokenResponse> = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
        grant_type: "client_credentials",
      }
    );

    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Auth0 error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Unable to fetch Auth0 management token");
  }
}

