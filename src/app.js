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

app.listen(3000, () => {
  console.log(`Server is listening on port localhost:3000`);
});