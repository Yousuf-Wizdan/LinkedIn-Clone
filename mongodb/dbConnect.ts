import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@project-cluster.d2jij.mongodb.net/?retryWrites=true&w=majority&appName=project-cluster/linkedin-clone`;

if(!connectionString){
    throw new Error('Please Provide A Valid Connection String');    
}

const dbConnect = async () => {
    if(mongoose.connection?.readyState >= 1){
        return;
    }
    try{
        console.log('-----Connecting To MongoDb-----');
        await mongoose.connect(connectionString);
    }catch(err){
        console.log('Error Connecting to MongoDB' , err);
    }
}

export default dbConnect;

