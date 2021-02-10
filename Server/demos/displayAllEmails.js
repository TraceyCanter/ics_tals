
var fs = require('fs');

fs.readFile('demos/output/allEmails.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
});