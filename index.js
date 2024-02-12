const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

dbConnection();

app.use(cors());

app.use(express.static('/public'));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.use('/api/events', require('./routes/events'));

app.listen(port, () => {
  console.log(`CalendarApp listening on port ${port}!`);
});
