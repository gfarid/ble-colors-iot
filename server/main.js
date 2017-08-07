console.log("welcome to server side!!!!");
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/file/:name', function (req, res, next) {
   var options = {
    root: __dirname ,
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
