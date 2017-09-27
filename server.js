var express = require('express'),
    path = require("path"),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    session = require('express-session'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    mongoose = require('mongoose'),
    User = require('./models/user');
app = express();

let port = process.env.PORT || 3000;

// configure mongoose database
mongoose.connect('mongodb://uzzol101:*********@ds125183.mlab.com:25183/mean_home');
var db = mongoose.connection;
db.once('open', () => {
    console.log("Databse is online");
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// passport
passport.serializeUser(function(user, done) {

    done(null, user.id);

});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);

    });
});
// passport jwt 
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'secret';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log(jwt_payload);

    User.findById({ _id: jwt_payload._doc._id }, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);


        } else {
            done(null, false);
            // or you could create a new account 
        }
    });
}));



// routes

app.get('/', (req, res) => {
    res.send("Invalid endpoint");
});


// app.get('/register', (req, res) => {
//     res.render('register');
// });

app.post('/register', (req, res) => {
    var newUser = {
        username: req.body.username,
        password: req.body.password
    };

    // find a user in mongo with provided username
    User.findOne({ username: newUser.username }, (err, user) => {
        if (err) {
            console.log(err);
        }
        // already exist
        if (user) {
            res.json({
                success: false,
                msg: "User already exist"
            });
        } else {
            // if there is no user with that name create new user
            User.create(newUser, (err, user) => {
                if (err) {
                    res.json({ success: false, msg: "could not register user" });
                    console.log(err);
                } else {
                    console.log("New user created");
                    bcrypt.hash(user.password, 10, function(err, hash) {
                        if (err) {
                            console.log(err);
                        } else {
                            user.password = hash;
                            user.save();
                            console.log(user);

                        }

                    });
                    res.json({ success: true, msg: "user Registered" });

                }
                // res.send('success');
            });
        }
    })

});

// app.get('/login', (req, res) => {
//     res.render('login');
// });
app.post('/login', (req, res) => {
    var oldUser = {
        username: req.body.username,
        password: req.body.password
    };
    // find registered user by username
    User.findOne({ username: oldUser.username }, (err, foundUser) => {
        if (err) {
            console.log(err);


        } else {

            // check if the given username exist
            if (foundUser) {
                // check if the password is correct
                bcrypt.compare(oldUser.password, foundUser.password, function(err, correctUser) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (correctUser) {
                            // generate token for this user
                            var token = jwt.sign(foundUser, opts.secretOrKey, { expiresIn: '1h' });
                            res.json({
                                success: true,
                                token: 'JWT ' + token,
                                user: {
                                    username: foundUser.username,
                                    id: foundUser._id
                                }
                            });
                        } else {
                            res.json({ success: false, msg: "password is incorrect" })
                        }
                    }
                });
            } else { // user name does not exist
                res.json({ success: false, msg: "username not exist" })
            }
        }
    });
});

// jwt protected route
app.get('/profile', passport.authenticate('jwt', { session: false }),
    function(req, res) {
        res.json({
            user: req.user


        });
    }
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(port, () => {
    console.log("Server started at port", port);
});






//###################### DATA BASE USE ONLY ###########################
// User.create({
//  username:"sathi",
//  password:'123'

// },(err,user)=>{
//  if(err){
//      console.log(err);
//  }else{
//      console.log("user created");
//  }
// });

// User.find({},(err,user)=>{
//  if(err){
//      console.log(err);
//  }else{
//      console.log(user);
//  }
// });
// User.remove({}, (err, user) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("all user removed");
//     }
// });
