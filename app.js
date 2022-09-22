const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.router')
const userRouter = require('./routes/user.router')
const adminRouter = require('./routes/adminRouter')
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1',authRouter)
app.use('/api/v1',userRouter)
app.use('/api/v1/admin',adminRouter)

module.exports = app;