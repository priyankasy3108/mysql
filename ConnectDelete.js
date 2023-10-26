var jsforce = require('jsforce');
//var mysql = require('mysql');
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
    var query = conn.query("Select Id, Name FROM Account")
      .on("record", function (record) {
        records.push(record);

        // Check if the record already exists in the MySQL database
        let checkSql = 'SELECT Id FROM test_table WHERE Id = ?';
        let checkData = [record.Id];

        connection.query(checkSql, checkData, (checkErr, checkRes, checkFields) => {
          if (checkErr) {
            return console.error(checkErr.message);
          }

          if (checkRes.length === 0) {
            // The record doesn't exist in the database, so insert it
            let insertSql = 'INSERT INTO test_table (Id, Name) VALUES (?, ?)';
            let insertData = [record.Id, record.Name];

            connection.query(insertSql, insertData, (insertErr, insertRes, insertFields) => {
              if (insertErr) {
                return console.error(insertErr.message);
              }
              console.log('Inserted record with Id:', record.Id);
            });
          } else {
            // The record exists, so update it
            let updateSql = 'UPDATE test_table SET Name = ? WHERE Id = ?';
            let updateData = [record.Name, record.Id];

            connection.query(updateSql, updateData, (updateErr, updateRes, updateFields) => {
              if (updateErr) {
                return console.error(updateErr.message+'159');
              }
              console.log('Updated record with Id:', record.Id);
            });
          }
        });
      })
      .on("end", function () {
        // Now, let's perform the delete operation on records that exist in the database but not in Salesforce
        let deleteSql = 'DELETE FROM test_table WHERE Id NOT IN (?)';
        let deleteData = [records.map(record => record.Id)];

        connection.query(deleteSql, [deleteData], (deleteErr, deleteRes, deleteFields) => {
          if (deleteErr) {
            return console.error(deleteErr.message+'22');
          }
          console.log('Deleted records not in Salesforce');
        });

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
