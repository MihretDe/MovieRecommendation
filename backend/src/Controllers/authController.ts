import axios from 'axios';
import { Request, Response } from 'express';
import { getManagementToken } from '../utils/auth0';
import { connectDB } from '../utils/db'
import { User } from "../Models/Users"

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const token = await getManagementToken();

    const userResponse = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
      {
        email,
        password,
        connection: 'Username-Password-Authentication',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const auth0User = userResponse.data;

    // Connect to MongoDB and store user
    await connectDB();
    const newUser = new User({
      email: auth0User.email,
      auth0Id: auth0User.user_id,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created and stored in MongoDB' });
  } catch (err: any) {
    res.status(400).json({ error: err.response?.data || err.message });
  }
};
