var express = require('express');
var router  = express.Router();

var fs =require('fs');
var initialDB  = fs.readFileSync('./initialDB.json');
var movieList  = JSON.parse(initialDB);

router.get('/movies',  showMovieList);
router.get('/movies/:movieId', showMovieDetail);
router.post('/movies/:movieId', addReview);


function showMovieList(req, res, next){
    var data=[];
    movieList.forEach(function(movie){
        var info={
            movieId: movie.movieId,
            title: movie.title
        };
        data.push(info);
    });

    var result ={
        count: data.length,
        data: data
    }
    res.render('movieList', result);
}

function addReview(req, res, next){
    var movieId  =req.params.movieId;
    var movie= findMovie(movieId);
    if(!movie){
        // res.status(404).send({msg: 'not found'});
        // return;
        var error = new Error('Not Found');
        error.code  =  404;
        return next(error);  //error handler로 호출
    }

    var review  =req.body.review;    
    movie.reviews.push(review);
    // res.send({msg: 'success'});
    res.redirect('/movies/'+ movieId); //detail page
}

function findMovie(movieId){
    var movie  =null ;
    for(var i=0; i<movieList.length; i++){
        var item = movieList[i];
        if(item.movieId == movieId){
            movie = item; 
            break;
        }
    }
    return movie;
}

function showMovieDetail(req, res, next){
    var movieId =req.params.movieId;
    var movie  =null ;
    for(var i=0; i<movieList.length; i++){
        var item = movieList[i];
        if(item.movieId == movieId){
            movie = item; 
            break;
        }
    }

    if(!movie){
        // res.status(404).send({msg: 'Not Found'});
        // return;
        var error  =new Error('Not Found');
        error.code  =  404;
        return next(error);  //error handler로 호출
    }

    // res.status(200).send(movie);
    res.render("movieDetail", {movie:movie});
}

// function addNewMovie(req, res, next) {

//     var form  = new formidable.IncomingForm();
//     form.keepExtenstion  =true; 
//     form.uploadDir  =uploadDir;  //파일업로드가 있으면 default로 업로드되는 경우 설정.

//     form.parse (req, function (err, fields, files){

//         if(err){
//             res.statusCode = 404; 
//             res.end('Error');
//             return ;
//         }

//         var title =fields.title;
//         var director  =fields.director;
//         var year  =fields.year;
//         //files에서 Read!!
//         var poster  =files.poster;
//         var url='';
//         if( poster) {
//             console.log(poster);
//             //var ext=pathUtil.extname(poster.name);
//             // var ext= 'jpg';
//             var newFileName =poster.originalFilename;    //title + ext;
//             var newPath = imageDir +pathUtil.seq  +newFileName;
//             //default 경로에 upload된 파일을 images아래로 복사함.
//             fs.renameSync(poster.path, newPath);
//             url  = newPath;
//         }
//         var info  ={
//             title: title,
//             director : director,
//             year :year,
//             poster: url
//         };
//         movieList.push(info);

//          //다시 루트 경로 페이지 redirect
//          res.statusCode = 302;
//          res.setHeader('Location', '.');
//          res.end();

//     });
     
// }

// function showList(req, res) {
//     var html ='<html>';

//     html +='<head>'   ;
//     html +='<meta charset="UTF-8">'   ; 

//     html +='<style>'   ;
//     html +='form label {width:100px; display:inline-block;}'   ;
//     html +='li img {height:100px}'  ;
//     html +='</style>'   ;

//     html +='</head>'   ;
//     html +='<body>'   ;
//     html +='<div>'   ;
//     html +='<ul>'   ;

//     moveList.forEach(function(movie){
//         html  += '<li>'

//         if(movie.poster){
//             html += '<img src="'  + movie.poster  +'" >';
//         }
//         html += movie.title  +'('+movie.director+')' +movie.year +'</li>' ;
//     });
//     html +='</ul>'   ;
//     html +='</div>'   ;

//     html +='<form method="post" action="." enctype="multipart/form-data">'   ;
//     html +='<ul>'   ;
//     html +='<li><label>제목</label> <input type ="text" name="title"></li>'   ;
//     html +='<li><label>director</label> <input type ="text" name="director"></li>'   ;
//     html +='<li><label>year</label> <input type ="text" name="year"></li>'   ;
   
//     html +='<li><label>poster</label> <input type ="file" name="poster"></li>'   ;

//     html +='</ul>';
//     html +='<input type="submit" value="save">';
    

//     html +='</form>';

//     html +='</body>'   ;
//     html +='</html>'   ;

//     res.writeHeader(200, {'Content-Type':'text/html'});
//     res.end(html);
// }

module.exports= router;
