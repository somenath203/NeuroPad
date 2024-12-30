import { z } from 'zod';


export const createNoteZodSchema = z.object({
  title: z
    .string()
    .min(4, { message: 'title has to be minimum of 4 character' })
    .max(40, { message: 'title has to be minimum of 100 character' }),
  content: z
    .string()
    .min(10, { message: 'content has to be minimum of 10 character' })
    .max(1000, { message: 'content has to be minimum of 1000 character' }),
});


export const updateNoteZodSchema = createNoteZodSchema.extend({
  idOfTheNoteToBeUpdated: z
    .string()
    .min(1, { message: 'noteID cannot be empty ' }),
});


export const deleteNoteSchema = z.object({
  idOfTheNoteToBeDeleted: z
    .string()
    .min(1, { message: 'noteID cannot be empty ' }),
});
