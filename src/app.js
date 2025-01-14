const express = require('express');

const app = express();
app.use('/', (req, res) => {
  res.send("Namaste from the Dashboard")
});

app.use('/hello', (req, res) => {
  res.send("Hello hello hello")
});
app.use('/test', (req, res) => {
  res.send("Hello test test")
});

app.listen(7777, () => {
  console.log(`Server is listening on port localhost:7777`);
});