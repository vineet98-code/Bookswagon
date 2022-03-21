var express = require('express');
var router = express.Router();
var User = require('../models/User');
var auth = require('../middleware/auth');
var Book = require('../models/Book');

// create Books
router.post('/', auth.verifyToken, async (req, res, next) => {

    try {
        
        req.body.author = req.user.userId;
        // console.log(req.body.author)
        const book = await Book.create(req.body);

        var bookData = await Book.findOne({ _id: book._id }).exec();
            
            return res.json({ 
                book: bookData.toJSONFor() })
    } catch (error) {
        next(error);
    }
});


// Get all Books
router.get('/', auth.optionalAuth, async function (req, res, next) {
    const query = {}
    const { limit, offset} = req.query
  
    if (typeof req.query.tag !== 'undefined') {
      query.tagList = { $in: [req.query.tag] }
    }
    
    Promise.all([
        req.query.author ? User.findOne({ username: req.query.author }) : null,
        req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
    ]).then(function (results) {
        const [author, favoriter] = results
        
        if (author) {
            query.author = author._id
        } else if (req.query.author) {
            query._id = { $in: [] }

        }
        if (favoriter) {
            query._id = { $in: favoriter.favorites }
        } else if (req.query.favorited) {
            query._id = { $in: [] }
        }
        console.log(query);
       return Promise.all([
        Book.find(query)
          .limit(Number(limit))
          .skip(Number(offset))
          .sort({ createdAt: -1 }) // -1 means descending order, +1 means ascending order
          .populate('author')
          .exec(),
          Book.countDocuments(query).exec(),
        req.user ? User.findById(req.user.id) : null
      ]).then((results) => {
        const [books, booksCount, user] = results
  
        return res.json({
            books: books.map((book) => {
            return book.toJSONFor(user);

          }),
          booksCount: booksCount
        })
      })
    }).catch(next)
  }
);

// Get all tags
router.get('/tags', async (req, res, next) => {
    try {
        let tags = await Book.distinct('tagList');
        res.status(200).json({ tags: tags });
    } catch (error) {
        next(error);
    }
});

// Fetch Single Books
router.get('/:id', async (req, res, next) => {
    let id = req.params.id;
    const match = {};
    
    try {
        const singleBook = await Book.findOne({id}, req.body).populate('author', 'username email ').exec();
        console.log({ singleBook })  
        return res.json({ book: singleBook.toJSONFor() });
    } catch (error) {
        next(error);
    }
});


// Update Books 
router.put('/:id', auth.verifyToken, async (req, res, next) => {
    var id = req.params.id;
    try {
        var updatedBook = await Book.findOneAndUpdate({ id }, req.body, { new: true }).populate("author","username email").exec();
        res.status(200).json({ book: updatedBook });
    } catch (err) {
        next(err);
    }
});

// Delete Books
router.delete('/:id', auth.verifyToken, async (req, res, next) => {
    var id = req.params.id;
    try {
        var book = await Book.findOneAndDelete({ id });
        res.status(200).json({ msg: 'Book is successfully deleted' });
    } catch (error) {
        next(error);
    }
});


module.exports = router;


