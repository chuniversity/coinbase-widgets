const { Router } = require('express')



const router = Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Review API' });
});



module.exports = router;

