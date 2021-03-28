import express from 'express';

const app = express();

// a test route to make sure we can reach the backend
// this would normally go in a routes file
app.get('/test', (req, res) => {
  res.send('Welcome to the backend!')
})

//Set the port that you want the server to run on
const port = process.env.PORT || 8080;
app.listen(port);
console.log('App is listening on port ' + port);
