const jsforce = require('jsforce');
const conn = new jsforce.Connection();

conn.login('sypriyanka3108@resilient-fox-3sx7cc.com', 'lathayogesh@1f14KxcAJyfpF6fU9LDiYqTyf', function(err, userInfo) {
    if (err) { return console.error(err); }
    console.log('Connected to Salesforce');
    conn.streaming.topic("/data/AccountChangeEvent").subscribe(function(event) {
        // Access the Record ID from the event data
        var recordId = event.payload.ChangeEventHeader.recordIds[0];
        console.log('Record ID:', recordId);

 

        // Perform your processing with the record ID here
    });
});