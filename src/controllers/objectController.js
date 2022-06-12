export const error = (req, res) => {
  return res.render("404", { pageTitle: "404 Page" });
};
