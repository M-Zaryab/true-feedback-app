// import { NextAuthOptions } from "next-auth";
import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "CredentialsProvider",
      credentials: {
        identifier: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            email: credentials?.identifier,
          });

          if (!user) {
            throw new Error("No user found with this email. ");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login. ");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password ?? "",
            user.password
          );

          if (isPasswordCorrect) return user;
          else throw new Error("Incorrect Password");
        } catch (err) {
          console.log("Error in authorizing ", err);
          return null;
          // throw new Error(err);
        }
      },
    }),
  ],
  pages: { signIn: "/sign-in" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
  },
};
