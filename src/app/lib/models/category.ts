import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    title: { type: "string", required: true },
    //the next line will add a reference to the user that the category will belong to
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Category = models.Category || model("Category", CategorySchema);

export default Category;
