'use client';

import { useState } from 'react';
import { Loader2, Settings } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver} from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from "@/components/ui/button";
import { updateNoteZodSchema } from '@/zodValidationSchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';


const UpdateNoteDialogBox = ({ title, content, idOfTheNoteToBeUpdated, disableEditButtonOnNoteDelete }) => {

 
  const router = useRouter();


  const [ openDialog, setOpenDialog ] = useState(false);

  const [ loading, setLoading ] = useState(false);


  const form = useForm({
    resolver: zodResolver(updateNoteZodSchema),
    defaultValues: {
        title: title || "", 
        content: content || "", 
        idOfTheNoteToBeUpdated: idOfTheNoteToBeUpdated
    }, 
  });


  const onSubmitForm = async (formInput) => {

    try {

        setLoading(true);

        const { data } = await axios.put('/api/notes', {
            title: formInput?.title,
            content: formInput?.content,
            idOfTheNoteToBeUpdated: formInput?.idOfTheNoteToBeUpdated
        });

        
        if (data?.success) {

            toast.success(data?.message);

            form.reset();

            router.refresh();

            setOpenDialog(false);

        }

        
    } catch (error) {
        
        console.log(error);

        toast.error('Internal Server Error');
        
    } finally {

        setLoading(false);

    }

  }

  
  return <>

    <Button 
        disabled={disableEditButtonOnNoteDelete}
        className='flex items-center justify-center gap-2' 
        onClick={() => setOpenDialog(true)}
    >

        <span><Settings /></span>

        <span>Update Note</span>

    </Button>


    <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>

        <AlertDialogContent className='max-w-2xl'>

            <AlertDialogHeader>

                <AlertDialogTitle>Update Note</AlertDialogTitle>

                <AlertDialogDescription>
                    Enter the details below to update your note
                </AlertDialogDescription>

            </AlertDialogHeader>


            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmitForm)} className='space-y-3'>

                    <FormField
                        control={form.control}
                        name='title'
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Note Title</FormLabel>

                                <FormControl>

                                    <Input placeholder='enter the note title' {...field} />

                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />


                    <FormField
                        control={form.control}
                        name='content'
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>Note Content</FormLabel>

                                <FormControl>

                                    <Textarea 
                                        placeholder='enter the note content' 
                                        rows={10} className='!resize-none' 
                                        {...field}
                                    />

                                </FormControl>

                                <FormMessage />

                            </FormItem>

                        )}
                    />

                    <AlertDialogFooter className='flex gap-1'>

                        <Button 
                            disabled={loading}
                            variant='ghost' 
                            type='button' 
                            onClick={() => setOpenDialog(false)}
                        >Cancel</Button>

                        <Button 
                            disabled={loading}
                            type='submit'
                        >
                            { loading ? <Loader2 className='transition-all animate-spin' /> : 'Submit' }
                        </Button>

                    </AlertDialogFooter>

                </form>

            </Form>


        </AlertDialogContent>
    
    </AlertDialog>

  </>
};


export default UpdateNoteDialogBox;
