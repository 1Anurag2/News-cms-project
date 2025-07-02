const userModel = require("../models/User");
const categoryModel = require("../models/Category");
const articalModel = require("../models/News");
const siteModel = require("../models/siteChange");
const createError = require("../utils/error-message");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const loginPage = async (req, res) => {
  res.render("admin/login", {
    layout: false,
  });
};
const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      // res.status(404).send("Invalid Username or Password");
      return next(createError("Invalid Username or Password", 404));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // res.status(400).send("Invalid Password");
      return next(createError("Invalid Password", 404));
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
    // console.log(e);
    // res.status(500).send("Internal Server Error");
    next(e);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin/");
};

const dashboard = async (req, res, next) => {
  try {
    let articalcount;
    if (req.role == "Author") {
      articalcount = await articalModel.countDocuments({ author: req.id });
    } else {
      articalcount = await articalModel.countDocuments({});
    }
    const usercount = await userModel.countDocuments({});
    const categorycount = await categoryModel.countDocuments({});

    res.render("admin/dashboard", {
      role: req.role,
      fullname: req.fullname,
      usercount,
      categorycount,
      articalcount,
    });
  } catch (error) {
    // console.error('Error counting documents:', error);
    // res.status(500).json({ error: 'Internal server error' });
    next(error);
  }
};

const setting = async (req, res, next) => {
  try {
    const setting = await siteModel.findOne();
    res.render("admin/setting", { role: req.role, setting });
  } catch (error) {
    // console.error('Error getting site settings:', error);
    // res.status(500).json({ error: 'Internal server error' });
    next(error);
  }
};

const save_setting = async (req, res, next) => {
  const { website_title, footer_description } = req.body;
  const website_logo = req.file ? req.file.filename : null;
  try {
    const setting = await siteModel.findOneAndUpdate(
      {},
      { website_title, footer_description, website_logo },
      { upsert: true, new: true }
    );
    res.redirect(`/admin/setting`);
  } catch (error) {
    // console.error('Error creating site settings:', error);
    // res.status(500).json({ error: 'Internal server error' });
    next(error);
  }
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

const updateUserPage = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      res.status(404).send("User not found");
    }
    res.render("admin/users/update", { user, role: req.role });
  } catch (e) {
    // res.status(500).send(e.message);
    next(e);
  }
};

const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { fullname, password, role } = req.body;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      // res.status(404).send("User not found");
      return next(createError("User not found", 404));
    }
    user.fullname = fullname || user.fullname;
    if (password) {
      user.password = password;
    }
    user.role = role || user.role;
    await user.save();
    res.redirect("/admin/users");
  } catch (e) {
    // console.log(e);
    // res.status(500).send("Internal Server Error");
    next(e);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      // res.status(404).send("User not found");
      return next(createError("User not found", 404));

    }
    res.json({ success: true });
  } catch (e) {
    // console.log(e);
    // res.status(500).send("Internal Server Error");
    next(e);
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
  save_setting,
};
