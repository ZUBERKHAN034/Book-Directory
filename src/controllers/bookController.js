const Book = require("../models/book");
const { uploadFile } = require('../utils/aws');
const { generateId } = require('../utils/generatorId');

//------------------------------------------------------------------------------------------------------------------------------------------------------

const createBook = async function (req, res) {
    try {
        // book details 
        const requestBody = JSON.parse(JSON.stringify(req.body));
        const image = req.files;
        const { title, author, date, chapters, price, coupon } = requestBody;
        console.log(title, author, date, chapters, price, coupon)


        let current_price = price;
        let current_discount = '0%';

        if (coupon === 'FIRSTBOOK') {
            current_price = price - (30 * price) / 100;
            current_discount = '30%';
        }

        // title duplication check
        const isDuplicateTitle = await Book.findOne({ title: title });
        if (isDuplicateTitle) {
            return res.status(400).send({ status: false, message: "Title is already used!" });
        }

        let chapter = [];
        for(let i = 0; i < chapters.length; ++i){
            if(chapters[i] === ',') continue;
            chapter.push(chapters[i]);
        }

        const url_image = await uploadFile(image[0]);
        const bookId = generateId(10);

        const bookData = {
            bookId: bookId, title: title, author: author, date: date, chapters: chapter,
            price: current_price, discounted: current_discount, image: url_image
        }

        //creating book
        const createdBook = await Book.create(bookData);
        const filteredData = await Book.findOne(createdBook).select({ __v: 0, createdAt: 0, updatedAt: 0, _id: 0 });

        res.status(201).send({ status: true, message: "Sucess", data: filteredData });
    } catch (err) {
        res.status(500).send({ status: false, message: "Internal Server Error", error: err.message });
    }
};

//------------------------------------------------------------------------------------------------------------------------------------------------------

const getBooks = async function (req, res) {
    try {

        //filtering the deleted data
        const filter = { isDeleted: false };

        //finding books according to the query given by the user in query params
        const allBook = await Book.find(filter).select({ __v: 0, createdAt: 0, updatedAt: 0, _id: 0 });

        //checking is the findbook is an array and if its length is zero , means empty array
        if (allBook.length === 0) {
            return res.status(404).send({ status: false, message: "Books Not Found" });
        }

        //Sorting of data of array (allBook) by the title value
        const sortedBooks = allBook.sort((a, b) => a.title.localeCompare(b.title));

        //sending response of sortedBooks
        res.status(200).send({ status: true, data: sortedBooks });

    } catch (err) {
        res.status(500).send({ status: false, message: "Internal Server Error", error: err.message });
    }
};

// //------------------------------------------------------------------------------------------------------------------------------------------------------

const getBookById = async (req, res) => {
    try {
        //taking bookId from the user in Path Params
        const bookId = req.params.bookId;

        //searching for book (document) with the bookId given by user
        const selectedBook = await Book.findOne({ bookId: bookId, isDeleted: false }).select({ __v: 0, createdAt: 0, updatedAt: 0, _id: 0 });

        //if no book found
        if (!selectedBook) {
            return res.status(404).send({ status: false, message: `no book found by this BookID: ${bookId}` });
        }

        //sending successful response
        res.status(200).send({ status: true, data: selectedBook });

    } catch (err) {
        res.status(500).send({ status: false, message: "Internal Server Error", error: err.message })
    }
};

// //------------------------------------------------------------------------------------------------------------------------------------------------------

const updateBookById = async function (req, res) {
    try {
        // bookId sent through path params
        const bookId = req.params.bookId;

        // bookId check
        const isPresentBookId = await Book.findOne({ bookId: bookId });
        if (!isPresentBookId) {
            return res.status(404).send({ status: false, message: `no book found by this BookID: ${bookId}` });
        }

        let updateDataBook = {};

        const files = req.files;
        // if there is any file it will be update
        if (files && files.length > 0) {
            updateDataBook["image"] = await uploadFile(files[0]);
        }

        // book details (to be updated) sent through request body
        const requestBody = JSON.parse(JSON.stringify(req.body));

        // update fields sent through request body
        const { title, author, date, chapters, price, coupon } = requestBody;

        // if title is present in req checking through hasOwnProperty
        if (requestBody.hasOwnProperty("title")) {
            // title duplication check
            const isDuplicateTitle = await Book.findOne({ title: title });
            if (isDuplicateTitle) {
                return res.status(400).send({ status: false, message: `${title.trim()} is already exists.Please try a new title.` });
            }
            updateDataBook["title"] = title;
        }

        if (requestBody.hasOwnProperty("author")) updateDataBook["author"] = author;

        if (requestBody.hasOwnProperty("date")) updateDataBook["date"] = date;

        if (requestBody.hasOwnProperty("chapters")) updateDataBook["chapters"] = chapters;

        if (requestBody.hasOwnProperty("price")) updateDataBook["chapters"] = price;

        //updating book details
        const updatedBook = await Book.findOneAndUpdate({ bookId: bookId }, updateDataBook, { new: true });
        const filteredData = await Book.findOne(updatedBook).select({ __v: 0, createdAt: 0, updatedAt: 0, _id: 0 });

        return res.status(200).send({ status: true, data: filteredData });

    } catch (err) {
        res.status(500).send({ status: false, message: "Internal Server Error", error: err.message })
    }
};

// //------------------------------------------------------------------------------------------------------------------------------------------------------

const deleteBookById = async function (req, res) {
    try {
        // bookId sent through path params
        const bookId = req.params.bookId;

        // bookId exists but is not deleted
        const isNotDeleted = await Book.findOne({ bookId: bookId, isDeleted: false }); // database call

        //if no book found
        if (!isNotDeleted) {
            return res.status(404).send({ status: false, message: `no book found by this BookID: ${bookId}` });
        }

        await Book.findOneAndUpdate({ bookId: bookId }, { isDeleted: true, deletedAt: new Date() });

        res.status(200).send({ status: true, message: "Deletion Successful" });
    } catch (err) {
        res.status(500).send({ status: false, message: "Internal Server Error", error: err.message });
    }
};

// //------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = { createBook, getBooks, getBookById, deleteBookById, updateBookById };