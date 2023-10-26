var jsforce = require('jsforce');
var mysql = require('mysql');
var connection = require('./Config.js');

// Connect to Salesforce
connection.connect(function (err) {
  if (err) {
    return console.error('error:' + err.message);
  }

  var conn = new jsforce.Connection({});

  // Salesforce login
  conn.login('sypriyanka3108@resilient-fox-3sx7cc.com', 'lathayogesh@1f14KxcAJyfpF6fU9LDiYqTyf', function (err, userInfo) {
    if (err) { return console.error(err); }

    console.log('Connected to Salesforce');
    console.log(conn.accessToken);
    console.log(conn.instanceUrl);

    var records = [];
    
    // Query Salesforce for records
    var query = conn.query("Select Id,Name,Rating,Type,Phone FROM account order by LastModifiedDate asc")
      .on("record", function (record) {
        records.push(record);

        // Update the corresponding record in the MySQL database
        let sql = 'UPDATE test_table SET Name = ?, Rating = ?, Type = ?, Phone = ? WHERE Id = ?';
        let data = [record.Name,record.Rating, record.Type, record.Phone, record.Id];

        connection.query(sql, data, (err, res, fields) => {
          if (err) {
            return console.error(err.message);
          }
          console.log('Updated record with Id:', record.Id);
        });
      })
      .on("end", function () {
        connection.end(function (err) {
          if (err) {
            return console.log('error:' + err.message);
          }
          console.log('Close the MySQL database connection.');
        });
      })
      .on("error", function (err) {
        console.log(err);
      })
      .run({ autoFetch: true, maxFetch: 4000 });
  });
});
