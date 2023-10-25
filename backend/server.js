const express = require('express');
const cors = require('cors');
const PORT = 5000
const app = express();

//middleware
app.use(cors());
app.use(express.json())

//routes
app.get('/', (req, res) => {
    res.json({ message: 'ExpressJS Connection Established'});
});

app.listen(PORT, () => {
    console.log(`Server connected to port ${PORT}`);
})