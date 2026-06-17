const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const passport = require("passport");
require("../config/passport")(passport);

const signup = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must atleast be 6 characters" });
    }

    const user = await db.findUserByEmail(email);

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.createUser(username, email, hashedPassword);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("signup controller failed: ", { error });
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "Invalid credentials" });
    }

    req.session.regenerate((err) => {
      if (err) return next(err);

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ user });
      });
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((sessionErr) => {
      if (sessionErr) return next(sessionErr);

      res.clearCookie("connect.sid");

      res.status(200).json({ message: "logout success" });
    });
  });
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user ? req.user : null);
  } catch (error) {
    console.error("checkAuth failed: ", { error });
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
};
