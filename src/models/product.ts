import type review from "./review"
import type {IReview} from "./review"
import type {IUser} from "./user"
import { model, Schema, Model, Document } from 'mongoose';
interface IProduct extends Document{
  name:string
  description:string
  elevator:string
  reviews:IReviewData
  user:IUser
  url:String
}
interface IReviewData{
  data:IReview[]
}

const ProductSchema:Schema=new Schema({
  name:{type:String,required: true},
  description:{type:String,required: true},
  elevator:{type:String,required: true},
  user:{type:Schema.Types.ObjectId,ref:"User"},
  reviews:[{type:Schema.Types.ObjectId,ref:"Review"}],
})
const User: Model<IProduct> = model('Product', ProductSchema);
export default User
export type {IProduct}