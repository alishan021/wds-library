const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const Book = require('../models/books');
const Author = require('../models/author');

const imageMimeTypes = [ 'image/jpeg', 'image/png', 'image/gif' ];
const multer = require('multer');
const uploadPath = path.join('public', Book.coverImageBasePath );
const upload = multer({
    dest: uploadPath,
    fileFilter: ( req, file, callback) => {
        console.log(file);
        callback(null, imageMimeTypes.includes(file.mimetype));
    },
    // dest: 'uploads'
})

// All Books Route
router.get('/', async ( req, res ) => {

    let query = Book.find();
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }

    try{
        const books = await query.exec();
        res.render('books/index', { 
            books: books,
            searchOption: req.query 
        })
    }catch(err){
        console.log(err);
        res.redirect('/')
    }
});

// New Books Route
router.get('/new',  async ( req, res ) => {
    renderNewPage( res, new Book())
});

// Create Books Routereq.body.publishDate
router.post('/', upload.single("cover") , async ( req, res ) => {
    const fileName = req.file != null ? req.file.filename : null; 
    console.log(fileName)
    console.log(req.file);
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImage: fileName,
        description: req.body.description
    })
    try{
        const newBook = await book.save();
        console.log(newBook);
        // res.redirect(`books/${newBook.id}`);
        res.redirect(`books`);
    }
    catch(err){
        if(book.coverImage != null ){
            removeBookCover(book.coverImage)
        }
        console.log('inside the books error : ' + err )
        renderNewPage( res, new Book(), true);
    }
})



function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), (err)  => {
        if(err) console.error(err);
    })
}


async function renderNewPage( res, book, hasError = false){
    try{
        const authors = await Author.find({});
        const params = {
            authors,
            book
        }
        if( hasError ) params.errorMessage = 'Error creating Book';
        res.render('books/new', { params, book, authors, errorMessage: params.errorMessage });
    }
    catch(err){
        console.log(err);
        res.redirect('/books');
    }
}




module.exports = router;