// server.js
// load the things we need
const MongoClient = require('mongodb').MongoClient; //npm install mongodb@2.2.32
const url = "mongodb://localhost:27017/profiles";
var express = require('express');
const session = require('express-session'); //npm install express-session
var app = express();
app.use(express.static('public'))
const bodyParser = require('body-parser'); //npm install body-parser
var errorImage = "prototype\public\wallhaven-v9poql.jpg"
//code to tell express we want to read POSTED forms
app.use(bodyParser.urlencoded({
    extended: true
  }))

//this tells express we are using sesssions. These are variables that only belong to one user of the site at a time.
app.use(session({ secret: 'example' }));
// set the view engine to ejs
app.set('view engine', 'ejs');
// use res.render to load up an ejs view file
// index page
// app.get('/', function(req, res) {
//  res.render('pages/index');
// });

//variable to hold our Database
app.use(bodyParser.urlencoded({
  extended: true
}))
var db;

//this is our connection to the mongo db, ts sets the variable db as our database
MongoClient.connect(url, function (err, database) { 
  if(!err){
    db = database; 
  }
  else{ // renders the error page in case the database does not exist
    res.render('pages/error',{ 
      img:errorImage
    })
    console.log("error connecting to databse "+err)
  }
  app.listen(8080);
  console.log('listening on 8080');
 
}); 

// upcoming movies page get function
app.get('/index2', function(req,res){
    if(!req.session.loggedin){res.redirect('/login');return;}
    res.render('pages/index2')
});
// functions returns trending page
app.get('/trending', function(req,res){
    if(!req.session.loggedin){res.redirect('/login');return;}
    
    res.render('pages/Trending')
});

// returns search page as the initial page
app.get('/', function(req, res) {
 res.render('pages/index');
});
// testing the error page
app.get('/error', function(req,res){
  res.render('pages/error',{
    img:errorImage
  })
})
// returns search page as a destination
app.get('/index', function(req,res){
    res.render('pages/index')
});
// returns the login page
// if the user already logged in then instead it logs the user out and redirects the user to the logout function
app.get('/login', function(req,res){
    if(req.session.loggedin){res.redirect('/logout');return;}

res.render('pages/login')
});
// returns page to add new user
app.get('/add', function(req,res) {
  res.render('pages/add')
    });
//returns page to update a user
app.get('/update', function(req,res) {
      res.render('pages/update')
        });
// returns the profile page
//
app.get('/profile', function(req, res) {
    if(!req.session.loggedin){res.redirect('/login');return;}
    
    
    var uname = req.session.currentuser;
    console.log(req.session.currentuser)
    
   //finds the username information in the database of the user logged which is logged in and returns the information
    db.collection('people').findOne({"login.username": uname}, function(err, result) {
      if (err) {
        console.log(err)
        res.render('pages/error',{
          img:errorImage
        })
      };
    
  
      console.log(result)
     
  
  //returns the profile page with the information from the database
      res.render('pages/profile', {
        
        user: result
        
      })
    });
  
  });
// this function destroys the logged is session and redirects to the home page
  app.get('/logout', function(req,res){
    req.session.loggedin = false;
  req.session.destroy();
  res.redirect('/');

    }
  );
//********** POST ROUTES - Deal with processing data from forms ***************************



//adding a favourite cinema
app.post('/upass', function(req,res){
  var cinema =  req.body.password
    
  var password = req.body.oldpassword
  var uname = req.body.username;
  // finds the user data
  db.collection('people').findOne({"login.username":uname}, function(err, result) {
    if (err) { // error path 
// loggs in  the error in case occured
      console.log(err)
    };


    if(!result){ // if there is no profile then the page will just reset
      
      res.redirect('/update');return}



    if(result.login.password == password){ // checks the password
      
      // uses the data provided by the forms to update the password
      db.collection('people').updateOne({"login.username":uname},{$set:{"login.password":cinema}}, function(err, result){
        if (err){
          console.log(err)
        } 
        
        console.log('updated');
        
      });
      
      
      res.redirect('/login'); }



    else{res.redirect('/update')}// if the password was wrong then the page reloads
  });

  


})
// adds the favourite cinema to the database
app.post('/addCinema', function(req,res){
  var cinema = {
    cinema_name: req.body.cinema,
    cinema_adress : req.body.cAdress
  }
  var uname = req.session.currentuser;
  db.collection('people').updateOne({"login.username":uname},{$set:cinema}, function(err, result){
    if (err){
      console.log(err)
    } 
    
    console.log('updated');
    res.redirect('/profile');
  })

  


})


//the dologin route detasl with the data from the login screen.
//the post variables, username and password ceom from the form on the login page.
app.post('/dologin', function(req, res) {
    console.log(JSON.stringify(req.body))
    var uname = req.body.username;
    var pword = req.body.password;
    req.session.currentuser = uname;
  
  
  
    db.collection('people').findOne({"login.username":uname}, function(err, result) {
      if (err) {

        console.log(err)
      };
  
  
      if(!result){
        
        res.redirect('/login');return}
  
  
  
      if(result.login.password == pword){ req.session.loggedin = true; res.redirect('/') }
  
  
  
      else{res.redirect('/login')}
    });
    
  });
  app.post('/adduser', function(req, res) {
   
    
  
    //we create the data string from the form components that have been passed in
  
    var datatostore = {
      "gender":req.body.gender,
      "name":{"title":req.body.title,"first":req.body.first,"last":req.body.last},
      "location":{"street":req.body.street,"city":req.body.city,"state":req.body.state,"postcode":req.body.postcode},
      "email":req.body.email,
      "login":{"username":req.body.username,"password":req.body.password},
      "dob":req.body.dob,"registered":Date(),
      "picture":{"large":"wallhaven-v9poql.jpg","medium":"wallhaven-v9poql.jpg","thumbnail":"wallhaven-v9poql.jpg"},
      "nat":req.body.nat}
  
  
  //once created we just run the data string against the database and all our new data will be saved/
    db.collection('people').save(datatostore, function(err, result) {
      if (err) {
        console.log(err)
      };
      console.log('saved to database')
      //when complete redirect to the index
      res.redirect('/login')
    })
  });
  app.post('/delete', function (req, res) {
    //check we are logged in.
    if (!req.session.loggedin) {
      res.redirect('/login');
      return;
    }
    //if so get the username variable
    var uname = req.session.currentuser;
  
    //check for the username added in the form, if one exists then you can delete that doccument
    db.collection('people').deleteOne({
      "login.username": uname
    }, function (err, result) {
      //if there is an error doing the user search
      if(err){
        //render the bad error page and passdown the error
        //res.render('pages/baderror',{error:err} );

        console.log(err);
        return;
      }
      //when complete redirect to the index
      req.session.loggedin = false;
      req.session.destroy();
      res.redirect('/login');
    });
  });


// handle POST request to /logout
app.post('/logout', function(req, res) {
  // destroy session and redirect to login page
  req.session.destroy();
  res.redirect('/login');
});
  
  

