const express = require('express');             // Using expressjs dependency
const path = require('path');                   // Core NodeJS module
const session = require('express-session');
const exphbs = require('express-handlebars');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const db = require('./config/database');        // Config for database to use based on environment

const app = express();   // Initializes application

/** LOAD ROUTES **/
const ideas = require('./routes/ideas');
const users = require('./routes/users');

/** Passport Config **/
require('./config/passport')(passport);


/** CONNECTING TO DB : MONGOOSE
 * Remote or local DB could be used
 */
mongoose.Promise = global.Promise; // Mapping global promise to get rid of mongoose promise warning
mongoose.connect(db.mongoURI, {    // 'vidjot-dev' is used for local, mlab used for prod (in heroku)
    useMongoClient: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));    // Allows app to use 'public' folder globally. '__dirname' is curr path
    
/** MIDDLEWARE (not used)
 * Allows you to intercept all requests and responses for the declared APIs
 * Can modify response returned from the APIs
 */
/*
app.use((req, res, next) => {
    req.name = 'Some Name'; // Now all requests have access to 'name' attribute declared as 'Some Name'
    next();     // Runs next function
});
*/

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

// Passport middleware - Passport methods to serialize/deserialize user to obtain session cookies
app.use(passport.initialize());
app.use(passport.session());

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'   // View which wraps around all other views
    // Declared in /views/layouts/main.handlebars
}));
app.set('view engine', 'handlebars');

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// Method-override middleware (allows forms to support put/delete requests)
app.use(methodOverride('_method'));     // Override with POST having ?_method=PUT

// Using connect-flash middleware
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error= req.flash('error');
    res.locals.user = req.user || null;     // User only available upon login, utilize this global user var to change web content (e.g. hide login/register and show other funcitonalities)
    next();     // Call next piece of middleware
});

/** DECLARING ROUTES **/
// Index route
app.get('/', (req, res) => {    // Handling a GET request for index url
    const title = 'Welcome';
    res.render('index', { title: title });        // Using handlebars to render index page
});

// About route
app.get('/about', (req, res) => {
    res.render('about');
});


/** USE DECLARED ROUTES (after middleware) **/
app.use('/ideas', ideas);   // Anything which uses ideas, pertains to the ideas routes file
app.use('/users', users);


// Exposing server
const port = process.env.PORT || 5000;          // Auto use deployment port (heroku) or use declared port (local testing) to listen on
app.listen(port, () => {    // Listens to specified port number with callback function
    console.log(`Server started on port: ${port}`);        // Using ` (tilde) for template string
});

