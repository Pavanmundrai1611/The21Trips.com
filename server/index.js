const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const Routes = require('./route.js');
const Connection = require('./db.js');

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure cors with the allowed origin
const corsOptions = {
  origin: 'https://the21-trips-com-api.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // enable set cookie
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use('/', Routes);

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await Connection(USERNAME, PASSWORD);
    app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
})();
