var express = require('express');
var router = express.Router();
const config = require('../config');
const bcrypt = require('bcrypt-nodejs');
const fetch = require('node-fetch')
const expressSession = require('express-session');
const sessionOptions = config.sessionSecret;
router.use(expressSession(sessionOptions))
const mysql = require('mysql');
let connection = mysql.createConnection(config.db);
connection.connect()
let loggedIn = false;


router.use('*',(req, res, next)=>{
  // console.log("Middleware is working!");
  if(loggedIn){
      // res.locals is the variable that gets sent to the view
      res.locals.id = req.session.uid;
      res.locals.userName = req.session.userName;
      res.locals.email = req.session.email;
      res.locals.loggedIn = true;
  }else{
      res.locals.id = "";
      res.locals.userName = "";
      res.locals.email = "";
      res.locals.loggedIn = false;
      loggedIn = false;
  }
  next();
});

router.get('/',(req, res, next)=>{
  // set up message to communicate with user across pages
  let msg;
  if(req.query.msg == 'regSuccess'){
    msg = `Welcome ${req.session.userName}! You have successfully registered.`;
  }else if (req.query.msg == 'loginSuccess'){
    msg = `Hi ${req.session.userName}! You have successfully logged in.`;
  }else if (req.query.msg == 'logoutSuccess'){
    msg = 'You have sucessfully logged out.'
  }else if (req.query.msg == 'logoutFail'){
    msg = 'You have not logged in yet.'
  }else if (req.query.msg == 'badPass'){
    msg = 'You entered an incorrect password.'
  }else if (req.query.msg == 'reviewSuccess'){
    msg = `Thank you for your review ${req.session.userName}!`
  }else if (req.query.msg == 'reviewFail'){
    msg = `Hmmm, ${req.session.userName} your review did not go through...`
  }
res.render('index', {msg});
});


router.get('/trending', (req,res)=>{  
  let choice = false;
  res.render('trending', {choice}); 
})


router.get('/trending/:id', (req,res, next)=>{
  let msg;
  choice = true;
  const id = req.params.id;
  console.log(req.params.id)
  let url = `https://api.nytimes.com/svc/books/v3/lists/current/${id}.json?api-key`;
//           https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=  
fetch(`${url}=${config.apiKey}`, {
    method: `get`,
  })
  .then(response => { return response.json(); })
  .then(json => { 
    // console.log(JSON.stringify(json))
    json.results.books.forEach((book)=>{
      const ISBN = book.primary_isbn10;
      const title=book.title;
      const author=book.author;
      const publisher= book.publisher; 
      const image=book.book_image;
      const image2=book.book_image;
      const image3=book.book_image;
      const inputQuery = 'select * from books where isbn = ?;';
      // console.log(ISBN,title,author,yearOfPublication,publisher,image)
      connection.query(inputQuery,[ISBN],(err,results)=>{
        if (err) throw err;
        if (results.length == 0){
          const insertQuery =  `insert into books (ISBN,Book_Title, Book_Author, Year_of_Publication, publisher, Image_URL_S, Image_URL_M, Image_URL_L)
                                    values (?,?,?,null,?,?,?,?);`;
          connection.query(insertQuery, [
            ISBN,
            title,
            author,
            publisher,
            image,
            image2,
            image3
          ],(err,results)=>{
            if (err) throw err;
          });
        };
      });
    });
    // console.log(json)
  let choice = true;
    res.render('trending', {json,choice, msg}); 
  });
  // choice = false;
})

router.get('/home',(req,res)=>{
  res.redirect('/');
});

router.get('/contactUs', (req,res,next)=>{
  res.render('contactUs');
})

router.get('/about',(req,res)=>{
  res.render('about', {});
});

router.get('/register',(req, res)=>{
  let msg;
  if(req.query.msg == 'register'){
    msg = 'This email adress is already registered.';
  }else if(req.query.msg == 'badPass'){
    msg = 'Your password must be at least 8 characters long'
  }
  res.render('register',{msg})
});

