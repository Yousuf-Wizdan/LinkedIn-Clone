import dbConnect from "@/mongodb/dbConnect";
import PostModel from "@/mongodb/models/post";
import { NextResponse } from "next/server";

export async function GET(request: Request, {params}: {params: Promise<{post_id: string}>}) {
    await dbConnect();
    const {post_id} = await params
    try {
        const post = await PostModel.findById(post_id);

        if (!post) {
            return NextResponse.json({
                error: "Post not found"
            }, { status: 404 })
        }

        const likes = post.likes
        return NextResponse.json(likes)

    } catch (err) {
        console.log("error" , err)
        return NextResponse.json({
            error: 'An error occured while fetching the likes'
        }, { status: 500 })
    }
}




export async function POST(request: Request, {params}: {params: Promise<{post_id: string}>}) {
    await dbConnect();

    const { userId } = await request.json();
    const {post_id} = await params
    try {

        const post = await PostModel.findById(post_id);

        if (!post) {
            return NextResponse.json({
                error: "Post not found"
            }, { status: 404 })
        }

        await post.likePost(userId);

        return NextResponse.json({
            message: "Post Liked Successfully!"
        })


    } catch (err) {
        console.log("error" , err)
        return NextResponse.json({
            error: 'An error occured while liking the POST'
        }, { status: 500 })
    }

}