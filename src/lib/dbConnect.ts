import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    // this is for performance
    console.log("Already DB is connected");
    return;
  }
  try {
    const db = await mongoose.connect(
      `${process.env.MONGODB_URI}/message` || ""
    ); // you can also pass options
    // console.log("db: ", db);
    // console.log("db.connections: ", db.connections);
    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected successfully. ");
  } catch (error) {
    console.log("Database connection failed. ");
    process.exit(1);
  }
}
