'use client'

import { IPostDocument } from '@/mongodb/models/post'
import { SignedIn, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { MessageCircle, ThumbsUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import CommentFeed from './CommentFeed';
import CommentForm from './CommentForm';
import { toast } from 'sonner';

// import CommentFeed from './CommentFeed2';

const PostOptions = ({ post }: { post: IPostDocument }) => {
    const [isCommentsOpen, setisCommentsOpen] = useState(false);
    const { user } = useUser();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState<(string | undefined)[] | undefined>(post.likes)

    useEffect(() => {
        if (user?.id && post.likes?.includes(user.id)) {
            setLiked(true);
        }
    }, [post, user])

    const likesOrUnlikePost = async () => {
        // await auth.protect();
        try{

        
        if (!user) {
            toast.error('Log In To Like')
            throw new Error('User Not Authenticated')
        }

        const originalLiked = liked;
        const originalLikes = likes;

        const newLikes = liked ? likes?.filter((like) => like !== user?.id) : [...(likes ?? []), user?.id];

        const body = {
            userId: user?.id,
        };

        setLiked(!liked);
        setLikes(newLikes)

        const response = await fetch(`/api/posts/${post._id}/${liked ? "unlike" : "like"}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            }
        )

        if (!response.ok) {
            setLiked(originalLiked);
            setLikes(originalLikes);
            toast.error('Failed to like the post')
            throw new Error('Failed to like or unlike post')
        };

        const fetchLikesResponse = await fetch(`/api/posts/${post._id}/like`)

        if (!fetchLikesResponse.ok) {
            setLiked(originalLiked);
            setLikes(originalLikes);
            throw new Error('Failed to fetch likes')
        }

        const newLikedData = await fetchLikesResponse.json();
        setLikes(newLikedData);
        }catch(err){
            console.log("ERROR IN POST OPTINS" , err)
        }
    }

    return (
        <div>
            <div className='flex justify-between px-4 py-2'>
                {likes && likes.length > 0 && (
                    <p className='text-xs text-gray-500 cursor-pointer hover:underline'>
                        {likes.length} likes
                    </p>
                )}
            
                {post?.comments && post.comments.length > 0 && (
                    <p
                        onClick={() => setisCommentsOpen(!isCommentsOpen)}
                        className='text-xs text-gray-500 cursor-pointer hover:underline'>
                        {post.comments.length} comments
                    </p>
                )}
            </div>

            <div className='flex p-2 justify-between px-2 border-t'>
                <Button
                    variant={'ghost'}
                    className='postButton'
                    onClick={() => {
                        const promise = likesOrUnlikePost()

                        toast.promise(promise , {
                            loading: liked ? "Unlikeing post...":  "Likeing post...",
                            // success: "Post liked",
                            error: liked ? "Failed Unlikeing post...":  "Failed Likeing post...",
                        })
                    }}
                >

                    <ThumbsUpIcon
                        className={cn("mr-1", liked && "text-[#4881c2] fill-[#4881c2]")}
                    />
                    Like

                </Button>

                <Button
                    variant={'ghost'}
                    className='postButton'
                    onClick={() => setisCommentsOpen(!isCommentsOpen)}
                >
                    <MessageCircle
                        className={cn("mr-1", isCommentsOpen && "text-gray-600 fill-gray-600")}
                    />
                    Comment
                </Button>
            </div>


            {isCommentsOpen && (
                <div className='p-4'>
                    <SignedIn>
                        <CommentForm postId={post._id} />
                    </SignedIn>

                    <CommentFeed post={post} />
                </div>
            )}
        </div>
    )
}

export default PostOptions