'use client';

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
 
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AddNoteDialogBox from "./AddNoteDialogBox";
import AiChatBoxButton from "./AiChatBoxButton";


const Navbar = () => {


  const { user } = useUser();

  const { signOut } = useClerk();

  const { setTheme, theme } = useTheme();


  const router = useRouter();


  const signOutFunc = () => {

    signOut().then(() => {

      toast.success('you have been logged out successfully');

      router.push('/sign-in');

    });

  }


  return (
    <div className="p-4 shadow dark:shadow-slate-700">

      <div className="max-w-7xl m-auto flex flex-wrap gap-3 items-center justify-between">

        <Link href='/notes' className="flex items-center gap-1">

          <Image 
            src='/logo.png' 
            alt="logo" 
            width={40} 
            height={40}
          />

          <span className="font-bold">NeuroPad</span>

        </Link>
        

        <div className="flex items-center gap-4">


          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <Button variant="outline" size="icon">

                {theme === "light" && (
                  <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
                )}

                {theme === "dark" && (
                  <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
                )}

                {theme === "system" && (
                  <Monitor className="h-[1.2rem] w-[1.2rem] transition-all" />
                )}

                <span className="sr-only">Toggle theme</span>

              </Button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>

            </DropdownMenuContent>
            
          </DropdownMenu>


          <AddNoteDialogBox />


          <AiChatBoxButton />


          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <Avatar className='cursor-pointer'>

                <AvatarImage src={user?.imageUrl} />

                <AvatarFallback>{user?.fullName}</AvatarFallback>

              </Avatar>

            </DropdownMenuTrigger>

            <DropdownMenuContent>

              <DropdownMenuLabel>{user?.fullName}</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem 
                className='cursor-pointer' 
                onClick={signOutFunc}
              >
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>


        </div>

      </div>

    </div>
  )
}

export default Navbar;