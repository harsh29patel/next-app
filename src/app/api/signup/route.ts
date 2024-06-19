import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import  bcryptjs from "bcryptjs"
import {sendVerificationEmail} from "@/helpers/sendverifcationemail"



export async function POST(request:Request){
    await dbConnect()
    try {
        const {username , email , password}= await request.json()
       const existingUserVerifiedByUsername =  await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username already taken"
            },{status:400})
        }


      const existingUserByEmail = await  UserModel.findOne({email})

        const verifyCode= Math.floor(100000 + Math.random()*9000).toString()  // logic for verify code
        console.log(verifyCode);
        

      if(existingUserByEmail){
          if (existingUserByEmail.isVerified){  // if existing user is verifeid than this message agar verifeid ho toh usey baar nikaldo
            return Response.json({
              success:false,
              message:"User already exists with this email"
            },{status:400})
          } else{     // if user is not verified  but have user exists with  email than create password and new code
            const hashedPassword = await bcryptjs.hash(password,10)   // if not found email that means user has come to the website for the first time  
            existingUserByEmail.password =  hashedPassword  // to set  new password if password is not remembered
            existingUserByEmail.verifyCode = verifyCode    // new verify code 
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+ 3600000) // to set new verifycodetoken
            await existingUserByEmail.save()

          }
      }else{
       const hashedPassword =  await bcryptjs.hash(password,10)     // do this first  if not found email that means user has come to the website for the first time  
       const expiryDate = new Date()  
       expiryDate.setHours(expiryDate.getHours()+1)   // to set expiry date +1 logic is current time + hours

      const newUser = new UserModel({
        username,
        email,
        password:hashedPassword,
        verifyCode,
        verifyCodeExpiry:expiryDate,
        isVerified:false,
        isAcceptingMessage:true,
        messages:[]
       })

       await newUser.save()
      }

      //send verification email

      const emailResponse = await sendVerificationEmail(email,   // to see if verification code send
         username , 
         verifyCode
        )

        if(!emailResponse.success){
          return Response.json({
             success:false,
                message:emailResponse.message
          },{status:500})
        }

        return Response.json({
          success:true,
          message:"User registers successfully please verify your email"
        },{status:201})

    } catch (error) {
       console.error("Error registering user" , error);
       return Response.json({
        success:false,
        message:"Error registering user"
        },{
            status:500
        })
        
    }
}