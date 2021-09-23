const { Router } = require('express')



const router = Router();

router.get('/', function(req, res) {
  res.json("welcome");
});

router.get('/connect', function(req, res) {
  console.log(req)
});



module.exports = router;

