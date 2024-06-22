import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User} from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";



export async function DELETE(request:Request , {params}:{params:{messageid:string}}) {
const messageId=     params.messageid
    await dbConnect()

    const session = await getServerSession(authOptions)
        const user:User = session?.user  as User

        if(!session || !session.user){
            return Response.json({
                success:false,
                message:"Not Authenticated"
            },{status:401})
        }
        try {
          const updateResult = await UserModel.updateOne(
                {_id:user._id},    //On which basis do i match to update 
                {$pull:{messages:{_id:messageId}}}  // _id to be matched with params's message id
            )
            if(updateResult.modifiedCount===0){
                return Response.json({
                    success:false,
                    message:"Message not found or already deleted"
                },{status:404})
            }
            return Response.json({
                success:true,
                message:"Message  deleted"
            },{status:200})
        } catch (error) {
            console.log("Error in message deleting route");
            
            return Response.json({
                success:false,
                message:"Error in deleting messages"
            },{status:500})
        }
}