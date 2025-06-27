const userModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const loginPage = async (req, res) => {
  res.render("admin/login", {
    layout: false,
  });
};
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      res.status(404).send("Invalid Username or Password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).send("Invalid Password");
    }

    const jwtData = {
      id: user._id,
      fullname: user.fullname,
      role: user.role,
    };
    const token = jwt.sign(jwtData, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.redirect("/admin/dashboard");
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin/");
};

const dashboard = async (req, res) => {
  res.render("admin/dashboard", { role: req.role , fullname: req.fullname});
};

const setting = async (req, res) => {
  res.render("admin/setting");
};
const allUsers = async (req, res) => {
  const users = await userModel.find();
  res.render("admin/users", { users, role: req.role });
};

const addUserPage = async (req, res) => {
  res.render("admin/users/create", { role: req.role });
};

const addUser = async (req, res) => {
  await userModel.create(req.body);
  res.redirect("/admin/users");
};

const updateUserPage = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.render("admin/users/update", { user, role: req.role });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { fullname, password, role } = req.body;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      res.status(404).send("User not found");
    }
    user.fullname = fullname || user.fullname;
    if (password) {
      user.password = password;
    }
    user.role = role || user.role;
    await user.save();
    res.redirect("/admin/users");
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  loginPage,
  adminLogin,
  logout,
  dashboard,
  setting,
  allUsers,
  addUserPage,
  addUser,
  updateUserPage,
  updateUser,
  deleteUser,
};
