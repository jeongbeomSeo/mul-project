export const home = (req, res) => {
  return res.render("index", { pageTitle: "Main Home Page" });
};

export const error = (req, res) => {
  return res.render("404", { pageTitle: "404 Page" });
};
