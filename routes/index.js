var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',(req, res, next)=> {
  res.render('index', {});
});

router.get('/login',(req,res)=>{
  // res.json(req.body);
  res.render('login', {});

});

router.post('/loginProcess',[],(req,res)=>{
  res.json(req.params.body)
})

module.exports = router;
