const express = require('express');
const path = require('path');
const cors = require('cors');
const authRouter = require('./routes/auth.router')
const userRouter = require('./routes/user.router')
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1',authRouter)
app.use('/api/v1',userRouter)

module.exports = app;