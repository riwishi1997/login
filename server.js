require("dotenv").config();
const express = require("express");
const app = express();
const authRouter = require("./router/auth-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middleware/error-middleware");
const contactRoute = require("./router/contact-router");

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/form", contactRoute);

app.use(errorMiddleware);


const PORT = 5003;

connectDb().then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at port: ${PORT}`);
    });
});