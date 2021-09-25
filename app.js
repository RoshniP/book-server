const express = require("express");
const BookData = require ('./src/model/Bookdata');
const AuthorData = require('./src/model/Authordata');
const UserData = require('./src/model/Userdata');
const bcrypt = require('bcryptjs');
const cors = require("cors");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
//const app = express();
var  app = new express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// username = "admin";
// password = "1234";

app.post('/login' , function(req,res){
    // let userData = req.body;
    
    let logemail = req.body.email;
    let logpassword = req.body.paswd;
    console.log(logemail);
    UserData.findOne({email : logemail})
    .then( async function(user){
        
        if(user.paswd == logpassword){
            let payload = {subject: logemail + logpassword};
            let token = await jwt.sign(payload,'secretKey').then();
            console.log(token);console.log(logemail);
            res.status(200).send({token});
        }
        else{
            res.status(401).send("Invalid Password");
        }
        
    })
    .catch(function(){
        res.status(401).send("Invalid Email");
    })
})


function verifyToken(req,res,next){
    res.header("Access-control-Allow-Origin" , "*");
    res.header("Access-control-Allow-Methods : GET,POST,PATCH,PUT,DELETE,OPTIONS");
    if(!req.headers.authorization){       
        return res.status(401).send('Unauthorized request');
    }
    
    let token = req.headers.authorization.split(' ')[1];  
    if(token == "null"){
        return res.status(401).send('Unauthorized request');
    }
    
    let payload = jwt.verify(token , 'secretKey');
    console.log(payload);
    if(!payload){
        return res.status(401).send("Unauthorized request");
    }
    req.userId = payload.subject;
    next();   //if correct user request 

}


app.post('/adduser' , function (req,res){
    console.log("add user");
    res.header("Access-control-Allow-Origin" , "*");
    res.header("Access-control-Allow-Methods : GET,POST,PATCH,PUT,DELETE,OPTIONS");
    console.log("insert");
    console.log(req.body);

    // var password = req.body.user.paswd;
    // const hashedPsw =  bcrypt.hash(password,12);

    var user = {
        fname : req.body.user.fname.trim(),
        lname : req.body.user.lname.trim(),
        email : req.body.user.email.trim(),
        phno : req.body.user.phno.trim(),
        username : req.body.user.username.trim(),
        paswd : req.body.user.paswd
    }

    var user = new UserData(user);
     user.save();
});


app.get('/books' , function (req,res){
    res.header("Access-control-Allow-Origin" , "*");
    res.header("Access-control-Allow-Methods : GET,POST,PATCH,PUT,DELETE,OPTIONS");

    BookData.find()
    .then(function(books){ 
        res.send(books);
    });
});

app.get('/authors' , function (req,res){
    res.header("Access-control-Allow-Origin" , "*");
    res.header("Access-control-Allow-Methods : GET,POST,PATCH,PUT,DELETE,OPTIONS");

    AuthorData.find()
    .then(function(authors){ 
        res.send(authors);
    });
});

app.get('/book/:id' , (req,res)=>{
    console.log("bookItem");

    const id = req.params.id; 
    
    BookData.findOne({"_id":id})
    .then((book)=>{
        res.send(book);
    })
})

app.get('/author/:id' , (req,res)=>{
    console.log("authorItem");

    const id = req.params.id; 
    
    AuthorData.findOne({"_id":id})
    .then((author)=>{
        res.send(author);
    })
})

app.post('/insertbook' ,verifyToken, function (req,res){
    res.header("Access-control-Allow-Origin" , "*");
    res.header("Access-control-Allow-Methods : GET,POST,PATCH,PUT,DELETE,OPTIONS");
    console.log("insert");
    console.log(req.body);

    var book = {
        title : req.body.book.title,
        author : req.body.book.author,
        genre : req.body.book.genre,
        summary : req.body.book.summary,
        image : req.body.book.image
    }

    var book = new BookData(book);
    book.save();
});

app.put('/updatebook' ,verifyToken, function(req,res){
    console.log(req.body);
    id = req.body._id,

    title = req.body.title,
    author = req.body.author,
    genre = req.body.genre,
    summary = req.body.summary,
    image = req.body.image

    BookData.findByIdAndUpdate({"_id" : id },
                                  {$set : {
                                      "title" : title,
                                      "author" : author,
                                      "genre" : genre,
                                      "summary" : summary,
                                      "image" : image                                  
                                  }})
    .then(function(){
        res.send();
    })                                  
})

app.delete('/removebook/:id' ,verifyToken, function(req,res){
    id = req.params.id;
    BookData.findByIdAndDelete({ "_id" : id })
    .then(()=>{
        console.log('success');
        res.send();
    })
})

app.post('/insertauthor' ,verifyToken, function (req,res){
    res.header("Access-control-Allow-Origin" , "*");
    res.header("Access-control-Allow-Methods : GET,POST,PATCH,PUT,DELETE,OPTIONS");
    console.log("insert");
    console.log(req.body);

    var author = {
        name : req.body.author.name,
        description : req.body.author.description,
        genre : req.body.author.genre,
        about : req.body.author.about,
        image : req.body.author.image
    }

    var author = new AuthorData(author);
    author.save();
});

app.put('/updateauthor' ,verifyToken, function(req,res){
    console.log(req.body);
    id = req.body._id,

    name_ = req.body.name,
    description = req.body.description,
    genre = req.body.genre,
    about = req.body.about,
    image = req.body.image

    AuthorData.findByIdAndUpdate({"_id" : id },
                                  {$set : {
                                      "name" : name_,
                                      "description" : description,
                                      "genre" : genre,
                                      "about" : about,
                                      "image" : image                                  
                                  }})
    .then(function(){
        res.send();
    })                                  
})

app.delete('/removeauthor/:id' ,verifyToken, function(req,res){
    id = req.params.id;
    AuthorData.findByIdAndDelete({ "_id" : id })
    .then(()=>{
        console.log('success');
        res.send();
    })
})

app.listen(port,()=>{console.log("Server Ready at "+port)});