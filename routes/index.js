var express = require('express');
var router = express.Router();

router.get('/',(req, res, next)=> {
  res.render('index', {});
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
  const hashedPass = bcrypt.hashSync(req.body.password);
  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkUserQuery,[req.body.email],(err,results)=>{
      if(err)throw err;
      if(results.length != 0){
          res.redirect('/register?msg=register');
      }else{
          const insertUserQuery = `INSERT INTO users (name, email, hash)
              VALUES
          (?,?,?)`;
          connection.query(insertUserQuery,[req.body.name, req.body.email, hashedPass],(err2, results2)=>{
              if(err2){throw err2;}
              res.redirect('/?msg=regSuccess');
          });
      };
  });
});


router.get('/login', (req, res, next)=>{
  let msg;
  if(req.query.msg == 'noUser'){
      msg = '<h2 class="text-danger">This email is not registered in our system. Please try again or register!</h2>'
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
      if(err)throw err;
      if(results.length == 0 ){
          res.redirect('/login?msg=noUser');
      }else{
          const passwordsMatch = bcrypt.compareSync(password,results[0].hash);
          if(!passwordsMatch){
              res.redirect('/login?msg=badPass');
          }else{
              console.log(results[0].id)
              req.session.name = results[0].name;
              req.session.email = results[0].email;
              req.session.uid = results[0].id;
              req.session.loggedIn = true;
              res.redirect('/?msg=loginSuccess');
          }
      }
  })
});

router.post('/loginProcess',[],(req,res)=>{
  res.json(req.params.body)
})


router.get('/logout',(req, res, next)=>{
  req.session.destroy();
  res.redirect('/login?msg=loggedOut')
});

module.exports = router;
