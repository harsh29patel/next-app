
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";
import { string } from "zod";
import { error } from "console";

export async function sendVerificationEmail(
  email:string,
  username:string,
  VerifyCode:string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({username,otp:VerifyCode}),
          });
        return {success:true, message:"Verification Email sent successfully"}
    } catch (emailError) {
        console.error("Error sending verification email" , emailError)
        return {success:false, message:"Failed to send Verification Email"}
    }
}