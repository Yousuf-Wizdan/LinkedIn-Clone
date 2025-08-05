import dbConnect from "@/mongodb/dbConnect";
import  { ICommentBase } from "@/mongodb/models/comment";
import PostModel from "@/mongodb/models/post";
import { NextRequest, NextResponse } from "next/server";
import { IUser } from "@/types/types";

export async function GET(request: Request, {params}: { params: Promise<{post_id: string}>}) {

    await dbConnect()
    const {post_id} = await params;

    try {
        const post = await PostModel.findById(post_id);

        if (!post) {
            return NextResponse.json({
                error: "Post not found"
            }, { status: 404 })
        }

        const comments = post.getAllComments();

        return NextResponse.json(comments);

    } catch (err) {
        console.log("error" , err)
        return NextResponse.json({
            error: 'An error occured while fetching comments'
        }, { status: 500 })
    }
}

interface AddCommentRequestBody {
    user: IUser,
    text: string
}

export async function POST(request: NextRequest, {params}: { params: Promise<{post_id: string}>}) {

    await dbConnect();

    const { user, text }: AddCommentRequestBody = await request.json();
    const {post_id} = await params;
    try {

        const post = await PostModel.findById(post_id);
        // console.log(post);
        if (!post) {
            return NextResponse.json({
                error: "Post not found"
            }, { status: 404 })
        }

        const comment: ICommentBase = {
            user,
            text
        }

        await post.commentOnPost(comment);

        return NextResponse.json({
            message: "Comment added Successfully!"
        })

    } catch (err) {
        console.log("error" , err)
        return NextResponse.json({
            error: 'An error occured while adding Comments'
        }, { status: 500 })
    }

}