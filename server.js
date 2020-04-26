'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express(); 
let testshortURL='';
let testredirectURL='';

// Basic Configuration 
var port = process.env.PORT || 3000;
// allows node to find static content
app.use(express.static(__dirname+'/public'));
const bodyParser=require('body-parser'); 
app.use(bodyParser.json()); 
app.use(cors());   
/** this project needs a db !! **/ 
// connect to teh database
console.log(process.env.MONGO_URI);   
mongoose.connect(process.env.MONGO_URI);  
//const shorturl= require('./models/shorturl');   
// make a schema for teh short URLS
const schema =  mongoose.Schema;
const urlSchema = new schema  ({
      orig_url: String,
      short_url: String
  }, {timestamps: true });
 
const shorturl= mongoose.model("shorturl",urlSchema);     



/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});

app.get("/api/shorturl/new/:url(*)", function (req, res) {
  console.log("GET The URL");  
  var {url}= req.params; 
  let htmlString="<!DOCTYPE html><html> <head>";
  htmlString+=" <script src='app.js'></script>";
  htmlString+="    <title>Morays URL Shortener</title>";
  htmlString+="     <link rel='shortcut icon' href='https://cdn.hyperdev.com/us-east-1%3A52a203ff-088b-420f-81be-45bf559d01b1%2Ffavicon.ico' type='image/x-icon'/> ";
  htmlString+="     <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>";
  htmlString+="     <link href='/public/style.css' rel='stylesheet' type='text/css'>";
  htmlString+="  </head>";
  htmlString+="  <body";
  htmlString+="     <div class='container'>";
  
  if(url!="app.js")
  {
      var regex  =/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  if(regex.test(url)===true)
    {
      var shortNum = Math.floor(Math.random()*100000).toString();
      var data = new shorturl(
      {
        orig_url: url,
        short_url: shortNum
      });
      var test=true;
      data.save(err=>
      { 
        
        if(err)
        {
           res.sendFile(process.cwd() + '/views/error.html');
        }  
      }); 
        testshortURL = shortNum;
        testredirectURL=data.orig_url;
        //console.log(testshortURL+"-"+testredirectURL);
      htmlString+=" <h2>Lets test that short URL</h2>";
  htmlString+=" <section>";
  htmlString+="   <a href='/api/testurl'>https://morayshortened-api.glitch.me/api/shorturl/redirect/"+shortNum+" </a>";
  htmlString+=" </section>";
  htmlString+="  </body>";
  htmlString+=" </html>";
        return res.send(htmlString);
        //return res.sendFile(process.cwd() + '/views/redirect.html');
    
      //return res.json(data); 
    }
    //var data = new shorturl(
      //{
      //  orig_url: "URL DOES MEET REQUIREMENTS FOR A VALID URL",
      //  short_url: shortNum
     // });
    return res.sendFile(process.cwd() + '/views/invalid.html');
    //return res.json(data);
  
  
  //return res.json({url});
        
  //(Step 6)
  //(Step 7) 
  //(Step 8)
  //(Step 9)
  }
  else
  {
    return res.sendFile(process.cwd() + '/views/redirect.html');

  }
  
  
});
app.get("/api/testurl",(req,res)=>
{
  //console.log("test URL  "+testshortURL); 
  var strToCheck = testredirectURL;  
  
     // console.log(strToCheck);

  var re = new RegExp("^(http|https)://","i");
    if(re.test(strToCheck)) 
    { 
      res.redirect(301,strToCheck);
    }
    else
    {
      console.log("redirect");
      res.redirect(301,'http://'+strToCheck);
    }
   

});


app.get("/api/shorturl/redirect/:urlToForward(*)",(req,res,next)=>{
  //console.log("Redirect"); 
  var {urlToForward}= req.params; 
  //console.log(urlToForward); 

  shorturl.findOne({'short_url':urlToForward}, (err,data)=>{
    if(err) return res.send('Error reading database');
    
    var re = new RegExp("^(http|https)://","i");
    var strToCheck = data.orig_url;
    console.log(strToCheck);
    if(re.test(strToCheck))
    { 
      res.redirect(301,data.orig_url);
    }
    else
      {
        res.redirect(301,'http://'+data.orig_url);
      }
  });
});
