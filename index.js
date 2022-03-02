const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const People = require("./models/people.model");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const Joi = require("@hapi/joi");
require('dotenv').config();


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);


app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password:req.body.password
  });

  if (!user) {
    return res.json({ status: "error", error: "no user found" });
  }
  if (user) {
    const token = jwt.sign(
      {
        email: user.email,
      },
      "secret123",
      { expiresIn: "300s" }
    );


    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.get("/api/quote", auth, async (req, res) => {
  try {
    const users = await People.find();
    return res.json({ status: "ok", users: users });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", error: "invalid token" });
  }
});

app.post("/api/quote", auth, async (req, res) => {

  const peopleSchema = Joi.object({
    email: Joi.string().email().required(),
    username:Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{1,30}$")).required(),
    phone:Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    address:Joi.string().required(),
  });

  const { error } = peopleSchema.validate(req.body);

  if (error) {
    let str = error.details[0].message;
    if(str.includes("username")){
    return res.json({status:"404", error:"username cannot contain spaces, Only alphanumeric characters allowed!!"});
    }else
    return res.json({status:"404", error:error.details[0].message});
  }

  try {
    await People.create({
      email: req.body.email,
      username: req.body.username,
      address: req.body.address,
      phone: req.body.phone,
    });

    const users = await People.find();
    return res.json({ status: "ok", users: users });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error", error: "User already exist" });
  }
});

app.delete("/api/quote/:id", auth, async (req, res) => {
  // console.log(req.params.id);
  const user = await People.deleteOne({ _id: req.params.id });
  const users = await People.find();
  return res.json({ status: "ok", users: users });
});

app.listen(8000, () => {
  console.log("server started on ", 8000);
});
