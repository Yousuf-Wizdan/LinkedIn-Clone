"use client"
import { useUser } from '@clerk/nextjs'
import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from './ui/button'
import { ImageIcon, XIcon } from 'lucide-react'
import createPostAction from '@/actions/createPostAction'
import { toast } from 'sonner'

const PostForm = () => {

    const ref = useRef<HTMLFormElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { user } = useUser();


    const handlePostAction = async (formData: FormData) => {
        
        const copyFormData = formData;
        ref?.current?.reset();

        const text = copyFormData.get('postInput') as string;

        if (!text.trim()) {
            throw new Error('You must provide a post input')
        }

        setPreview(null)

        try{
            await createPostAction(formData);
        }catch(err){
            console.log('Error Creating posts:' , err);
        }

    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }
    return (
        <div className=' '>
            <form ref={ref} action={(formData) => {
                //handle form submission with server action
                const promise = handlePostAction(formData);

                toast.promise(promise, {
                    loading: "Creating post...",
                    success: "Post created",
                    error: "Failed to Create Post"
                });

                //toast notification
            }} className='bg-white p-3 border rounded-lg'>
                <div className=' flex items-center space-x-2 '>
                    <Avatar>
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0)}
                            {user?.lastName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <input
                        type='text'
                        placeholder='Start Writing a post...'
                        name='postInput'
                        className='flex-1 outline-none rounded-full py-3 px-4 border bg-white'
                    />

                    <input
                        ref={fileInputRef}
                        type='file'
                        name='image'
                        accept='image/*'
                        hidden
                        onChange={handleImageChange}
                    />

                    <button type='submit' hidden >
                        Post
                    </button>
                </div>

                {/* Preview */}
                {preview && (
                    <div className='mt-3'>
                        <img src={preview} alt='Preview' className='w-full object-cover' />
                    </div>
                )}

                <div className='flex justify-end mt-2 space-x-2'>

                    <Button type='button' variant={'outline'} onClick={() => fileInputRef?.current?.click()}>
                        <ImageIcon className='mr-1' size={16} color='currentColor' />
                        {preview ? 'Change' : 'Add'} Image
                    </Button>


                    {/* Add a remove preview button */}
                    {preview && (
                        <Button type='button' variant={'outline'} onClick={() => setPreview(null)}>
                            <XIcon className='mr-1' size={16} color='currentColor' />
                            <span>Remove Image</span>
                        </Button>
                    )}
                </div>
            </form>

            <hr className='mt-2 border-gray-300' />

        </div>
    )
}

export default PostForm