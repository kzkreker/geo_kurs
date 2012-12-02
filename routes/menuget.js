
/*
 * GET home page.
 */
var settings = require('./settings.js');
var pg = require('pg');

var client = new pg.Client(settings.conString);
client.connect();

exports.markers = function(req, res){
    var items = [];
    res.send(items);
};

function getById(callback) {
    var query = client.query("SELECT platform, track FROM gpscord GROUP BY platform, track ORDER BY platform, track;");
    var data = new Array();
    query.on('row', function(row) {
        data.push(row);
    });

    query.on('end', function() {
        //client.end();
        callback(data);
    });
}

exports.markerInfo = function(req, res) {
    getById(function(rows){
        res.send(rows);
    });
}
