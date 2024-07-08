require("dotenv").config();
const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const bcrypt = require("bcrypt");
const sequelize = require("../db/database");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/auth");
const { v4: uuidv4 } = require("uuid");
const nodeMailer = require("nodemailer");
const ForgotPasswordRequests = require("../models/forgotPasswordRequests");
const PremiumOrders = require("../models/premiumOrder");
const Razorpay = require("razorpay");

exports.userSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
      return res.status(400).json(new ApiError("All fields are mandatory"));
    }
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(404).json(new ApiError("User already exists"));
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json(new ApiResponse("Welcome! Account created", newUser));
  } catch (error) {
    return res.status(500).json(new ApiError("Internal server error"));
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json(new ApiError("All fields are mandatory"));
    }
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(401).json(new ApiError("Please create your account"));
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res
        .status(400)
        .json(new ApiError("Please enter correct password"));
    }
    const accessToken = generateAccessToken(user);
    const { refreshToken, hashedRefreshToken } = await generateRefreshToken(
      user
    );

    const updateUser = await User.update(
      {
        refreshToken: hashedRefreshToken,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    if (updateUser) {
      return res.status(200).json(
        new ApiResponse("You've successfully logged in", {
          accessToken,
          refreshToken,
        })
      );
    }
  } catch (error) {
    return res.status(500).json(new ApiError("Internal server error"));
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      where: userId,
    });
    if (!user) {
      return res.status(404).json(new ApiError("User details not found"));
    }
    const userDetails = {
      id: user.id,
      username: user.username,
      email: user.email,
      premiumUser : user.premiumUser
    };
    return res
      .status(200)
      .json(new ApiResponse("User details get successfully", userDetails));
  } catch (error) {
    return res.status(500).json(new ApiError("Internal server error"));
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken, email } = req.body;
    if (!(refreshToken && email)) {
      return res
        .status(400)
        .json(new ApiError("Error occured in refresh token or email"));
    }
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(400).json(new ApiError("No user found", user));
    }
    const isValidToken = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValidToken) {
      return res.status(401).json(new ApiError("Invalid refresh token"));
    }
    const accessToken = generateAccessToken(user);
    return res
      .status(200)
      .json(
        new ApiResponse("Access token refreshed", { accessToken: accessToken })
      );
  } catch (error) {
    return res.status(500).json(new ApiError("Internal server error"));
  }
};

exports.userForgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json(new ApiError("Please enter email"));
    }
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(400).json(new ApiError("Email not found"));
    }

    const resetRequests = await ForgotPasswordRequests.findAll({
      where: {
        userId: user.id,
        isActive: true,
      },
    });

    if (resetRequests && resetRequests.length > 0) {
      return res
        .status(400)
        .json(new ApiError("Another request already active"));
    }
    const uniqueToken = uuidv4();
    await ForgotPasswordRequests.create({
      userId: user.id,
      isActive: true,
      token: uniqueToken,
    });
    const link = `http://13.233.92.255:3000/reset-password?token=${uniqueToken}`;

    const transporter = nodeMailer.createTransport({
      service: process.env.NODE_MAILER_SERVICE,
      host: process.env.NODE_MAILER_HOST,
      port: process.env.NODE_MAILER_PORT,
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODE_MAILER_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `
      <!doctype html>
      <html lang="en-US">
      
      <head>
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Reset Password Email Template</title>
          <meta name="description" content="Reset Password Email Template.">
          <style type="text/css">
              a:hover {text-decoration: underline !important;}
          </style>
      </head>
      
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <!--100% body table-->
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                         
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <tr>
                                          <td style="padding:0 35px;">
                                              <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                  requested to reset your password</h1>
                                              <span
                                                  style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                  A unique link to reset your password has been generated for you. To reset your password, click the
                                                  following link and follow the instructions.
                                              </p>
                                              <a href="${link}"
                                                  style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                  Password</a>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                         
                      </table>
                  </td>
              </tr>
          </table>
          <!--/100% body table-->
      </body>
      </html>`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(400).json(new ApiError("Reset link failed"));
      }
      return res
        .status(200)
        .json(new ApiResponse("Reset password link sent successfully"));
    });
  } catch (error) {
    return res.status(500).json(new ApiError("Internal server error"));
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, token } = req.body;
    if (newPassword !== confirmPassword) {
      return res.status(400).json(new ApiError("Password must be matched"));
    }
    if (!token) {
      return res.status(400).json(new ApiError("Invalid or misssing token"));
    }

    const resetPasswordUser = await ForgotPasswordRequests.findOne({
      where: { isActive: true, token: token },
    });

    if (!resetPasswordUser) {
      return res.status(400).json(new ApiError("Link expired !"));
    }
    const user = await User.findOne({
      where: {
        id: resetPasswordUser.userId,
      },
    });

    if (!user) {
      return res.status(404).json(new ApiError("User not found"));
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password: newHashedPassword,
    });
    await user.save();
    await resetPasswordUser.update({ isActive: false });
    await resetPasswordUser.save();
    return res
      .status(200)
      .json(new ApiResponse("Password updated successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError("Internal server error"));
  }
};

exports.premiumOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const razorpayPayment = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const amount = 9900;

    const createOrder = async (params) => {
      return new Promise((resolve, reject) => {
        razorpayPayment.orders.create(params, (err, order) => {
          if (err) {
            console.error("Razorpay order creation error:", err);
            reject(err);
          } else {
            resolve(order);
          }
        });
      });
    };

    const order = await createOrder({ amount, currency: "INR" });

    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(400).json(new ApiError("User not found"));
    }

    const userOrder = await PremiumOrders.create({
      userId: user.id,
      orderId: order.id,
      status: "PENDING",
    });

    return res.status(200).json(
      new ApiResponse("Order created successfully", {
        userOrder,
        key_id: razorpayPayment.key_id,
      })
    );
  } catch (error) {
    return res.status(500).json(new ApiError("Internal server error"));
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const { orderId, paymentId } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId) {
    return res.status(400).json(new ApiError("Missing order"));
  }

  const transaction = await sequelize.transaction();
  try {
    const order = await PremiumOrders.findOne({
      where: { orderId },
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json(new ApiError("Order not found"));
    }

    order.paymentId = paymentId;
    order.status = "COMPLETED";
    await order.save({ transaction });

    const user = await User.findOne({ where: { id: userId }, transaction });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json(new ApiError("User not found"));
    }

    user.premiumUser = true;
    await user.save({ transaction });

    await transaction.commit();

    return res
      .status(200)
      .json(new ApiResponse("Transaction updated successfully"));
  } catch (error) {
    await transaction.rollback();
    return res
      .status(500)
      .json(new ApiError("Internal server error", error.message));
  }
};
