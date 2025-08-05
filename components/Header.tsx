import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {  Briefcase, HomeIcon, MessagesSquare, SearchIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export function Header(){
    return(
        <div className="flex items-center p-2 max-w-6xl mx-auto">
            <Link href={'/'}>
                <Image 
                    className="rounded-md"
                    src={"https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/960px-LinkedIn_logo_initials.png"}
                    height={40}
                    width={40}
                    alt="logo"
                />
            </Link>
            <div className="flex-1">
                <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
                    <SearchIcon className="h-4 text-gray-600"/>
                    <input 
                        type="text"
                        placeholder="search"
                        className="outline-none bg-transparent flex-1"
                        />
                </form>
            </div>

            <div className="flex items-center space-x-4 px-6 ">
                <Link href={'/'} className="icon ">
                    <HomeIcon className="h-5" />
                    <p>Home</p>
                </Link>

                <Link href={'/'} className="icon hidden md:flex">
                    <UsersIcon className="h-5" />
                    <p>Network</p>
                </Link>

                <Link href={'/'} className="icon hidden md:flex">
                    <Briefcase className="h-5" />
                    <p>Jobs</p>
                </Link>

                <Link href={'/'} className="icon ">
                    <MessagesSquare className="h-5" />
                    <p>Messaging</p>
                </Link>

                {/* User Button If Signed In */}
                <SignedIn>
                    <UserButton />
                </SignedIn>

                {/* Sign In button if not signed in */}
                <SignedOut>
                    <Button asChild variant={"outline"}>
                        <SignInButton />
                    </Button>
                </SignedOut>
            </div>
        </div>
    )
}