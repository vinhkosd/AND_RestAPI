var express = require('express');
var router = express.Router();
const uploadFile = require('../middleware/upload');
const { sendEmail } = require('../controller/emailController');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', uploadFile, async function (req, res, next) {
  try {
    const file = req.file;
    if (!file) {
      const error = new Error('Please upload a file');
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send(file);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error.message
    });
  }
});

router.post('/send-email', async function (req, res, next) {
  try {
    const { email, title, mailContent } = req.body;
    await sendEmail(email, title, mailContent);
    res.send('Email sent successfully');
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error.message
    });
  }
});
module.exports = router;
