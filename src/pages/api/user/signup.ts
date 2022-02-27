import { NextApiRequest, NextApiResponse } from 'next';
import generateToken from '../../../lib/generateToken';
import UserModel from '../../../models/User';
import MongoConnection from '../../../lib/MongoConnection';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    MongoConnection.connectDb();
    const { name, email, password, picture } = req.body;
    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please enter all fields');
    }

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await UserModel.create({
      name,
      email,
      password,
      picture,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: generateToken(user._id, user.email),
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to create new user',
      });
    }
  } else {
    res.status(404);
  }
  return res;
}

export default handler;
