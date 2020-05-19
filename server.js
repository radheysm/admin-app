const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();



// Connect Database
connectDB();

// Init Middleware
app.use(express.json({exteded:false}));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    // res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// app.get('/',(req,res)=>res.send('API is Running'));

// Define Routes
app.use('/uploads',express.static('uploads'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));