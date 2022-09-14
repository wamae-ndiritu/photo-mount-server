const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connection } = require("./DbConfig/mongoDB");
const { orderRouter } = require("./Routes/OrderRoute");
const { userRouter } = require("./Routes/userRoute");
dotenv.config();
const app = express();

connection();

app.use(express.json());
app.use(cors());

const PORT = 5000;

app.use("/api/order", orderRouter);
app.use("/api/user", userRouter);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
