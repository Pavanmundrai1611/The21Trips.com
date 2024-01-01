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
app.use(cors());

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
