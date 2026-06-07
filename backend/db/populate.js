const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS uploaded_files;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bucket_name VARCHAR(255) NOT NULL DEFAULT 'uploads',
  storage_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type VARCHAR(255),
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (bucket_name, storage_path)
);

CREATE INDEX idx_uploaded_files_user_id ON uploaded_files(user_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_updated_at_column
  BEFORE UPDATE ON uploaded_files
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

`;

const client = new Client({
  connectionString: process.env.DB_URI,
});

async function main() {
  try {
    console.log("seeding");
    await client.connect();
    await client.query(SQL);
    console.log("done");
  } catch (error) {
    console.error("Failed to populate", { error });
    throw error;
  } finally {
    await client.end();
  }
}

main();
