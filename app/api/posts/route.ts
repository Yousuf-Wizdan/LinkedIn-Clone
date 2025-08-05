import dbConnect from "@/mongodb/dbConnect";
import PostModel, { IPostBase } from "@/mongodb/models/post";
import { IUser } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export interface AddPostRequestBody {
    user: IUser,
    text: string,
    imageUrl?: string | null
}

export async function POST(request: Request) {
    await auth.protect();
    try {
        await dbConnect();
        
        const { user, text, imageUrl }: AddPostRequestBody = await request.json();

        const postData: IPostBase = {
            user,
            text,
            ...(imageUrl && { imageUrl })
        }
        const post = await PostModel.create(postData);

        return NextResponse.json({message: "Post SuccessFully Created!" , post})
    } catch (err) {
        console.log("error" , err)
        return NextResponse.json({
            error: "An Error Occured while creating the post"
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        console.log(request)
        await dbConnect();
        const posts = await PostModel.getAllPost();
        return NextResponse.json(posts);
    } catch (err) {
        console.log("error" , err)
        return NextResponse.json({
            error: "An Error Occured while fetching Posts"
        }, { status: 500 })
    }
}   