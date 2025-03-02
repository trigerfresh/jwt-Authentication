const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');
require('dotenv').config;

const app = express();
const PORT = 3001;

mongoose.connect('mongodb://localhost:27017/test')
.then(()=>{console.log('Connected to MongoDB')})
.catch((err)=>{
    console.log('Error connecting to MongoDB', err)
})

app.use(cors())
app.use(express.json());
app.use('/api/auth', authRoutes);
app.listen(PORT, ()=>{
    console.log(`Server running @ ${PORT}`)
})