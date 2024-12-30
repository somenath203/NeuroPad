import { auth } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";

import prismaClientConfig from '@/prismaClientConfig';
import Note from "@/app/_components/Note";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const Page = async () => {


  const { userId } = await auth();

  
  const allNotesCreatedByTheCurrentlyLoggedInUser = await prismaClientConfig.note.findMany({
    where: {
      userId: userId
    }
  });


  const allNotesCreatedByTheCurrentlyLoggedInUserReverse = allNotesCreatedByTheCurrentlyLoggedInUser.reverse();


  return (
    <div className="mt-8">

      {!allNotesCreatedByTheCurrentlyLoggedInUserReverse && (

        <div className="flex items-center justify-center">

          <Loader2 className='size-8 transition-all animate-spin' />

        </div>

      )}

      {allNotesCreatedByTheCurrentlyLoggedInUserReverse?.length === 0 ? (

        <div className="flex items-center justify-center">

          <Card className='border border-red-600 bg-red-50 dark:bg-red-950 border-l-4 border-l-red-900 w-full lg:w-2/5'>

            <CardHeader>

              <CardTitle>
                <span className="font-bold">No Cards Found</span>
              </CardTitle>
              
            </CardHeader>

            <CardContent>
              <p className="font-semibold">No card exists. Please create one.</p>
            </CardContent>

          </Card>

        </div>

      ) : (

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>

          {allNotesCreatedByTheCurrentlyLoggedInUserReverse?.map((note) => (

            <Note note={note} key={note?.id} />

          ))}

        </div>

      )}

    </div>
  )

}


export default Page;