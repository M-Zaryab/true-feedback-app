import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { newResponse } from "@/lib/newResponse";

export async function POST(request: Request) {
  // check if the code of user and the code which I have sent are same
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(new newResponse(404, false, "user not found. "));
    }

    const isCodeValid = code === user?.verifyCode;
    const isCodeNotExpired =
      new Date(user.verifyCodeExpiry) > new Date(Date.now());

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save({ validateBeforeSave: false });
      return Response.json(
        new newResponse(400, false, "User account verified successfully. ")
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        new newResponse(
          400,
          false,
          "Your OTP is expired please sign in again to get a new code. "
        )
      );
    } else {
      return Response.json(new newResponse(400, false, "Incorrect OTP "));
    }
  } catch (err) {
    return Response.json(
      new newResponse(500, false, "Error verifying the user ")
    );
  }
}
