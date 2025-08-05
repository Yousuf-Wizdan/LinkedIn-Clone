import { IUser } from "@/types/types";
import { Document, Schema , models , model } from "mongoose";

export interface ICommentBase {
    user: IUser,
    text: string
}
export interface IComment extends Document,ICommentBase{
    _id: string
    createdAt: Date,
    updatedAt: Date
}

const commentSchema = new Schema<IComment>({
    user: {
        userId: {type: String , required: true},
        userImage: {type: String , required: true},
        firstName: {type: String , requried: true},
        lastName: {type: String}
    },
    text: {type: String , required: true}

},{timestamps: true})

const commentModel = models?.Comment || model<IComment>('Comment' , commentSchema);

export default commentModel;