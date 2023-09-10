const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const User = require("../models/user.model");

const tmpDir = path.join(process.cwd(), "public/tmp");
const avatarsDir = path.join(process.cwd(), "public/avatars");

const getFilenameWithSuffix = (originalname) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e3);
  return uniqueSuffix + "-" + originalname;
};

const resizeAvatar = (fileName, avatarName) => {
  Jimp.read(fileName, function (err, test) {
    if (err) throw err;
    test
      .resize(250, 250)
      .quality(100)
      .write(avatarsDir + "/" + avatarName);
  });
};

const removeTmpFile = async (fileName) => {
  try {
    await fs.unlink(path.join(fileName));
  } catch (err) {
    console.error(err);
  }
};

const updateAvatar = async (req, _, next, avatarName) => {
  try {
    const avatarURL = req.get("host") + "/avatars/" + avatarName;
    const { email } = req.user;
    const user = await User.findOne({ email });
    user.avatarURL = avatarURL;
    await user.save();
    return avatarURL;
  } catch (err) {
    next(err);
  }
};

const uploadAvatar = async (req, res, next) => {
  const { description } = req.body;
  const { path: tempPathName, originalname, filename, mimetype } = req.file;

  const fileName = path.join(tmpDir, filename);
  try {
    if (mimetype === "image/png" || mimetype === "image/jpg") {
    }
    await fs.rename(tempPathName, fileName);
  } catch (err) {
    await fs.unlink(tempPathName);
    console.error(err);
  }
  const avatarName = getFilenameWithSuffix(originalname);

  resizeAvatar(fileName, avatarName);
  removeTmpFile(fileName);

  const avatarURL = await updateAvatar(req, res, next, avatarName);
  if (!avatarURL) {
    throw requestError(400, "Something went wrong");
  }
  res.json({
    description,
    status: 200,
    data: {
      message: "File uploaded successfully",
      avatarURL: avatarURL,
    },
  });
};

module.exports = uploadAvatar;
