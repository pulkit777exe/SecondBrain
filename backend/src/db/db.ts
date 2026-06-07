import mongoose, { model, Schema } from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.META_PUBLIC_MONGODB_URI as string);
    console.log("MONGO_DB Connected!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectDB();

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const ContentSchema = new Schema(
  {
    title: { type: String, requred: true },
    link: { type: String, required: true },
    type: { type: String, required: true, index: true },
    appName: { type: String },
    tags: [
      {
        tagId: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
      },
    ],
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
    contentId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

ContentSchema.index({ userId: 1, createdAt: -1 });

const LinkSchema = new Schema({
  hash: { type: String, required: true, index: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const UserModel = model("User", UserSchema);
export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);