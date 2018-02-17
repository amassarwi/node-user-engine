const express     = require('express');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const mongoose    = require('mongoose');

const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./app/lib/config'); // get our config file
const user   = require('./app/models/user'); // get our mongoose model

// initiate express
const app         = express();
const port = process.env.PORT || 9191;

mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

//start the server
app.listen(port);

// basic route
app.get('/', (req, res) => {
    res.send(`Hello! The API is at http://localhost:'${port}/api`);
});

// Setup
app.get('/setup', (req, res) => {

    // create a sample user
    const nick = new user({
        name: 'Nick Cerminara',
        password: 'password',
        admin: true
    });

    // save the sample user
    nick.save((err) => {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});


// API ROUTES -------------------

// get an instance of the router for api routes
const apiRoutes = express.Router();

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', (req, res) => {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', (req, res) => {
    user.find({}, (err, users) => {
        res.json(users);
    });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);


console.log(`Magic happens at http://localhost:${port}`);