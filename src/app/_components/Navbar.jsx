'use client';

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes";
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AddNoteDialogBox from "./AddNoteDialogBox";
import AiChatBoxButton from "./AiChatBoxButton";


const Navbar = () => {


  const { setTheme, theme } = useTheme();


  return (
    <div className="p-4 shadow dark:shadow-slate-700">

      <div className="max-w-7xl m-auto flex flex-col lg:flex-row flex-wrap gap-3 items-center justify-between">

        <Link href='/notes' className="flex items-center justify-center gap-1">

          <Image 
            src='/logo.png' 
            alt="logo" 
            width={40} 
            height={40}
          />

          <span className="font-bold">NeuroPad</span>

        </Link>
        

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">


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


          <div className="flex items-center justify-center gap-3">

            <AddNoteDialogBox />

            <AiChatBoxButton />

          </div>

          
          <UserButton 
            key={theme}
            appearance={{ 
              elements: { avatarBox: { width: '2.5rem', height: '2.5rem' }},
            }}
          />

        
        </div>

      </div>

    </div>
  )
}

export default Navbar;