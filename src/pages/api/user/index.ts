import { NextApiRequest, NextApiResponse } from 'next';
import UserModel, { User } from '../../../models/User';
import MongoConnection from '../../../lib/MongoConnection';
import withProtect from '../../../middleware/withProtect';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  MongoConnection.connectDb();
  if (req.method === 'GET') {
    MongoConnection.connectDb();
    const user: User = JSON.parse(req.cookies.user);
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    const users = await UserModel.find(query).find({ _id: { $ne: user._id } });
    res.send(users);
  } else {
    res.status(404).end();
  }
}

export default withProtect(handler);
