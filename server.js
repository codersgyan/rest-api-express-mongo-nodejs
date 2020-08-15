const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()

// Database connection 
const url = 'mongodb://localhost/api-test';
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });
const connection = mongoose.connection;
connection.once('open', () => {
console.log('Database connected...');
}).catch(err => {
console.log('Connection failed...')
});
app.use(express.json())

// app.get('/jwt', (req, res) => {
//     const token = jwt.sign({ name: 'Rakesh', email: "kohali@gmail.com"}, process.env.JWT_SECRET);
//     res.send(token)
// })
const registerRoute= require('./routes/register')
const loginRoute= require('./routes/login')
const articlesRoute = require('./routes/articles')
const refreshRoute = require('./routes/refresh')
const logoutRoute = require('./routes/logout')

// Routes
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/articles', articlesRoute);
app.use('/api/refresh', refreshRoute);
app.use('/api/logout', logoutRoute);
app.use('/api/user', require('./routes/users'));



const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})