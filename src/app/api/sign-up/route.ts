import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";

import { sendVerficationEmail } from "@/helpers/sendVerificationEmail";

// export async function POST(request: NextRequest) {} // try this 👈
export async function POST(request: Request) {
  console.log("post request");

  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // check if the user has Username and Verified.

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      //   return Response.json(
      //     new NewResponse(false, "Username is already taken. ")
      //   );
      return Response.json(
        { success: false, message: "Username is already taken. " },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email. " },
          { status: 500 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hashSync(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      console.log("expiry Date ", expiryDate);

      const newUser = await new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: false,
        isVerified: false,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerficationEmail(
      email,
      username,
      verifyCode
    );

    console.log("emailResponse ", emailResponse);
    if (!emailResponse.success) {
      // return Response.json(
      //     new NewResponse(false, emailResponse.message)
      //   );
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully please verify your email. ",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error registering user ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user. ",
      },
      { status: 500 }
    );
  }
}
