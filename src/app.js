const express = require('express');

const app = express();

// This will only handle GET call to /user
app.get('/user', (req, res) => {
  res.send({ firstName: "Depeak", lastName: "Kumar" })
});

app.post('/user', (req, res) => {
  // Saving data to DB
  res.send("Data successfully saved to the database!")
})
app.delete('/user', (req, res) => {
  // Deleted data from DB
  res.send("Deleted successfully")
})

// this will match all the HTTP  method API call to /test
app.use('/test', (req, res) => {
  res.send("Hello from the server")
});

app.use('/', (req, res) => {
  res.send("Namaste from the Dashboard")
});


app.listen(7777, () => {
  console.log(`Server is listening on port localhost:7777`);
});