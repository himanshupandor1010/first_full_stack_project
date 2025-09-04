import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "user name is required"],
      unique:true,
      validate: {
        validator: (v) => !/\s/.test(v),
        message: "Email cannot contain spaces",
      },
    },
    email: {
      type: String,
      required: [true, "email is requied"],
       unique:true,
      match: [/^[a-zA-Z0-9]+@gmail\.com$/, "Email must be in the format username@gmail.com (letters and numbers only)"],
      validate: {
        validator: (v) => !/\s/.test(v),
        message: "Email cannot contain spaces",
      },
    },
    password: {
      type: String,
      required: [true, "password is requied"],
      validate: {
        validator: (v) => !/\s/.test(v),
        message: "Email cannot contain spaces",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

export const User = mongoose.model("User", userSchema);
