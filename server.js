const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();



// Connect Database
connectDB();

app.get('/',(req,res)=>res.send('API is Running'));

// 

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));