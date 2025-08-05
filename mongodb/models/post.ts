import { IUser } from "@/types/types";
import mongoose, { Document, models, Model, Schema, Types, model } from "mongoose";
import commentModel, { IComment, ICommentBase } from "./comment";

export interface IPostBase {
    user: IUser,
    text: string,
    imageUrl?: string,
    comments?: IComment[],
    likes?: string[]
}

export interface IPost extends Document, IPostBase {
    _id: string
    createdAt: Date,
    updatedAt: Date
}

interface IPostMethods {
    likePost(userId: string): Promise<void>;
    unLikePost(userId: string): Promise<void>;
    commentOnPost(comment: ICommentBase): Promise<void>;
    getAllComments(): Promise<IComment[]>
    removePost(): Promise<void>;
}

interface IPostStatics {
    getAllPost(): Promise<IPostDocument[]>;
}

export interface IPostDocument extends IPost, IPostMethods {}
interface IPostModel extends IPostStatics, Model<IPostDocument> {}

const postSchema = new Schema<IPostDocument,IPostModel>({
    user: {
        userId: { type: String, required: true },
        userImage: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String }
    },
    text: { type: String, required: true },
    imageUrl: { type: String },
    comments: { type: [Schema.Types.ObjectId], ref: 'Comment', default: [] },
    likes: { type: [String] }

}, { timestamps: true })

postSchema.methods.likePost = async function (userId: string) {
    try {
        await this.updateOne({ $addToSet: { likes: userId } })  //Adds a value only if it’s not already in the array
    } catch (err) {
        console.log('Error in likePost', err);
    }
}
postSchema.methods.unLikePost = async function (userId: string) {
    try {
        await this.updateOne({ $pull: { likes: userId } })
    } catch (err) {
        console.log("Error in unLikePost", err);
    }
}
postSchema.methods.removePost = async function () {
    try {
        await this.model("Post").deleteOne({ _id: this._id });
    } catch (err) {
        console.log("Error in removePost", err);
    }
}
postSchema.methods.commentOnPost = async function(commenttoAdd: ICommentBase) {
    try{
        
        const comment = await commentModel.create(commenttoAdd);
        
        await this.updateOne({$push: {comments: comment._id}});
    } catch (err) {
        console.log("Error in commentOnPost", err);
    }
}
postSchema.methods.getAllComments = async function() {
    try{
        this.populate({
            path: 'comments',
            options: {sort: {createdAt: -1}}
        })
        return this.comments;
    }catch(err){
        console.log("Error in getAllComments", err); 
    }
}

postSchema.statics.getAllPost = async function(){
    try{
        const posts = await this.find()
                            .sort({createdAt: -1})
                            .populate({
                                path: 'comments',
                                options: {sort: {createdAt: -1}}
                            })
                            .lean(); //lean converts mongoose object to plain JS object

        return posts.map((post: IPostDocument) => ({
            ...post,
            _id: post._id.toString(),
            comments: post.comments?.map((comment: IComment) => ({
                ...comment,
                _id: comment._id.toString()
            }))
        }))
    }catch(err){
        console.log("Error in getAllPosts", err); 
    }
}

const PostModel = (models?.Post as unknown as IPostModel) || model<IPostDocument,IPostModel>('Post' , postSchema )

export default PostModel;