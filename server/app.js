const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();
const UsersRouter = require('./routes/UsersRouter');
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use('/',UsersRouter);
mongoose.connect("mongodb+srv://bkalivas:bkalivas@cluster0.lzfus.mongodb.net/umsdatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
});


app.listen(3001, () => {
    console.log("Server is running on port 3001...");
});