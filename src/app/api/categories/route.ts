import connect from "@/app/lib/db";
import User from "@/app/lib/models/users";
import Category from "@/app/lib/models/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }), {status: 404}
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User does not exist in the database" }),
        { status: 404 }
      );
    }

    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    return new NextResponse(
      JSON.stringify({ message: "Category found", category: categories }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message:
          "There was an error while fetching the categories" + error.message,
      }),
      { status: 500 }
    );
  }
};

const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // const { title, user } = request.body;

    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify("UserId is invalid"));
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const newCategory = await Category.create({
      title: title,
      user: new Types.ObjectId(userId),
    });

    return new NextResponse(
      JSON.stringify({
        message: "Category successfuly created",
        category: newCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify("There was an error while creating the category"),
      { status: 500 }
    );
  }
};

export {GET, POST}
