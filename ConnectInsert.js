var jsforce = require('jsforce')
var connection = require('./Config.js')
var Id;
connection.connect(function (err) {
if (err) {
return console.error('error:' + err.message);
}
//console.log('Connected to MySQL');
var conn = new jsforce.Connection({
});
// password + security token
conn.login('sypriyanka3108@resilient-fox-3sx7cc.com', 'lathayogesh@1f14KxcAJyfpF6fU9LDiYqTyf', function (err, userInfo) {
if (err) { return console.error(err); }
// Now you can get the access token and instance URL information.
console.log(conn.accessToken);
console.log(conn.instanceUrl);
console.log('Connected to Salesforce');
conn.streaming.topic("/data/AccountChangeEvent").subscribe(function(event) {
    // Access the Record ID from the event data
    Id = event.payload.ChangeEventHeader.recordIds[0];
    console.log(' 21 : Record ID:', Id);


});

var records = []
var query = conn.query("Select Id,Name,Rating,Type,Phone FROM account order by LastModifiedDate asc ")
.on("record", function (record) {
records.push(record);
records.update
console.log(record.Id)
if(record.Id===Id){
}

let sql = 'INSERT INTO test_table VALUES (?,?,?,?,?)';
let data = [record.Id, record.Name,record.Rating,record.Type,record.Phone];
connection.query(sql, data, (err, res, fields) => {
if (err) {
return console.error(err.message);
}
console.log('Rows affected:', res.affectedRows + record.Id);
})

})



.on("end", function () {
connection.end(function (err) {
if (err) {
return console.log('error:' + err.message);
}
console.log('Close the database connection.');
});
//console.log(records[0].Id);
//console.log("total records is :" + query.totalSize);
//console.log("total fetched is :" + query.totalFetched);
})
.on("error", function (err) {
console.log(err);
})
.run({ autoFetch: true, maxFetch: 4000 });
});
})
//let sql = 'INSERT into test_db VALUES (xxx)  '