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


// configure mongoose database
mongoose.connect('mongodb://127.0.0.1/mean_home');
var db = mongoose.connection;
db.once('open',()=>{
	console.log("Databse is online");
});


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// passport
passport.serializeUser(function(user, done) {
  
  done(null, user.id);
 
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
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
	
    User.findOne({id:jwt_payload.sub}, function(err, user) {
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

app.get('/',(req,res)=>{
	res.send('App Started');
});


app.get('/register',(req,res)=>{
	res.render('register');
});

app.post('/register',(req,res)=>{
	var newUser = {
		username:req.body.username,
		password:req.body.password
	};
	User.create(newUser,(err,user)=>{
		if(err){
			console.log(err);
		}else{
			console.log("New user created");
			bcrypt.hash(user.password, 10, function(err, hash) {
				if(err){
					console.log(err);
				}else{
					user.password = hash;
					user.save();
					console.log(user);
					res.redirect('back');
				}
 
			});
			// res.redirect('/login');
		}
	});
});

app.get('/login',(req,res)=>{
	res.render('login');
});

app.post('/login',(req,res)=>{
	var oldUser = {
		username:req.body.username,
		password: req.body.password
	};
	// find registered user by username
	User.findOne({username:oldUser.username},(err,foundUser)=>{
		if(err){
			console.log(err);
		}else{
			// check if the password is correct
			bcrypt.compare(oldUser.password, foundUser.password, function(err, correctUser) {
  			if(err){
  				console.log(err);
  			} else{
  				if(correctUser){
  					// generate token for this user
  				 var token = jwt.sign(foundUser,opts.secretOrKey,{ expiresIn: '1h' });
  					res.json({
  						status:'ok',
  						 token:'JWT '+token,
  						user:{
  							username:foundUser.username,
  							password:foundUser.password,
  							id:foundUser._id
  						}
  					});
  				}else{
  					console.log("Password is incorrect");
  				}
  			}
			});
		}
	});
});

app.get('/profile', passport.authenticate('jwt', { session: false}),
    function(req, res) {
        res.render('profile');
    }
);

app.get('/logout',(req,res)=>{
	req.logout();
	res.redirect('/login');
});


app.listen(3000,()=>{
	console.log("Server started at port 3000");
});	






//###################### DATA BASE USE ONLY ###########################
// User.create({
// 	username:"sathi",
// 	password:'123'
	
// },(err,user)=>{
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("user created");
// 	}
// });

// User.find({},(err,user)=>{
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log(user);
// 	}
// });

// User.remove({},(err,user)=>{
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("all user removed");
// 	}
// });

                