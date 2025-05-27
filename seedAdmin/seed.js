import { User } from "../models/user.js";
import { doHash } from "../utilities/passwordHashing.js";

export const seedAdmin = async () => {
  try {
    const existingUser = await User.findOne({ email: "samkatechie@gmail.com" });
    if (existingUser) {
      console.log("User already exist!");
    }

    const passwordHash = await doHash("Samkatech123$_", 10);

    const admin = new User({
      firstName: "Samka",
      lastName: "Tech",
      email: "samkatechie@gmail.com",
      phoneNumber: "07067917071",
      password: passwordHash,
      role: "admin",
    });
    await admin.save();
    console.log("Admin user created successfully ");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
