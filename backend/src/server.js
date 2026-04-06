require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');
const models = require('./models'); // Import models to ensure associations are registered

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync models
    await sequelize.sync();
    console.log('Models synced successfully.');

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please use a different port or kill the existing process.`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
      }
    });

    // Keep process alive
    process.on('SIGINT', () => {
      server.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Database connection or sync error:', error.message);
    process.exit(1);
  }
};

startServer();
