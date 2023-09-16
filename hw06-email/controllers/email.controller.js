const User = require("../models/user.model");
const sendEmail = require("../helpers/mailer");

const verifyEmail = async (req, res, _) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.json({
      status: "Error",
      code: 404,
      message: "User not found",
    });
  }
  user.verify = true;
  user.verificationToken = null;
  await user.save();
  return res.json({
    status: "OK",
    code: 200,
    message: "Verification successful",
  });
};

const resendVerification = async (req, res, _) => {
  const { email } = req.body;
  if (!email) {
    return res.json({
      status: "Error",
      code: 400,
      message: "Missing required field: email",
      data: "Bad Request",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({
      status: "Error",
      code: 404,
      message: "User not found",
    });
  }
  if (user.verify) {
    return res.json({
      status: "Error",
      code: 400,
      message: "Verification already completed",
      data: "Bad Request",
    });
  }
  const verificationLink = `${req.protocol}://${req.get(
    "host"
  )}/api/users/verify/${user.verificationToken}`;
  sendEmail({
    to: email,
    link: verificationLink,
  });
  return res.json({
    status: "OK",
    code: 200,
    message: "Verification email resent",
  });
};

module.exports = {
  verifyEmail,
  resendVerification,
};
