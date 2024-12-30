import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { createNoteZodSchema, deleteNoteSchema, updateNoteZodSchema } from "@/zodValidationSchema";
import prismaClientConfig from "@/prismaClientConfig";
import { generate_embeddings } from "@/gemini-embedding-model-config";
import { notesIndex } from "@/pinecode-database-config";


export async function POST(req) {

    try {

        const { userId } = await auth();

        if (!userId) {

            return NextResponse.json({
                success: false,
                message: 'Authentication Required to access this route'
            }, { status: 401 });

        }


        const body = await req.json();


        const validateAndParseBodyUsingZodSchema = createNoteZodSchema.safeParse(body);


        if(!validateAndParseBodyUsingZodSchema.success) {

            console.error(validateAndParseBodyUsingZodSchema.error);

            return NextResponse.json({
                success: false,
                message: 'Invalid Input'
            }, { status: 400 });

        }


        const { title, content } = validateAndParseBodyUsingZodSchema.data;


        const createEmbeddings = await generate_embeddings(title + "\n\n" + content);


        await prismaClientConfig.$transaction(async (tx) => {

            const noteCreated = await tx.note.create({
                data: {
                    title: title,
                    content: content,
                    userId: userId
                }
            });

  
            await notesIndex.upsert([
                {
                    id: noteCreated?.id,
                    values: createEmbeddings,
                    metadata: {userId} 
                }
            ])

        });


        return NextResponse.json({
            success: true,
            message: 'note created successfully'
        }, { status: 201 });

        
    } catch (error) {
        
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
        
    }

}


export async function PUT(req) {

    try {

        const { userId } = await auth();

        if (!userId) {

            return NextResponse.json({
                success: false,
                message: 'Authentication Required to access this route'
            }, { status: 401 });

        }


        const body = await req.json();

        const validateAndParseBodyUsingZodSchema = updateNoteZodSchema.safeParse(body);

        
        if(!validateAndParseBodyUsingZodSchema.success) {

            console.error(validateAndParseBodyUsingZodSchema.error);

            return NextResponse.json({
                success: false,
                message: 'Invalid Input'
            }, { status: 400 });

        }


        const { title, content, idOfTheNoteToBeUpdated } = validateAndParseBodyUsingZodSchema.data;

        const doesNoteWithThisIDExist = await prismaClientConfig.note.findUnique({
            where: {
                id: idOfTheNoteToBeUpdated
            }
        });

        if (!doesNoteWithThisIDExist) {

            return NextResponse.json({
                success: false,
                message: 'Note with this ID not found'
            }, { status: 404 });

        }


        if (!doesNoteWithThisIDExist.userId === userId) {

            return NextResponse.json({
                success: false,
                message: 'you are not authorized to update this note'
            }, { status: 404 });

        }


        const createEmbeddings = await generate_embeddings(title + "\n\n" + content);


        await prismaClientConfig.$transaction(async (tx) => {
           
            await tx.note.update({
                where: {
                    id: idOfTheNoteToBeUpdated,
                    userId: userId
                },
                data: {
                    title: title,
                    content: content
                }
            });


            await notesIndex.upsert([
                {
                    id: idOfTheNoteToBeUpdated,
                    values: createEmbeddings,
                    metadata: { userId }
                }
            ]);

        });


        return NextResponse.json({
            success: true,
            message: 'your note has been updated successfully'
        }, { status: 200 });

        
    } catch (error) {
        
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });

    }

}


export async function DELETE(req) {

    try {

        const { userId } = await auth();

        if (!userId) {

            return NextResponse.json({
                success: false,
                message: 'Authentication Required to access this route'
            }, { status: 401 });

        }

        const searchParams = req.nextUrl.searchParams;

        const idOfTheNoteToBeDeletedFromSearchParams = searchParams.get('noteId');

        const objectOfTheIdComingFromParamForZodValidation = { 
            idOfTheNoteToBeDeleted: idOfTheNoteToBeDeletedFromSearchParams
        }
        
        const validateAndParseBodyUsingZodSchema = deleteNoteSchema.safeParse(objectOfTheIdComingFromParamForZodValidation);

        
        if(!validateAndParseBodyUsingZodSchema.success) {

            console.error(validateAndParseBodyUsingZodSchema.error);

            return NextResponse.json({
                success: false,
                message: 'Invalid Input'
            }, { status: 400 });

        }


        const { idOfTheNoteToBeDeleted } = validateAndParseBodyUsingZodSchema.data;

        const doesNoteWithThisIDExist = await prismaClientConfig.note.findUnique({
            where: {
                id: idOfTheNoteToBeDeleted
            }
        });

        if (!doesNoteWithThisIDExist) {

            return NextResponse.json({
                success: false,
                message: 'Note with this ID not found'
            }, { status: 404 });

        }


        if (!doesNoteWithThisIDExist.userId === userId) {

            return NextResponse.json({
                success: false,
                message: 'you are not authorized to delete this note'
            }, { status: 404 });

        }


        await prismaClientConfig.$transaction(async (tx) => {

            await notesIndex.deleteOne(idOfTheNoteToBeDeleted);

            await tx.note.delete({
                where: {
                    id: idOfTheNoteToBeDeleted,
                    userId: userId
                }
            });

        });


        return NextResponse.json({
            success: true,
            message: 'your note has been deleted successfully'
        }, { status: 200 });

        
    } catch (error) {
        
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });

    }

}