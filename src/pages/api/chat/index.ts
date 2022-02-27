import { NextApiRequest, NextApiResponse } from 'next';
import MongoConnection from '../../../lib/MongoConnection';
import withProtect from '../../../middleware/withProtect';
import ChatModel from '../../../models/Chat';
import UserModel, { User } from '../../../models/User';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body;
  const user: User = JSON.parse(req.cookies.user);

  if (!userId) {
    return res.status(400).end();
  }

  MongoConnection.connectDb();

  let isChat = await ChatModel.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('lastMessage');
  isChat = await UserModel.populate(isChat, {
    path: 'lastMessage.sender',
    select: 'name picture email',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [user._id, userId],
    };
    try {
      const createdChat = await ChatModel.create(chatData);

      const FullChat = await ChatModel.findOne({
        _id: createdChat._id,
      }).populate('users', '-password');

      res.status(200).send(FullChat);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
  return res;
}

export default withProtect(handler);
