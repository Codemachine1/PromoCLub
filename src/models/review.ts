import type review from "./review"
import type {IProduct} from './product';
import type {IUser} from "./user"
import { model, Schema, Model, Document } from 'mongoose';
interface IReview extends Document{
    text:String
    rating:number
    user:IUser
    product:IProduct

}

const ReviewSchema:Schema=new Schema({
    text:{type:String,required: true},
    rating:{type:String,required: true},
    user:{type:Schema.Types.ObjectId,ref:"Review"},
    product:{type:Schema.Types.ObjectId,ref:"Product"},
})
const Review: Model<IReview> = model('Review', ReviewSchema);
export default Review
export type {IReview}