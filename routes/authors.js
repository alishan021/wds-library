const express = require('express');
const router = express.Router();

const Author = require('../models/author');

// All Authors Route
router.get('/', async ( req, res ) => {
    try{
        let searchOptions = {};
        if(req.query.name != null && req.query.name !== '' ){
            searchOptions.name = new RegExp(req.query.name, 'i');
        }
        const authors = await Author.find(searchOptions);
        res.render('authors/index', { 
            authors,
            searchOptions: req.query
        });
    }catch{
        res.redirect('/');
    }
});

// New Authors Route
router.get('/new', ( req, res ) => {
    res.render('authors/new', { author: new Author()})
});

// Create Author Route
router.post('/', async ( req, res ) => {
       const author = new Author({
            name: req.body.name
       });
    try{
        const newAuthor = await author.save();
        // res.redirect(`/authors/${newAuthor.id}`)
        res.redirect(`/authors`);
    }
    catch(err){
        console.log(err);
        res.render('/authors/new', {
            author: author,
            errorMessage: 'Error creating user '
        });
    }
})



module.exports = router;