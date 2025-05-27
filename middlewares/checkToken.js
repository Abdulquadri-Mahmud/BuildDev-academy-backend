import jwt from "jsonwebtoken";

//Verifying Token
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "Access denied,token not found" });
  }

  try {
    //Decoding the Token
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("Decoded Token: ", decodeToken);
    req.user = decodeToken;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: "Invalid token" });
  }
};

//Verifying User Role
export const verifyRole = (userRole) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== userRole) {
      return res
        .status(403)
        .json({ message: "Access denied, Unathorized role" });
    }
    next();
  };
};
