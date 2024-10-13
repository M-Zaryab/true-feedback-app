import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { newResponse } from "@/lib/newResponse";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(new newResponse(401, false, "Not authenticated"));
  }

  const { isAcceptingMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { isAcceptingMessage },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(new newResponse(401, false, "can not find user. "));
    }

    return Response.json(
      // new newResponse(
      //   200,
      //   true,
      //   "Message acceptance updated successfully.",
      //   updatedUser
      // )
      {
        statusCode: 200,
        success: true,
        message: "Message acceptance updated successfully.",
        data: updatedUser,
      }
    );
  } catch (error) {
    console.log("failed to update user status to accept message. ");
    return Response.json(
      new newResponse(
        500,
        false,
        "failed to update user status to accept message."
      )
    );
  }
}

// PURPOSE: get user accepting message status
export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(new newResponse(401, false, "Not authenticated"));
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(new newResponse(404, false, "User not found. "));
    }

    return Response.json(
      // new newResponse(
      //   200,
      //   true,
      //   "Status of accepting message fetched successfully. ",
      //   {
      //     isAcceptingMessages: foundUser.isAcceptingMessage,
      //   }
      // )
      {
        statusCode: 200,
        success: true,
        message: "Status of accepting message fetched successfully",
        data: { isAcceptingMessages: foundUser.isAcceptingMessage },
      }
    );
  } catch (error) {
    console.log("Failed to get user accepting message status.");
    return Response.json(
      new newResponse(
        500,
        false,
        "Failed to get user accepting message status."
      )
    );
  }
}
