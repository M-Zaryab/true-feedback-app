import { dbConnect } from "@/lib/dbConnect";
import { newResponse } from "@/lib/newResponse";
import UserModel from "@/model/user.model";
import { Message } from "@/model/user.model";

export async function POST(request: Request) {
  // take content and username from body
  // find user, (if not found throw error)
  // add the {} of type Message in the user field messages
  // save the user
  dbConnect();
  try {
    const { username, content } = await request.json();

    console.log(typeof username, typeof content);

    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      return Response.json(new newResponse(404, false, "User not found"));
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        new newResponse(400, false, "User is not accpting message")
      );
    }
    const message: Partial<Message> = {
      content: content.toString(),
      createdAt: new Date(Date.now()),
    };

    user.messages.push(message as Message);
    user.save();

    return Response.json(
      new newResponse(200, true, "Message sent successfully. ")
    );
  } catch (error: any) {
    return Response.json(new newResponse(500, false, error.message));
  }
}
