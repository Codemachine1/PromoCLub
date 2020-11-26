import type review from './review';
import Product from './product';
import type { IReview } from './review';
import type { IProduct } from './product';
import { model, Schema, Model, Document } from 'mongoose';
interface IUser extends Document {
  name: String;
  prom: String;
  avatar: String;
  url:String;
  products: IProduct[];
  reviews: IReviewData;
  promotedproducts: IProduct[];
  cocreators?: [IListPerson];
  favoriteCreator?: [IListPerson];
}

interface IListPerson extends Document {
  name: String;
  prom: String;
  avatar: String;
  url:String;
}
interface IReviewData {
  data: IReview[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  prom: { type: String, required: true },
  avatar: { type: String, required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  promotedproducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
});
const User: Model<IUser> = model('User', UserSchema);
export default User;
export type { IUser };
