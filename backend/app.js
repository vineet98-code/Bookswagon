var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/user');
var profilesRouter = require('./routes/profiles');
var booksRouter = require('./routes/books');

var app = express();

// For local mongo db
// mongoose.connect('mongodb://localhost/conduit_Node_APIs',
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   (err) => console.log(err ? err : "Connected true")
// );

// For cloud mongo db
// const DB= 'mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.f2bw8.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority'

mongoose.connect('mongodb+srv://vinee123:8VKunSP7LzTTRzgp@cluster0.eozyd.mongodb.net/BookStore?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }, (err) => console.log(err ? err : "Connected true")
);

  // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors())
// For dealing in json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/user', userRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// For Production build
if(process.env.NODE_ENV === 'production'){
  app.use(express.static("frontend/build"));
}

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;




