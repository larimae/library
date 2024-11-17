import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';

import {IBookDocument, bookSchema} from './Book.js';

export interface IUserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: IBookDocument[];
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
}

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    savedBooks: [bookSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre<IUserDocument>('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

const User = model<IUserDocument>('User', userSchema);

export default User;
