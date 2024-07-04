require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgon = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require('path')

const app = express();
app.use(helmet());

const sequelize = require("./db/database");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors());

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);


app.use(morgon("combined", { stream: accessLogStream }));

app.use("/user", authRoutes);
app.use("/expense", expenseRoutes);

sequelize
  .sync()
  .then(
    app.listen(process.env.APP_RUNNING_PORT, () => {
      console.log("Server is running on port 5000");
    })
  )
  .catch((err) => console.log(err));
