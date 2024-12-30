'use client';

import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clipboard } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UpdateNoteDialogBox from "./UpdateNoteDialogBox";
import DeleteNoteButton from "./DeleteNoteButton";
import { Button } from "@/components/ui/button";
  

const Note = ({ note }) => {


  const [ isLoading, setIsLoading ] = useState(false);

  const router = useRouter();


  const deleteNoteData = async () => {

    try {

      setIsLoading(true);

      const { data } = await axios.delete(`/api/notes?noteId=${note?.id}`);

      if (data?.success) {

        toast.success(data?.message);

        router.refresh();

      }
      
    } catch (error) {

        console.log(error);

        toast.error('Internal Server Error');
      
    } finally {

      setIsLoading(false);

    }

  }

  
  return (
    <Card className='bg-gradient-to-br from-slate-100 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:bg-slate-800 dark:border-slate-500 transition-shadow hover:shadow-lg dark:hover:shadow-slate-500'>

        <CardHeader>
            <CardTitle>{note?.title}</CardTitle>
            <CardDescription>Note ID: {note?.id}</CardDescription>
        </CardHeader>

        <CardContent className='overflow-y-auto h-24'>
            <p>{note?.content}</p>
        </CardContent>

        <CardFooter className='mt-3 lg:mt-4 flex flex-col gap-1 lg:flex-0 lg:flex-row w-full'>

          <TooltipProvider>

            <Tooltip>

              <TooltipTrigger asChild>

                <span className="w-full">

                  <UpdateNoteDialogBox 
                    title={note?.title} 
                    content={note?.content} 
                    idOfTheNoteToBeUpdated={note?.id}
                    disableEditButtonOnNoteDelete={isLoading}
                  />

                </span>

              </TooltipTrigger>

              <TooltipContent>
                <p>Update Note</p>
              </TooltipContent>

            </Tooltip>

          </TooltipProvider>


          <TooltipProvider>

            <Tooltip>

              <TooltipTrigger asChild>

                <span className="w-full">

                  <Button
                    disabled={isLoading}
                    className='w-full'
                    variant='ghost'
                    onClick={() => {

                      navigator.clipboard.writeText(note?.content);

                      toast.success('note content successfully copied to clipboard');

                  }}>

                    <Clipboard />

                  </Button>

                </span>

              </TooltipTrigger>

              <TooltipContent>
                <p>Copy note content to clipboard</p>
              </TooltipContent>

            </Tooltip>

          </TooltipProvider>


          <TooltipProvider>

            <Tooltip>

              <TooltipTrigger asChild>

                <span className="w-full">

                  <DeleteNoteButton 
                    isLoading={isLoading} 
                    deleteNoteDataFunc={deleteNoteData}
                  />
                  
                </span>

              </TooltipTrigger>

              <TooltipContent>
                <p>Delete Note</p>
              </TooltipContent>

            </Tooltip>

          </TooltipProvider>
        

        </CardFooter>

    </Card>

  )
}

export default Note;