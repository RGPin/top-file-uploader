const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const { rows } = await pool.query(
            `
          SELECT id, username, email, hashed_password FROM users
          WHERE email = $1;
          `,
            [email],
          );
          const user = rows[0];
          if (!user) {
            return done(null, false, { message: "Invalid credentials" });
          }

          const match = await bcrypt.compare(password, user.hashed_password);
          if (!match) {
            return done(null, false, { message: "Invalid credentials" });
          }

          const { hashed_password, ...userSafe } = user;
          return done(null, userSafe);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query(
        `
        SELECT id, username, email FROM users
        WHERE id = $1;
        `,
        [id],
      );

      done(null, rows[0] || null);
    } catch (error) {
      done(error);
    }
  });
};
