import mongoose , {Schema , Document} from "mongoose";
import { Content } from "next/font/google";


export interface Message extends Document{
    content:string,
    createdAt:Date,
    _id:string
}

const MessageSchema: Schema<Message> = new Schema({            //:Type and <konsa schema>
    content:{
        type:String ,        // In mongoose String is capital in typescript it is samll letters
        required:true
    },
        createdAt:{
            type:Date,
            required:true,
            default:Date.now
        }

})  


export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean
    isAcceptingMessage:boolean,
    messages:Message[]
}

 const UserSchema : Schema<User> = new Schema({
    username:{
        type:String,
        required:[true , "Username is required"],
        trim:true,
        unique:true   
    },
    email:{
        type:String,
        required:[true , "Email is required"],
        unique:true,
        match:[ /.+\@.+\..+/, "please use a valid email address"]
    },
    password:{
        type:String,
        required:[true , "Password is required"]
    },
    verifyCode:{
        type:String,
        required:[true,"Verify code is required"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code Expiry is required"]
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
 })

 const  UserModel = (mongoose.models.User as mongoose.Model<User>) ||  mongoose.model<User>("User", UserSchema)       // after as is typeScript

 export default UserModel;