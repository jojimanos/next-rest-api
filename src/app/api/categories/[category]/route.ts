import { Schema, model, models } from "mongoose";
import connect from "@/app/lib/db";
import User from "@/app/lib/models/users";
import Category from "@/app/lib/models/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const body = await request.json();
    const { title } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "category not found" }),
        {
          status: 404,
        }
      );
    }

    await connect();

    const user = User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    const category = Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    const updateCategoryTitle = await Category.findByIdAndUpdate(
      categoryId,
      {
        title: title,
      },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Category title updated successfuly" + updateCategoryTitle,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating the category" + error.message, {
      status: 500,
    });
  }
};

const DELETE = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  console.log(categoryId)

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "User id not valid" }), {
        status: 404,
      });
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Category Id not found" }),
        { status: 404 }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found or does not belong to the user" }),
        {
          status: 404,
        }
      );
    }

    const deleteCategory = await Category.findByIdAndDelete({ _id: categoryId });

    return new NextResponse(
      JSON.stringify({
        message: "Category deleted successfuly" + deleteCategory,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: "There was an error while deleting the category",
      }),
      { status: 500 }
    );
  }
};

export { PATCH, DELETE };
