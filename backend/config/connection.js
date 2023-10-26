const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://rojwilli:8Rosemont@cluster0.mit0tdn.mongodb.net/?retryWrites=true&w=majority');

module.exports = mongoose.connection;
