import dbConnect from "@/mongodb/dbConnect";
import PostModel from "@/mongodb/models/post";
import { NextResponse } from "next/server";


export async function POST(request: Request, {params}: {params: Promise<{post_id: string}>}) {
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

        await post.unLikePost(userId);

        return NextResponse.json({
            message: "Post UnLiked Successfully!"
        })

    } catch (err) {
        console.log("error" , err)
        return NextResponse.json({
            error: 'An error occured while unliking the POST'
        }, { status: 500 })
    }
}