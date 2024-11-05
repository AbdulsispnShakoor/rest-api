import { Schema, model, Document } from "mongoose";
import { IUser } from "./user.model";

export interface IBook extends Document {
  id?: String;
  title: String;
  author: IUser;
  description: String;
  genre: String;
  coverImage: String;
  file: String;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema: Schema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, "title is required."],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "author is required."],
    },
    description: {
      type: String,
      required: [true, "description is required."],
    },
    genre: {
      type: String,
      required: [true, "genre is required."],
    },
    coverImage: {
      type: String,
      required: [true, "coverImage is required."],
    },
    file: {
      type: String,
      required: [true, "file is required."],
    },
  },
  {
    timestamps: true,
  }
);

const BookModel = model<IBook>("Book", BookSchema);
export default BookModel;
