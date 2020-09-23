const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const { CheckTypes } = require('../../lib');
const CheckType = new CheckTypes();

const { customSchema } = require('./schema');

app.use(bodyParser.json());

app.post('/', CheckType.middleware(customSchema, { blockIfErrorOccur: false }), (req, res) => {
  res.status(200).json({ body: req.body, check: req.check });
});

app.listen(3000, () => {
  console.log('[INFO] Server up and running on http://localhost:3000');
});
