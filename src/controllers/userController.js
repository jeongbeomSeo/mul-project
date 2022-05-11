import User from "../models/User";

export const getSignup = (req, res) => {
  return res.render("signup", { pageTitle: "Sign Up" });
};

export const postSignup = async (req, res) => {
  const {
    body: { userName: name, userId: id, userPassword: password },
  } = req;
  //Checking Database and duplicate users
  //Password confirming
  try {
    await User.create({
      name,
      id,
      // Hashing Password
      password,
    });
  } catch (error) {
    //Create Error Page
    return res.render("/", {
      pageTitle: "Error Page",
      errorMessage: error._message,
    });
  }
  return res.redirect("/");
};
