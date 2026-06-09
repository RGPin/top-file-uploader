const checkAuth = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  return next();
};

module.exports = {
  checkAuth,
};
