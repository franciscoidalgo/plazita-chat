import { Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  picture: string;
  token?: string;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: {
      type: String,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

const UserModel = models?.User || model('User', userSchema);

export default UserModel;
