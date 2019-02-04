const express = require('express');
const router = express.Router();
const config = require('../config');
const bcrypt = require('bcrypt-nodejs');
const expressSession = require('express-session');
const sessionOptions = config.sessionSecret;
const mysql = require('mysql');
const connection = mysql.createConnection(config.db);
let loggedIn = false;
const fetch = require('node-fetch');

router.use(expressSession(sessionOptions));
connection.connect()

router.use('*',(req, res, next)=>{
  // console.log("Middleware is working!");
  if(loggedIn){
      // res.locals is the variable that gets sent to the view
      res.locals.id = req.session.uid;
      res.locals.email = req.session.email;
      res.locals.loggedIn = true;
  }else{
      res.locals.id = "";
      res.locals.email = "";
      res.locals.loggedIn = false;
      // loggedIn = false;
  }
  next();
});


router.get('/',(req, res, next)=>{
  let msg;
  if(req.query.msg == 'regSuccess'){
    msg = 'You have successfully registered.';
  }else if (req.query.msg == 'loginSuccess'){
    msg = 'You have successfully logged in.';
  }else if (req.query.msg == 'logoutSuccess'){
    msg = 'You have sucessfully logged out.'
  }else if (req.query.msg == 'logoutFail'){
    msg = 'You have not logged in yet.'
  }else if (req.query.msg == 'badPass'){
    msg = 'You entered an incorrect password.'
  }else if (req.query.msg == 'reviewFail'){
    msg = ''
  }
  res.render('index', {msg});
});

router.get('/trending', (req,res)=>{  

let url = `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key`;
// https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=ndA72R1EIfGvSDeT6XhKwTn7G6EaOVzV  
fetch(`${url}=${config.nytApiKey}`, {
    method: `get`,
  })
  .then(response => { return response.json(); })
  .then(json => { 
    // console.log(json)
    res.render('trending', {json}); 
  });
})

router.get('/home',(req,res)=>{
  res.redirect('/');
});
router.get('/about',(req,res)=>{
  let msg;
  res.render('about', {msg});
  
});

router.get('/contactUs',(req,res)=>{
  let msg;
  res.render('contactUs', {msg});
  
});

router.get('/myBookList',(req,res)=>{
  let msg;
  res.render('myBookList', {msg});
  
});

router.get('/register',(req, res)=>{
  let msg;
  if(req.query.msg == 'register'){
    msg = 'This email adress is already registered.';
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
      const insertUserQuery = `INSERT INTO users (user_ID,email,password)
      VALUES
    (default,?,?);`;
      connection.query(insertUserQuery,[req.body.email, hashedPass],(err2, results2)=>{
      if(err2){throw err2;}
      res.redirect('/?msg=regSuccess');
      loggedIn = true;
      });
    };
  });
});


// router.get('/review',(req, res)=>{
//   let msg;
//   if (!loggedIn){
//     msg = 'If you want to review a book, you must first log in.';
//   } else {
//     // if(req.query.msg == 'review'){
//       msg = 'Enter a new book to review.';
//       res.render('review',{msg})
//     // }
//   }
// });


router.get('/review',(req, res)=>{
  let msg;
  msg = "Write a review!";
  res.render('review',{msg});
})


router.post('/reviewProcess', (req,res,next)=>{

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
