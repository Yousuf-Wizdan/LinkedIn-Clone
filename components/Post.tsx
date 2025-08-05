'use client'
import { IPostDocument } from '@/mongodb/models/post'
import { useUser } from '@clerk/nextjs';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from "@/components/ui/badge"
import ReactTimeAgo from 'react-timeago'
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import { deletePostAction } from '@/actions/deletePostAction';
import Image from 'next/image';
import PostOptions from './PostOptions';
import { toast } from 'sonner';


const Post = ({ post }: { post: IPostDocument }) => {
    const { user } = useUser();
    const isAuther = user?.id === post?.user?.userId;
    return (
        <div className='bg-white rounded-md border'>
            <div className='p-4 flex space-x-2'>

                <Avatar>
                    <AvatarImage src={post?.user?.userImage} />
                    <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <div className='flex justify-between flex-1'>
                    <div>
                        <p className='font-semibold'>
                            {post?.user?.firstName} {post?.user?.lastName}{" "}
                            {isAuther && (
                                <Badge className='ml-2' variant={'secondary'}>
                                    Author
                                </Badge>
                            )}
                        </p>
                        <p className='text-xs text-gray-400'>
                            @{post?.user?.firstName}
                            {post?.user?.firstName}-{post?.user?.userId.toString().slice(-4)}
                        </p>

                        <p className='text-xs text-gray-400'>
                            <ReactTimeAgo date={new Date(post.createdAt)} />
                        </p>
                    </div>

                    {isAuther && (
                        <Button variant={"outline"}
                            onClick={() => {
                                const promise = deletePostAction(post._id)

                                toast.promise(promise, {
                                    loading: "Deleting post...",
                                    success: "Post deleted",
                                    error: "Failed to delete Post"
                                });

                            }}>
                            <Trash2 />
                        </Button>
                    )}
                </div>
            </div>

            <div>
                <p className='px-4'>{post?.text}</p>

                {post.imageUrl && (<Image
                    src={post?.imageUrl}
                    alt='Post image'
                    width={500}
                    height={500}
                    className='w-full mx-auto'
                />)}
            </div>

            {/* post options */}

            <PostOptions post={post} />
        </div>
    )
}

export default Post