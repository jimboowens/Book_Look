var express = require('express');
var router = express.Router();
const config = require('../config');
const bcrypt = require('bcrypt-nodejs');
const expressSession = require('express-session');
const sessionOptions = config.sessionSecret;
router.use(expressSession(sessionOptions))
const mysql = require('mysql');
let connection = mysql.createConnection(config.db);
connection.connect()
let loggedIn = false;
let msg='';

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
      loggedIn = false;
  }
  next();
});


router.get('/',(req, res, next)=>{
  let msg;
  if(req.query.msg == 'regSuccess'){
    msg = 'You have successfully registered.';
  }else if (req.query.msg == 'loginSuccess'){
    msg = 'You have successfully logged in.';
  }else if (req.query.msg == 'logOutSuccess'){
    msg = 'You have sucessfully logged out.'
  }else if (req.query.msg == 'logOutFail'){
    msg = 'You have not logged in yet.'
  }else if (req.query.msg == 'badPass'){
    msg = 'You entered an incorrect password.'
  }
res.render('index', {msg});
});

router.get('/home',(req,res)=>{
  res.redirect('/');
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
  const email =  req.body.email;
  const password = req.body.password;
  const checkPasswordQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkPasswordQuery,[email],(err, results)=>{
    if(err){console.log('Bad query')};
    if(results.length == 0 ){
      res.redirect('/login?msg=noUser');
    }else{
      const passwordsMatch = bcrypt.compareSync(password,results[0].hash);
      if(!passwordsMatch){
        res.redirect('/login?msg=badPass');
      }else{
        console.log(results[0].id)
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
    res.redirect('/?msg=logOutFail')
  }
  req.session.destroy();
  loggedIn = false;
  res.redirect('/?msg=logOutSuccess')
});

module.exports = router;
