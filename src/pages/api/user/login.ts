import { NextApiRequest, NextApiResponse } from 'next';
import UserModel from '../../../models/User';
import MongoConnection from '../../../lib/MongoConnection';
import generateToken from '../../../lib/generateToken';
import withProtect from '../../../middleware/withProtect';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  MongoConnection.connectDb();
  if (req.method === 'POST') {
    MongoConnection.connectDb();
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: generateToken(user._id, user.email),
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid Email or Password',
      });
    }
  } else {
    res.status(404).end();
  }
}

export default handler;
