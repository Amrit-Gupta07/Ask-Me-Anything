import { z } from "zod";

export const usernameValidation = z
        .string()
        // .min(2, "Username must be atleast of 2 charactars")
        .max(20,"Username must be no more than 20 characters")
        // .regex(/^[a-zA-Z0-9_]+$/,"UserName must not contain special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email:z.string().email({message: 'Invalid email address'}),
    password:z.string().min(2,{message:"password must be atleast 2 charactwers"})
})