const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const multer = require("multer");
const cookieParser = require("cookie-parser");
const route = require('./routes/route');

// application method
const app = express();

app.set('view engine','ejs')

// global middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(multer().any());

app.use(passport.initialize());
require('./controllers/userController');

/*----------------------------------------------------------------------
🗃️ connect mongo db
----------------------------------------------------------------------*/
mongoose.connect("mongodb+srv://zuberkhan034:Khan5544266@cluster0.ouo9x.mongodb.net/bookdirectory", {
    useNewUrlParser: true
})
    .then((result) => console.log("MongoDb is connected"))
    .catch((err) => console.log(err))

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});