import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { newResponse } from "@/lib/newResponse";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(new newResponse(401, false, "Not authenticated"));
  }

  const userId = new mongoose.Types.ObjectId(user._id || "");

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length == 0) {
      return Response.json(new newResponse(404, false, "User not found. "));
    }

    return Response.json(
      // new newResponse(200, true, "Messeges fetched successfully. ", {
      //   messages: user[0].messages,
      // })
      { success: true, message: "", messages: user[0].messages }
    );
  } catch (err) {
    return Response.json(
      new newResponse(
        500,
        false,
        "An unexpected error occured while Fetching messages. "
      )
    );
  }
}
