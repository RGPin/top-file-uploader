const pool = require("./pool");

/**
 * Returns user object or null
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
const findUserByEmail = async (email) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT id, username, email FROM users 
      WHERE email = $1 LIMIT 1;
      `,
      [email],
    );
    return rows[0] || null;
  } catch (error) {
    console.error("findUserByEmail failed: ", { error });
    throw error;
  }
};

/**
 * Create a user and add to database
 * @param {string} username
 * @param {string} email
 * @param {string} hashedPassword
 * @returns {Promise<Object|null>}
 */
const createUser = async (username, email, hashedPassword) => {
  try {
    const { rows } = await pool.query(
      `
      INSERT INTO users (username, email, hashed_password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email;
      `,
      [username, email, hashedPassword],
    );
    return rows[0] || null;
  } catch (error) {
    console.error("createUser failed: ", { error });
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
};
