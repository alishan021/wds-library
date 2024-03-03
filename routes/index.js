const express = require('express');
const router = express.Router();

const Book = require('../models/books');

router.get('/', async ( req, res ) => {
    let books;
    try{
        books = await Book.find({}).sort({ createdAt: -1 }).limit(10).exec();
        console.log(books);
    }
    catch(err){
        console.log(err);
        books = [];
    }
    res.render('index.ejs', { books });
});



module.exports = router;