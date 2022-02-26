import { NextApiRequest, NextApiResponse } from 'next';
import MongoConnection from '../../../lib/MongoConnection';
import withProtect from '../../../middleware/withProtect';
import ChatModel from '../../../models/Chat';
import UserModel, { User } from '../../../models/User';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      MongoConnection.connectDb();
      const user: User = JSON.parse(req.cookies.user);
      ChatModel.find({ users: { $elemMatch: { $eq: user._id } } })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('lastMessage')
        .sort({ updatedAt: -1 })
        .then(async (result) => {
          result = await UserModel.populate(result, {
            path: 'lastMessage.sender',
            select: 'name pic email',
          });

          res.status(200).send(result);
        });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  } else {
    res.status(404).end();
  }
}

export default withProtect(handler);
