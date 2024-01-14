const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoutes');
const authRoutes = require('../routes/authRoutes');
const noteRoutes = require('../routes/noteRoutes');
// const {verifyToken} = require('../utils');

const app = express();

dotenv.config();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth',  authRoutes);
app.use('/notes', noteRoutes);

module.exports = app;