require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const bodyParser = require("body-parser");

const { sequelize } = require("./config/database.config");
const { userRouter } = require("./users/router");
const {linksRouter} = require('./links/router')

const port = process.env.PORT || 3000;
const MAX_FAILED_ATTEMPTS = process.env.MAX_FAILED_ATTEMPTS || 5;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(limiter);

app.get("/", (req, resp) => {
  return resp.send("HELLO WORLD!");
});

app.use('/users', userRouter)
app.use('/links', linksRouter)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
