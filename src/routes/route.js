const express = require("express");
const passport = require('passport');

const router = express.Router();

const { createBook, getBooks, getBookById, deleteBookById, updateBookById } = require('../controllers/bookController');
const { userLogin, userLogout, callbackUserLogin, generateToken } = require('../controllers/userController');

const { authorization } = require('../middlewares/auth');

//Home page
router.get('/', (req, res) => res.render('index'));
router.get('/addbook', authorization, (req, res) => res.render('addbook'));

//Api for user Login
router.get('/login', userLogin);

router.get('/auth/google/callback', callbackUserLogin, generateToken);

router.get('/logout', authorization, userLogout);

//Api for creating Book
router.post("/book", authorization, createBook);

router.get("/book", authorization, getBooks);

router.get("/book/:bookId", authorization, getBookById);

router.put("/book/:bookId", authorization, updateBookById);

router.delete("/book/:bookId", authorization, deleteBookById);


//Product Api's

//Cart Api's

//Order Api's


// if api is invalid OR wrong URL
router.all("/*", function (req, res) {
  res.status(404).send({ status: false, msg: "The api you requested is not available" });
});


module.exports = router;