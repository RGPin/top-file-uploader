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

/**
 * Store metadata of uploaded file
 * @param {string} id
 * @param {string} path
 * @param {string} originalname
 * @param {string} mimetype
 * @param {number} size
 * @returns {Promise<Object|null>}
 */
const saveMetadata = async (
  id,
  folderName,
  path,
  originalname,
  mimetype,
  size,
) => {
  try {
    const { rows } = await pool.query(
      `
      INSERT INTO uploaded_files (user_id, folder_name, storage_path, original_name, mime_type, file_size)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, bucket_name, folder_name, storage_path, original_name, mime_type, file_size, created_at, updated_at;
      `,
      [id, folderName, path, originalname, mimetype, size],
    );
    return rows[0] || null;
  } catch (error) {
    console.error("saveMetadata failed: ", { error });
    throw error;
  }
};

/**
 * Returns all an array of metadatas of user's uploaded files
 * @param {string} userId
 * @returns {Promise<Object[]>}
 */
const getUserFiles = async (userId) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT id, bucket_name, storage_path, original_name, mime_type, file_size, created_at, updated_at 
      FROM uploaded_files
      WHERE user_id = $1;
      `,
      [userId],
    );
    return rows;
  } catch (error) {
    console.error("getUserFiles failed: ", { error });
    throw error;
  }
};

/**
 * Returns all an array of metadatas of user's uploaded files from a specific folder
 * @param {string} userId
 * @param {string} folderName
 * @returns {Promise<Object[]>}
 */
const getFilesByFolderFromDb = async (userId, folderName) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT id, bucket_name, folder_name, storage_path, original_name, mime_type, file_size, created_at, updated_at
      FROM uploaded_files
      WHERE user_id = $1 AND folder_name = $2
      `,
      [userId, folderName],
    );
    return rows;
  } catch (error) {
    console.error("getFilesByFolderFromDb failed: ", { error });
    throw error;
  }
};

/**
 * Delete file from database, returns deleted row
 * @param {string} fileId
 * @returns {Promise<Object>}
 */
const deleteFileFromDb = async (fileId) => {
  try {
    const { rows } = await pool.query(
      `
      DELETE FROM uploaded_files
      WHERE id = $1
      RETURNING id, bucket_name, storage_path, original_name, mime_type, file_size, created_at, updated_at;
      `,
      [fileId],
    );
    return rows[0] || null;
  } catch (error) {
    console.error("deleteFileFromDb failed: ", { error });
    throw error;
  }
};

/**
 * Returns all folders
 * @param {string} userId
 * @returns {Promise<Object[]>}
 */
const getFoldersFromDb = async (userId) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT folder_name FROM uploaded_files
      WHERE user_id = $1;
      `,
      [userId],
    );
    return rows;
  } catch (error) {
    console.error("getFoldersFromDb failed: ", { error });
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  saveMetadata,
  getUserFiles,
  deleteFileFromDb,
  getFilesByFolderFromDb,
  getFoldersFromDb,
};
