import { NextApiRequest, NextApiResponse } from 'next';
import withProtect from '../../../middleware/withProtect';
import ChatModel from '../../../models/Chat';
import MessageModel, { Message } from '../../../models/Message';
import UserModel, { User } from '../../../models/User';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { chatId } = req.query;
      const messages = await MessageModel.find({ chat: chatId }).populate([
        { path: 'sender', select: 'name picture email' },
        'chat',
      ]);
      res.json(messages);
    } catch (error) {
      res.status(400).end();
    }
  } else if (req.method === 'POST') {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      res.status(400).end();
      return;
    }
    const user: User = JSON.parse(req.cookies.user);

    try {
      let message = await MessageModel.create({
        sender: user._id,
        content,
        chat: chatId,
      });
      message = await message.populate([
        { path: 'sender', select: 'name picture' },
        'chat',
      ]);
      message = await UserModel.populate(message, {
        path: 'chat.users',
        select: 'name picture email',
      });

      await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message });
      res.json(message);
    } catch (error) {
      res.status(400).end();
    }
  } else {
    res.status(404).end();
  }
  return res;
}

export default withProtect(handler);
