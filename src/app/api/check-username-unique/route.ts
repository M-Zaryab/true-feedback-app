import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { newResponse } from "@/lib/newResponse";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    // this is the requirement of zod to keep username in object that's why it is done like this
    const queryParams = {
      username: searchParams.get("username"),
    };

    // validate with zod

    // safeParse - check if the schema is followed?
    const result = usernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        new newResponse(
          400,
          false,
          usernameErrors?.length > 0
            ? usernameErrors.join(", ")
            : "Invalid query parameter. "
        )
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        new newResponse(400, false, "Username is already taken.")
      );
    }

    return Response.json(new newResponse(201, true, "Username is unique."));
  } catch (err) {
    return Response.json(
      new newResponse(500, false, "Error checking username ")
    );
  }
}
