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

function getById(id,callback) {
    var query = client.query(" SELECT  * FROM public.gpscord WHERE gpscord.track = $1 AND gpscord.platform = $1 ORDER BY gpscord.data ASC; ",[id]);
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
    getById(req.param('id'), function(rows){
        res.send(rows);
    });
}
