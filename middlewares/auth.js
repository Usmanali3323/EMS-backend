import User from "../models/User.js";
import { ApiError } from "../util/ApiError.js";
import jwt from "jsonwebtoken"
import Employee from "../models/EmployeeProfile.js";

export const verifyUser = async (req, res, next) => {
  try {
    console.log("cookies : ",req.cookies.accessToken);
    
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, {}, "Unauthorized access - no access token");
    }

    let decoded;
    try {
      // ✅ Verify token
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      throw new ApiError(401, {}, "Invalid or expired access token");
    }

    // ✅ Attach user info
    const user = await Employee.findById(decoded.id).select("-password");
    if (!user) {
      throw new ApiError(404, {}, "User not found");
    }
if(user.role!=="Employee" || "HR" ||"Admin"){
    throw new ApiError(401,[],"UnAuthorized User");
}
    req.employee = user;
    next();
  } catch (error) {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    res
      .status(error.statusCode || 401)
      .clearCookie("accessToken", cookieOptions)
      .json(
        new ApiError(
          error.statusCode || 401,
          error,
          error.message || "Unauthorized"
        )
      );
  }
};

export default verifyUser;



export const verifyHR = async (req, res, next) => {
  try {
    console.log(req.cookies.accessToken);
    
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, {}, "Unauthorized access - no access token");
    }

    let decoded;
    try {
      // ✅ Verify token
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    } catch (err) {
      throw new ApiError(401, {}, "Invalid or expired access token");
    }

    // ✅ Attach user info
    const user = await Employee.findById(decoded.id).select("-password");
    if (!user) {
      throw new ApiError(404, {}, "User not found");
    }
if(user.role!=="HR"){
    throw new ApiError(401,[],"UnAuthorized User");
}
    req.employee = user;
    next();
  } catch (error) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    res
      .status(error.statusCode || 401)
      .clearCookie("accessToken", cookieOptions)
      .json(
        new ApiError(
          error.statusCode || 401,
          error,
          error.message || "Unauthorized"
        )
      );
  }
};
