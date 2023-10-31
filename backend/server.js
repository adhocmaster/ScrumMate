const express = require('express');
const cors = require('cors');
const PORT = 3001
const app = express();
const connection = require('./config/connection')
const routes = require('./routes')
//middleware
app.use(cors());
app.use(express.json())
app.use(routes)
//routes
// app.get('/', (req, res) => {
//     res.json({ message: 'ExpressJS Connection Established'});
// });

connection.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
});
  
