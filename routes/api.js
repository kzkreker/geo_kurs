/*
 * GET home page.
 */

var pg = require('pg'); //native libpq bindings = `var pg = require('pg').native`
var conString = "tcp://postgres:5432@localhost/postgres";

var client = new pg.Client(conString);
client.connect();

exports.markers = function(req, res){
  var items = [];
  res.send(items);
};

function getById(id, callback) {
    var query = client.query(" SELECT * FROM public.curtrac WHERE curtrac.plid = $1",[id]);
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


function addCoordinates(platform, longitude, latitude, datetime, track) {
    datetime ="'"+datetime+"'";
    str="INSERT INTO curtrac(plid, longit, latit, time_n, tracid)VALUES ("+platform+', '+longitude+', '+latitude+', '+datetime+', '+track+");";
    console.log(str);

    var query = client.query(str);
    //disconnect client manually
    query.on('end', client.end.bind(client));
}