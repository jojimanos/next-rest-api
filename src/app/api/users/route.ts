import connect from "@/app/lib/db";
import User from "@/app/lib/models/users";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      "There was an error while fetching the user data:" + error.message,
      { status: 500 }
    );
  }
};

const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();

    const newUser = new User(body);
    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "User is created", user: newUser }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("There was an error while creating the user:" + error.message, {
      status: 500,
    });
  }
};

const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;

    await connect();
    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or new userName not found" }),
        {
          status: 404,
        }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "New user id" }), {
        status: 404,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({ message: "User is updated", user: updatedUser }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log(
      "There was an error while modifying an entry:" + error.message,
      { status: 500 }
    );
  }
};

const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "Id not found" }), {
        status: 500,
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Not a valid user id." }),
        { status: 500 }
      );
    }

    await connect();
    const deleteUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

    if (!deleteUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User has been removed", user: deleteUser }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "There was an error while deleting the user" }),
      { status: 500 }
    );
  }
};

export { GET, POST, PATCH, DELETE };
