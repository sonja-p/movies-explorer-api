require('dotenv').config();

const {
  JWT_SECRET, PORT, NODE_ENV, DATABASE_PATH,
} = process.env;

const CURRENT_JWT_SECRET = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'dev-secret';
const CURRENT_PORT = NODE_ENV === 'production' && PORT ? PORT : 3000;
const CURRENT_DATABASE_PATH = NODE_ENV === 'production' && DATABASE_PATH ? DATABASE_PATH : 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  CURRENT_JWT_SECRET,
  CURRENT_PORT,
  CURRENT_DATABASE_PATH,
};
