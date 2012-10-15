/*
 * GET home page.
 */

exports.markers = function(req, res){
  var items = [
    {
        plid  : 2
      , longit: 45.2
      , latit : 82.5
      , time_n: new Date()
      , tracid: 1
    },
    {
        plid  : 3
      , longit: 46.2
      , latit : 83.5
      , time_n: new Date()
      , tracid: 1
    }
  ];
  res.send(items);
};