import PostFeed from "@/components/PostFeed";
import PostForm from "@/components/PostForm";
import UserInformation from "@/components/UserInformation";
import Widget from "@/components/Widget";
import dbConnect from "@/mongodb/dbConnect";
import PostModel from "@/mongodb/models/post";
import { SignedIn } from "@clerk/nextjs";

export const revalidate = 0;

export default async function Home() {
  await dbConnect();
  const posts = await PostModel.getAllPost();
  // console.log(posts);
  return (
    <div className="grid grid-cols-8 pt-5 sm:px-5">
      <section className="hidden md:inline md:col-span-2">
        <UserInformation posts={posts} />
      </section>

      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-full mx-auto w-full" >
        <SignedIn>
          <PostForm />
        </SignedIn>

        <PostFeed posts={posts} />
      </section>

      <section className="hidden xl:inline justify-center col-span-2 ml-7">
        <Widget />
      </section>
    </div>
  );
}
