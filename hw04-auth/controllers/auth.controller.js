const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const secret = process.env.SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  return res.json({
    status: "success",
    code: 200,
    data: {
      token,
    },
  });
};

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ email });
    newUser.setPassword(password);
    await newUser.save();
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
      },
    });
  } catch (error) {
    next(error);
  }
};

// const logout = async (req, res) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({
//         status: "error",
//         code: 401,
//         message: "Unauthorized",
//         data: "Unauthorized",
//       });
//     }
//     const userId = req.user._id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         status: "error",
//         code: 404,
//         message: "User not found!",
//         data: "Not Found",
//       });
//     }

//     user.token = null;

//     await user.save();

//     res.status(204).send();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: "error",
//       code: 500,
//       message: "Internal Server Error",
//       data: "Internal Server Error",
//     });
//   }
// };

const logout = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await User.findOneAndUpdate({ _id: _id }, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const current = async (req, res) => {
  try {
    res.json({
      status: "Success",
      code: 200,
      data: {
        email: req.user.email,
        subscription: req.user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  signup,
  logout,
  current,
};
