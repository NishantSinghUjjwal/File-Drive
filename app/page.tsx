'use client'
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { SignInButton,SignOutButton, SignedIn, SignedOut  } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";

export default function Home() {
  const createFile=useMutation(api.files.createFile)
  const files=useQuery(api.files.getFiles)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton>
          <Button>Sign out</Button>
        </SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>
      {files?.map(file=><div>{file.name}</div>)}
      <Button onClick={()=>createFile({
        name:'Hello Nishant'
      })}>
        Create File
      </Button>
    </main>
  );
}
