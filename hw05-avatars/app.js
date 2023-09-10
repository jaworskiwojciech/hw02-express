const mongoose = require("mongoose");
require("dotenv").config();
const createFolderIfNotExist = require("./helpers/multer");
const path = require("path");

const express = require("express");
const app = express();
const contactRoutes = require("./routes/contacts.routes");
const authRoutes = require("./routes/auth.routes");

const PORT = process.env.PORT || 4000;

const public = path.join(process.cwd(), "public");
const uploadDir = path.join(process.cwd(), "public/tmp");
const storeImage = path.join(process.cwd(), "public/avatars");

const connection = mongoose.connect(process.env.DATABASE_URL, {
  dbName: "db-contacts",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
require("./config/passport");
app.use("/api", contactRoutes);
app.use("/api/auth", authRoutes);

connection
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      createFolderIfNotExist(public);
      createFolderIfNotExist(uploadDir);
      createFolderIfNotExist(storeImage);
      console.log(`App listens on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error while establishing connection: [${error}]`);
    process.exit(1);
  });
