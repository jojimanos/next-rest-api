import mongoose, { connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Alredy connected");
  } else if (connectionState === 2) {
    console.log("Connecting...");
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "restApiWithNext",
      bufferCommands: true,
    });
    console.log("Mongodb Connected");
  } catch (error: any) {
    console.log("There was an error while trying to connect.", error.message);
  }
};

export default connect;
