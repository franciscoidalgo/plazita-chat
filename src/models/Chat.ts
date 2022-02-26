import { Schema, model, models } from 'mongoose';
import { Message } from './Message';
import { User } from './User';

export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  lastMessage: Message;
  groupAdmin: User;
}

const chatSchema = new Schema<Chat>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = models?.Chat || model('Chat', chatSchema);

export const getSender = (logggedUser: User, users: User[]) => {
  return users[0]._id === logggedUser._id ? users[1] : users[0];
};

export default ChatModel;
