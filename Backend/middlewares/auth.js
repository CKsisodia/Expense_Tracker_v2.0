require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");

exports.generateAccessToken = (user) => {
  try {
    const accesssTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
    const userData = {
      id: user.id,
      email: user.email,
    };
    const jwtToken = jwt.sign(userData, accesssTokenSecretKey, {
      expiresIn: "30m",
    });
    return jwtToken;
  } catch (error) {
    throw new Error("Access token not generated", error);
  }
};

// validate token for each request
exports.validateAccessToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json(new ApiError("Access Token Missing"));
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json(new ApiError("Unauthorized Access - Token Expired"));
    }
    req.user = user;
    next();
  });
};

exports.generateRefreshToken = async (user) => {
  try {
    const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
    const userData = {
      id: user.id,
      email: user.email,
    };
    const jwtRefreshToken = jwt.sign(userData, refreshTokenSecretKey, {
      expiresIn: "24h",
    });
    const hashedRefreshToken = await bcrypt.hash(jwtRefreshToken, 10);
    return {
      refreshToken: jwtRefreshToken,
      hashedRefreshToken: hashedRefreshToken,
    };
  } catch (error) {
    throw new Error("Refresh token not generated", error);
  }
};
