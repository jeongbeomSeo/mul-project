import bcrypt from "bcrypt";
import User from "../models/User";

export const getSignup = (req, res) => {
  return res.render("signup", { pageTitle: "Sign Up" });
};

export const postSignup = async (req, res) => {
  const {
    body: { userName: name, userEmail: email, id, password, passwordConfirm },
  } = req;
  const pageTitle = "Sign Up";
  //Checking Database and duplicate users
  const exists = await User.exists({ $or: [{ name }, { userId: id }] });
  if (exists) {
    return res.status(400).render("signup", {
      pageTitle,
      errorMessage: "This userName or id is already taken.",
    });
  }
  //Confirm Password
  if (password !== passwordConfirm) {
    return res.status(400).render("signup", {
      pageTitle,
      errorMessage: "Password Confirmation does not match.",
    });
  }
  try {
    await User.create({
      name,
      email,
      userId: id,
      password,
    });
    return res.redirect("/");
  } catch (error) {
    //Create Error Page
    return res.status(400).render("404", {
      pageTitle: "Error Page",
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login Page" });
};

export const postLogin = async (req, res) => {
  const { id, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ userId: id });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }
  const passwordCheck = await bcrypt.compare(password, user.password);
  if (!passwordCheck) {
    return res.status(400).render("login", {
      pageTitle: pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const profile = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  // 다른 사람이 남의 Profile 접근 못하도록 방지.
  if (id !== user._id) {
    return res.status(400).render("404", {
      pageTitle: "ErrorPage",
      errorMessage: "You are not the owner of the profile account.",
    });
  }
  // 구매 유저 품목 불러오기.
  const buyer = await User.findById(user._id).populate({
    path: "buyItems",
    populate: {
      path: "user",
      select: { name: 1 },
    },
  });
  return res.render("profile", { pageTitle: "Profile", buyer });
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getChargeMoney = async (req, res) => {
  const {
    params: { id },
  } = req;
  const user = await User.findOne({ _id: id });
  user.money += 5000;
  const updateUser = await User.findByIdAndUpdate(
    id,
    {
      money: user.money,
    },
    { new: true }
  );
  req.session.user = updateUser;

  return res.redirect("/");
};
