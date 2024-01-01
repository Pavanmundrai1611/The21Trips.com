// db.js
const mongoose = require('mongoose');

const Connection = async (username, password) => {
    const dbName = 'ADMIN-BOOKINGS';
    const connectionString = `mongodb+srv://${username}:${password}@admin-side.hnp6htj.mongodb.net/${dbName}?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(connectionString);
        console.log('Database Connected Successfully');
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        throw error;
    }
};

module.exports = Connection;
