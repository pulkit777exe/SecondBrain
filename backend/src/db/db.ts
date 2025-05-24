import mongoose, { model, Schema } from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(
      process.env.META_PUBLIC_MONGODB_URI as unknown as string
    );
    console.log("MONGO_DB Connected!");
  } catch (err) {
    console.error("Error connecting to the MONGO_DB URI");
  }
}

connectDB();

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const contentTypes = ["images", "video", "article", "audio"] as const;

const ContentSchema = new Schema(
  {
    title: { type: String, requred: true },
    link: { type: String, required: true },
    type: { type: String, required: true },
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
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    contentId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const TagSchema = new Schema({
    title: {
        type: String,
        required: true,
        set: (a: string) => a.toLowerCase().trim()
    },
    tagId: {
        type: String, 
        required: true,
        unique: true
    }
})

const LinkSchema = new Schema({
  hash: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const UserModel = model("User", UserSchema);
export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);
export const TagModel = model("Tags", TagSchema);