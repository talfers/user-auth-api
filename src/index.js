// Import modules
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const mongoURI = require('./config/keys').mongoURI;
const userRoutes = require('./routes/users');
const sessionSecret = require('./config/keys').sessionSecret;

// Passport config
require('./config/passport')(passport)

// BodyParser config
app.use(express.urlencoded({extended: false}));

// Express session config
app.use(session(sessionSecret));

// Passport config
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use(userRoutes);

// Connect to mongoDB
mongoose.connect(
  mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
)
  .then(()=>{console.log("MongoDB Connected...")})
  .catch((err) => {console.log(err)})

// Server config
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})
