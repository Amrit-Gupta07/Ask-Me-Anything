import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";


export async function DELETE(
    request: Request,
    { params }: { params: { messageId: string } }
){
    // console.log("hello",params);
    // console.log("world",params.messageId);

    // return Response.json({
    //     message : "amrit"
    // })


    const messageId = params.messageId;
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user : User = session?.user

    if(!session || !user){
        return Response.json({
            success : false,
            message : "User not authenticated"
        },{
            status : 401
        });
    }

    try{
        const updateResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages : {_id : messageId}}}
        )

        if(updateResult.modifiedCount === 0){
            return Response.json(
                { message: 'Message not found or already deleted', success: false },
                { status: 404 }
              );            
        }

        return Response.json({
            success: true,
            message : "Message deleted successfully"
        });
    }catch(error){
        console.error('Error deleting message:', error);
        return Response.json(
          { message: 'Error deleting message', success: false },
          { status: 500 }
        );        
    }
}