router.post('/registerProcess',(req, res, next)=>{
  console.log(req.body);
  const hashedPass = bcrypt.hashSync(req.body.password);
  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkUserQuery,[req.body.email],(err,results)=>{
    if(err)throw err;
    if(results.length != 0){
      res.redirect('/register?msg=register');
    }else{
      const insertUserQuery = `INSERT INTO users (User_ID,email,password,User_Name)
      VALUES
    (default,?,?,?);`;
      connection.query(insertUserQuery,[req.body.email, hashedPass, req.body.userName],(err2, results2)=>{
      if(err2){throw err2;}
      req.session.email = req.body.email;
      req.session.userName = req.body.userName;
      req.session.uid = results2.insertId;
      req.session.loggedIn = true;
      res.redirect('/?msg=regSuccess');
      loggedIn = true;
      });
    };
  });
});

router.get('/review',(req, res)=>{
  let msg;
  let genresArray = [
    'Select a Genre',
    'Action',
    'Comedy',
    'Romance',
    'Biography',
    'Childrens',
    'Fantasy',
    'Mystery',
    'Self Help',
    'Adventure',
    'Business'
  ];
  msg = "Write a review!";
  res.render('review',{msg, genresArray});
});

router.post('/reviewProcess', (req,res,next)=>{
  const title = req.body.title;
  const author = req.body.author;
  const isbn = req.body.isbn;
  const rating = Number(req.body.reviewRadios);
  const genre = req.body.nameGenreSelect;
  const uid = req.session.uid;

  const checkIsbnQuery = `SELECT * FROM books WHERE ISBN = ?`;
  const insertReviewQuery = `INSERT INTO ratings (User_ID,Book_Rating,ISBN)
      VALUES
      (?,?,?);`;
  
  connection.query(checkIsbnQuery,[isbn],(err,results)=>{
    if(err)throw err;
    if(results.length == 0 ){
      const insertIsbnQuery = `INSERT INTO books (Book_Title,Book_Author,ISBN,Genre)
      VALUES
      (?,?,?,?);`;
      connection.query(insertIsbnQuery,[title,author,isbn,genre],(err2, results2)=>{
        if(err2){throw err2};
      })
      connection.query(insertReviewQuery,[uid,rating,isbn],(err3, results3)=>{
        if(err3){throw err3};
      })
    }else{
      const insertDuplicateBookQuery = `INSERT INTO duplicate_books (ISBN,Book_Title,Book_Author,Genre)
        VALUES
        (?,?,?,?);`;
      connection.query(insertDuplicateBookQuery,[isbn,title,author,genre],(err4, results4)=>{
        if(err4){throw err4};
      })
      connection.query(insertReviewQuery,[uid,rating,isbn],(err5, results5)=>{
        if(err5){throw err5};
      })
    }
    res.redirect('/?msg=reviewSuccess');
  })
})


router.get('/login', (req, res, next)=>{
  let msg;
  if(req.query.msg == 'noUser'){
    msg = '<h2 class="text-danger">This email is not registered in our system. Please try another email or register.</h2>'
  }else if(req.query.msg == 'badPass'){
    msg = '<h2 class="text-warning">This password is not associated with this email. Please enter again</h2>'
  }
res.render('login',{msg});
});

router.post('/loginProcess',(req, res, next)=>{
  const email = req.body.email;
  const password = req.body.password;
  const checkPasswordQuery = `select * from users where email = ?`;
  connection.query(checkPasswordQuery,[email],(err, results)=>{
    if(err)throw err;
    if(results.length == 0 ){
      res.redirect('/login?msg=noUser');
    }else{
      const passwordsMatch = bcrypt.compareSync(password,results[0].password);
      if(!passwordsMatch){
        res.redirect('/login?msg=badPass');
      }else{
        req.session.email = results[0].email;
        req.session.uid = results[0].User_ID;
        req.session.userName = results[0].User_Name;
        req.session.loggedIn = true;
        loggedIn = true;
        res.redirect('/?msg=loginSuccess');
      }
    }
  })
});


router.get('/logout',(req, res, next)=>{
  if (!loggedIn){
    res.redirect('/?msg=logoutFail')
  }
  req.session.destroy();
  loggedIn = false;
  res.redirect('/?msg=logoutSuccess')
});

module.exports = router;
