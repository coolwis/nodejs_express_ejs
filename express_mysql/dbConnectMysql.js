var mysql =require ('mysql');
var dbConfig ={
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    multipleStatements: true,
    database: 'moviest'
};

var pool = mysql.createPool(dbConfig);
pool.getConnection(function(err, conn){
    if(err){
        console.log('Connection err: ', err);
        return;
    }
    console.log('success Connection');
});