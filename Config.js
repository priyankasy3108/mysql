var mysql = require('mysql')

var connection = mysql.createConnection({
    host : '127.0.0.1' ,
    user : 'root' ,
    password:'ciberspring@1' ,
    database : 'testschema' 
});

module.exports = connection;