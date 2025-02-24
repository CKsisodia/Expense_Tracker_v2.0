require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(helmet());

const sequelize = require("./db/database");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.options(
  "*",
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

app.use("/user", authRoutes);
app.use("/expense", expenseRoutes);

sequelize
  .sync()
  .then(
    app.listen(process.env.APP_RUNNING_PORT, () => {
      console.log(`Server is running on port ${process.env.APP_RUNNING_PORT}`);
    })
  )
  .catch((err) => console.log(err));
