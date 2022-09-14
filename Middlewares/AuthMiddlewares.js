const jwt = require("jsonwebtoken");
const { User } = require("../Models/User");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  // console.log(req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = await jwt.verify(token, process.env.JWT_SECRET);

      // console.log(decoded.id);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      // console.error(error);
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // // console.log(decoded);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    console.log("No token found");
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
