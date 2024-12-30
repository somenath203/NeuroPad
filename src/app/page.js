import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";


const Page = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-5">

      <div className="flex flex-col justify-center items-center gap-4">

        <Image src='/logo.png' alt="logo" width={100}height={100} />

        <span className='font-bold tracking-wide text-4xl lg:text-5xl'>NeuroPad</span>

      </div>

      <p className="text-center max-w-prose text-lg px-2">
        An intelligent note-taking application with AI integration, powered by Google Gemini and Pinecone Vector Database.
      </p>

      <Button className='px-24 py-8 flex items-center justify-center' asChild>

        <Link href='/notes' className="flex items-center justify-center gap-2 text-xl font-medium tracking-wide">
          Get Started
        </Link>

      </Button>

    </main>
  )
}

export default Page;
