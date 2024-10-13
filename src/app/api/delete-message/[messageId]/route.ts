import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { newResponse } from "@/lib/newResponse";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(new newResponse(401, false, "Not authenticated"));
  }

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        new newResponse(404, false, "Message not found or deleted")
      );
    }

    return Response.json(
      new newResponse(200, true, "Message deleted successfully")
    );
  } catch (error) {
    console.log("error in deleting message ", error);

    return Response.json(new newResponse(500, false, "Error deleting message"));
  }
}
