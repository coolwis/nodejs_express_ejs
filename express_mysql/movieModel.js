var mongoose =require('mongoose');
var url = 'mongodb://192.168.100.100:27017/Moviest';
mongoose.connect(url);
var conn = mongoose.connection;

conn.on('error', function(err){
    console.error('Error: ', err);
});

conn.on('open', function(){
    console.log('connect');
});


var MovieSchema = mongoose.Schema({
    title: String, 
    director: String, 
    year: Number,
    reviews: [String]
});

var Movie = mongoose.model('Movie', MovieSchema);
module.exports  = Movie;

/*
var movie1 =new Movie({title:'installer', director:'크리소트', year:2014});
movie1.save(function(err, result, rows){
    if(err){
        console.error("Error:", err);
    } else {
        console.log("Success");
    }
});

Movie.create({title:'avata', director:'james', year:2010}).then(function fulfilled(result){
    console.log('success: ' , result);
}, function rejected(err){
    console.error('Error:' + err);
});

Movie.create({title:'star wars', director:'jj', year:2001}, function(err, result){
    if(err){
        console.error('Error:' + err);
    } else {
        console.log( 'success: ' + result);
    }
});
*/