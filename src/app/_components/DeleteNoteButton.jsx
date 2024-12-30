import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";


const DeleteNoteButton = ({ isLoading, deleteNoteDataFunc }) => {

  return (
    isLoading ? <Button variant='destructive' disabled={isLoading} className='w-full'> 

      <Loader2 className='transition-all animate-spin' />

    </Button> : <Button 
      className='flex items-center justify-center gap-2 w-full' 
      variant='destructive'
      disabled={isLoading}
      onClick={deleteNoteDataFunc}
    >

      <span><Trash2 /></span>

      <span>Delete Note</span>

    </Button>
  )
}


export default DeleteNoteButton;
