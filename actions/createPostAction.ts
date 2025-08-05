'use server'

import { AddPostRequestBody } from "@/app/api/posts/route";
import generateSAStoken, { containerName } from "@/lib/generateSAStoken";
import dbConnect from "@/mongodb/dbConnect";
import PostModel from "@/mongodb/models/post";
import { IUser } from "@/types/types";
import { BlobServiceClient } from "@azure/storage-blob";
import { auth, currentUser } from "@clerk/nextjs/server"
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
    await auth.protect();
    await dbConnect()
    const user = await currentUser();

    const postInput = formData.get('postInput') as string;
    const image = formData.get('image') as File;
    let imageUrl: string|undefined = undefined ;

    if (!postInput) {
        throw new Error('Post Input is Requried');
    }

    const userDB: IUser = {
        userId: user?.id as string,
        userImage: user?.imageUrl as string,
        firstName: user?.firstName || "",
        lastName: user?.lastName || ""
    }

    try{
        if (image.size > 0) {
            console.log('Uploading image to Azure Blob storage...' , image);

            const accountName = process.env.AZURE_STORAGE_NAME;
            const sasToken = await generateSAStoken();
            
            const blobServiceClient = new BlobServiceClient(
                `https://${accountName}.blob.core.windows.net?${sasToken}`
            );

            const containerClient = blobServiceClient.getContainerClient(containerName);

            const timestamps = new Date().getTime();
            const file_name = `${randomUUID()}_${timestamps}.png`

            const blocbBlockClient = containerClient.getBlockBlobClient(file_name);
            
            const imageBuffer = await image.arrayBuffer();
            const res = await blocbBlockClient.uploadData(imageBuffer);
            imageUrl = res._response.request.url;

            console.log('file Upload successfully' , imageUrl)

            const body: AddPostRequestBody = {
                user: userDB,
                text: postInput,
                imageUrl: imageUrl
            };

            await PostModel.create(body);

        }else{
            const body = {
                user: userDB,
                text: postInput,
               
            };
            await PostModel.create(body);
        }
    }catch(err: any){
        throw new Error("Failed to Create a Post" , err)
    }
    
    revalidatePath('/')


}