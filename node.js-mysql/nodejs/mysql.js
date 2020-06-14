var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '123456',
    database : 'opentutorials'
});

connection.connect();

connection.query('select * from topic', function (error, results, fields){
    if(error){
        console.log(error)
    }
    console.log(results);
})

connection.end();