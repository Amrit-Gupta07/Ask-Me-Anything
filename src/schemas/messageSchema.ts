import {z} from "zod";

export const messageSchema = z.object({
    content: z.string()
              .min(10,{message:'Content must be of atleast 10 characters'})
              .max(300,{message:'Content must be not more than 300 characters'})
    
})