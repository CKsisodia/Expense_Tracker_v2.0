const express = require("express");
const cors = require("cors");

const app = express();

const sequelize = require("./db/database");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors());

app.use("/user", authRoutes);
app.use("/expense", expenseRoutes);

sequelize
  .sync()
  .then(
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    })
  )
  .catch((err) => console.log(err));
