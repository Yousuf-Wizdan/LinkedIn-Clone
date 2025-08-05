'use server'

import dbConnect from "@/mongodb/dbConnect";
import PostModel from "@/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function deletePostAction(postId: string){
    await auth.protect();
    const user = await currentUser();
    await dbConnect();

    const post = await PostModel.findById(postId);

    if(!post){
        throw new Error("Post not found!")
    }
    if(post?.user?.userId !== user?.id){
        throw new Error('Post does not belong to the user')
    }

    try{
        await post.removePost();
        revalidatePath("/")
    }catch(err){
        throw new Error('An error occured while deleting the post')
    }

}