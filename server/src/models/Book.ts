import { Schema, model, type Document } from 'mongoose';

interface IBookDocument extends Document {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

const bookSchema = new Schema<IBookDocument>({
  authors: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  bookId: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

const Book = model<IBookDocument>('Book', bookSchema);
export { bookSchema, type IBookDocument } ;
export default Book;
