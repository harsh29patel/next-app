import {z} from "zod"

export const usernameValidation = z
.string()
.min(2 , "Username must be of atleast 2 characters")
.max(20,"Username contain  20 characters")
.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")



export const signupSchema = z.object({       //object beacuse of more than one thing above there is only username so no object
    username :usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6 , {message:"Password must be of 6 characters"}).max(18 , {message:"Passowrd must not be greater than 18 characters"})
    
})