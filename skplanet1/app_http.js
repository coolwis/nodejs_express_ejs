//영화 포스터 업로드 서버 
//1. 목록출력
//2. post 요청처리 
//3. 영화 이미지 
//4. 포스터 이미지 업로드 처리

var http =require('http');

var fs =require('fs');
var querystring= require('querystring');
var pathUtil = require ('path');
var url  = require ('url');

var formidable  =require ('formidable');
var uploadDir  = __dirname  + '/upload';
var imageDir  = __dirname  + '/images';


var initialDB  =fs.readFileSync('./initialDB_http.json');
var moveList  =JSON.parse(initialDB);

var server =http.createServer(function(req, res){

    if(req.method.toLowerCase() =='get' && req.url =='/'){
        showList(req, res);
    }
    //image get 요청
    else if(req.method.toLowerCase() =='get'){

        var parsed = url.parse (req.url);

        //__dirname -> 현재경로
        var path  =  __dirname+ parsed.pathname;  // /images/1.jpg

        fs.access(path, function (err){

            if(err){
                res.statusCode = 404 ;
                res.end('Not Found');
                return; 
            }

            //이미지를 출력 스트림에 전달
            var is = fs.createReadStream(path);
            is.pipe(res);
        });        
    } 
    
    else if(req.method.toLowerCase()  =='post'){
        addNewMovie(req, res);
    } else {
        res.statusCode =400;
        res.end('Error');
    }
});
server.listen(3000);

function  addNewMovie (req, res) {

    var form  = new formidable.IncomingForm();
    form.keepExtenstion  =true; 
    form.uploadDir  =uploadDir;  //파일업로드가 있으면 default로 업로드되는 경우 설정.

    form.parse (req, function (err, fields, files){

        if(err){
            res.statusCode = 404; 
            res.end('Error');
            return ;
        }

        var title =fields.title;
        var director  =fields.director;
        var year  =fields.year;
        //files에서 Read!!
        var poster  =files.poster;
        var url='';
        if( poster) {
            console.log(poster);
            //var ext=pathUtil.extname(poster.name);
            // var ext= 'jpg';
            var newFileName =poster.originalFilename;    //title + ext;
            var newPath = imageDir +pathUtil.seq  +newFileName;
            //default 경로에 upload된 파일을 images아래로 복사함.
            fs.renameSync(poster.path, newPath);
            url  = newPath;
        }
        var info  ={
            title: title,
            director : director,
            year :year,
            poster: url
        };
        moveList.push(info);

         //다시 루트 경로 페이지 redirect
         res.statusCode = 302;
         res.setHeader('Location', '.');
         res.end();

    });
     
    // var body ='';
    // req.on('data', function(chunk){

    //     body  += chunk;
    // } );

    // req.on('end', function(){
    //     var parsed  =querystring.parse(body);
    //     var title  = parsed.title;
    //     var director  =parsed.director;
    //     var year  =  parseInt(parsed.year);

    //     var info  ={
    //         title: title,
    //         director : director,
    //         year :year
    //     };
    //     moveList.push(info);

    //     //다시 루트 경로 페이지 redirect
    //     res.statusCode = 302;
    //     res.setHeader('Location', '.');
    //     res.end();
    // });
}

function showList(req, res) {
    var html ='<html>';

    html +='<head>'   ;
    html +='<meta charset="UTF-8">'   ; 

    html +='<style>'   ;
    html +='form label {width:100px; display:inline-block;}'   ;
    html +='li img {height:100px}'  ;
    html +='</style>'   ;

    html +='</head>'   ;
    html +='<body>'   ;
    html +='<div>'   ;
    html +='<ul>'   ;

    moveList.forEach(function(movie){
        html  += '<li>'

        if(movie.poster){
            html += '<img src="'  + movie.poster  +'" >';
        }
        html += movie.title  +'('+movie.director+')' +movie.year +'</li>' ;
    });
    html +='</ul>'   ;
    html +='</div>'   ;

    html +='<form method="post" action="." enctype="multipart/form-data">'   ;
    html +='<ul>'   ;
    html +='<li><label>제목</label> <input type ="text" name="title"></li>'   ;
    html +='<li><label>director</label> <input type ="text" name="director"></li>'   ;
    html +='<li><label>year</label> <input type ="text" name="year"></li>'   ;
   
    html +='<li><label>poster</label> <input type ="file" name="poster"></li>'   ;

    html +='</ul>';
    html +='<input type="submit" value="save">';
    

    html +='</form>';

    html +='</body>'   ;
    html +='</html>'   ;

    res.writeHeader(200, {'Content-Type':'text/html'});
    res.end(html);
}