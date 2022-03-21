//영화 List
//template engine : ejs

var express =require('express');
var bodyParser = require('body-parser');

var app= express();

//template
app.set("view engine", "ejs"); //install module
app.set("views", "views");  //view files path

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(require('./movieRouter'));

app.get('/', function(req, res){
    res.end("welcome to Movei app");
});

app.use(handleError);

function handleError(err, req, res, next){
    console.log('Error: ', err);
    res.status(err.code).send({msg: err.message});
}

app.listen(3000);
 