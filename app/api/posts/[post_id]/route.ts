import dbConnect from "@/mongodb/dbConnect"
import PostModel from "@/mongodb/models/post";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export interface IParams {
    post_id: string
}

export async function GET(request: NextRequest, {params}: {params: Promise<{post_id: string}>}) {
    await dbConnect();
    const {post_id} = await params
    try {
        const post = await PostModel.findById(post_id);

        if (!post) {
            return NextResponse.json({
                error: "Post not found"
            }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (err) {
        console.log("error" , err)
        return NextResponse.json({
            error: 'An error occured while fetching the post'
        }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, {params}: {params: Promise<{post_id: string}>}) {
    await auth.protect();
    await dbConnect();
    const {post_id} = await params

    const { userId } = await request.json();

    try {
        const post = await PostModel.findById(post_id);

        if (!post) {
            return NextResponse.json({
                error: "Post not found"
            }, { status: 404 })
        }

        if (post.user.userId !== userId) {
            throw new Error("Post does not belong to the user")
        }

        await post.removePost();

        return NextResponse.json({
            message: "Post Successfully Deleted!!"
        }, { status: 200 })

    } catch (err) {
        console.log("error" , err)
        return NextResponse.json({
            error: 'An error occured while deleteing the post'
        }, { status: 500 })
    }


}