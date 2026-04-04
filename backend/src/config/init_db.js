const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'flashbasket'}\`;`);
    console.log(`Database ${process.env.DB_NAME || 'flashbasket'} checked/created successfully.`);
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Error creating database:', error.message);
    process.exit(1);
  }
};

setupDB();
