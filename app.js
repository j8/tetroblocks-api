'use strict';

// eslint-disable-next-line import/no-unresolved
const express = require('express');
const path = require('path')
const cdnUrl = 'https://d1303evvji3ltr.cloudfront.net/'
const app = express();
const port = process.env.PORT || 3000    

app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs')
// generator
app.get('/generate/:id', (req, res) => {
  res.render(__dirname + "/source/index", { tokenId: req.params.id });
});
// redierct to cloudfront
app.get('/image/:id', (req, res) => {
  res.redirect(301, cdnUrl + req.params.id)
});
// get api version
app.get('/', (req, res) => {
  res.json({
  "name": "TetroBlocks API",
  "version": "1.0.0"
  })
});
// send errors
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.sendStatus(500).send('Internal Serverless Error');
  console.error(err);
})
app.engine('html', require('ejs').renderFile);
app.listen(port, () => console.log(`App listening on port ${port}`))
module.exports = app;
