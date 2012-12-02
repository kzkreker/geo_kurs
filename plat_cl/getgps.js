// GPS клиент подвижной платформы
var pg = require('pg');
var settings = require('./settings.js');
var fs = require('fs');

// подключение к нашей базке данных
var client = new pg.Client(settings.conString);
client.connect();

//чтение из файла заготовки с кординатами
fs.readFile('gpscord.txt', function(err, data) {

    if(err) throw err;
    //читаем файл в массив
    //remCoordinates(1);
    var array = data.toString().split("r");

    //парсим и заносим в БД элементы массива
    for(var i=0; i<array.length-1; i++) {

        var datastpre=parseGPS(array[i]);
        var datastpost=parseGPS(array[i+1]);
        console.log(datastpre);
        console.log(datastpost);
        if (datastpre.latitude!=datastpost.latitude || datastpre.longitude!=datastpost.longitude)
        {
            addCoordinates(datastpre);
        }
     }
});

//парсим данные для базки, в качестке параметра получаем
//строку с GPS приемника
function parseGPS(array) {
    var line = array.toString().split(",");
    return {
      platformid  : settings.platform.platformid
    , data      : '20'+line[9].slice(4,6)+'-'+line[9].slice(2,4)+'-'+line[9].slice(0,2)+' '+line[1].slice(0,2)+':'+line[1].slice(2,4)+':'+line[1].slice(4,6)
    , longitude : (line[3]-line[3]%100)/100 + (line[3]%100)/60
    , latitude  : (line[5]-line[5]%100)/100 + (line[5]%100)/60
    , azimut    : line[8]
    , speed     : line[7]/0.5399614
    , track     : settings.platform.track

    }
}

//сливаем данные в базку
//надо сделать отключение об базки... потом
function addCoordinates(datast) {
    client.query({
        name: 'insert gpscord',
        text: "INSERT INTO gpscord(platform, longitude, latitude, data, azimut, track, speed) values($1, $2, $3, $4, $5, $6, $7)",
        values: [datast.platformid,datast.longitude, datast.latitude, datast.data, datast.azimut,datast.track ,datast.speed]
    });
    console.log(datast);
    //disconnect client manually
    //query.on('end', client.end.bind(client));
}

function remCoordinates(trackid) {
    client.query({
        name: 'dell gpscord',
        text: "DELETE FROM gpscord WHERE track='"+trackid+ "' ;"
          });
    //disconnect client manually
    //query.on('end', client.end.bind(client));
}
