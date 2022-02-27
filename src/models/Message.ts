import { Schema, model, models } from 'mongoose';
import { Chat } from './Chat';
import { User } from './User';

export interface Message {
  _id: string;
  sender: User;
  content: string;
  chat: Chat;
  createdAt: string;
}

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
  },
  {
    timestamps: true,
  }
);

const MessageModel = models?.Message || model('Message', messageSchema);

export default MessageModel;
