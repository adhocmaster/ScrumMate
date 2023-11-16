const mongoose = require('mongoose');
// var MONGODB_URI = 'mongodb+srv://rojwilli:8Rosemont@cluster0.mit0tdn.mongodb.net/?retryWrites=true&w=majority'  || 'mongodb://127.0.0.1:27017/scrum_mate'
mongoose.connect( 'mongodb+srv://rojwilli:8Rosemont@cluster0.mit0tdn.mongodb.net/?retryWrites=true&w=majority');

module.exports = mongoose.connection;
