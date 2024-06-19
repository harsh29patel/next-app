import {z} from "zod"

export const signInSchema = z.object({
    identifier:z.string(),     // you can call it anything here identifier
    password:z.string(),    
})