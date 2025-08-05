'use server'

import dbConnect from "@/mongodb/dbConnect";
import { ICommentBase } from "@/mongodb/models/comment";
import PostModel from "@/mongodb/models/post";
import { IUser } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export default async function createCommentAction(postId: string,formData: FormData){
    const user = await currentUser();
    await dbConnect()
    const commentInput = formData.get('commentInput') as string;

    if(!postId) throw new Error('Post Id is required!');
    if(!commentInput) throw new Error('Comment Input is required');
    if(!user?.id) throw new Error('User is not authenticated');

    const userDB: IUser = {
        userId: user.id,
        userImage: user.imageUrl,
        firstName: user.firstName || "" ,
        lastName: user.lastName || ""
    }

    const body = {
        user: userDB,
        text: commentInput
    }

    const post = await PostModel.findById(postId);

    if(!post){
        throw new Error('Post Not Found!')
    }

    const comment: ICommentBase = {
        user: userDB,
        text: commentInput
    }
    
    try{
        await post.commentOnPost(comment);
        revalidatePath('/')
    }catch(err){
        throw new Error('An Error occured while adding comments')
    }


}