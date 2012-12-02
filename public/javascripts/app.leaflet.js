/**
 *  Для реализации стандартного управления слоями нужен дофига большой рефакторинг всего
 */

/**
 * Инициализация карты и установка различных начальных значений
 * @constructor
 * @param {number} lat  Начальная широта, устанавлимаемая при инициализации карты
 * @param {number} long Начальная долгота, устанавлимаемая при инициализации карты
 */
function initLeafletMap(lat, long) {
    //тут создается глобальная переменная... хорошо ли это?
    map = new L.Map('map');

    // create a CloudMade tile layer with style #997 (or use other provider of your choice)
   // var osm = new L.TileLayer('/public/images/tiles/{z}/{x}_{y}.png', {
   // http://c.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/999/256/10/211/388.png
    var osm = new L.TileLayer('/javascripts/images/tiles/{z}/{x}_{y}.png', {

          maxZoom: 25
        , minZoom: 1
    });

    // add the layer to the map, set the view to a given place and zoom
    map.addLayer(osm).setView(new L.LatLng(lat, long), 15);

    //устанавливаем границы перемещения по карте
    //@todo необходимо перенести данные константы в файл настроек
   // var southWest = new L.LatLng(49.83222502, 82.35420227);
    //var northEast = new L.LatLng(50.21514028, 83.05183411);
    //var bounds = new L.LatLngBounds(southWest, northEast);
    //map.setMaxBounds(bounds);

    // создание словаря со слоями маркеров и добавление на карту оных
    markersLayerGroup = {
        patrolpoints  : new L.LayerGroup()
    }
    map.addLayer(markersLayerGroup.patrolpoints);


    // словарь со всеми маркерами, присутствующими на карте
    markers = {}
    latlngs = {};
    //задаем контролы для необходимых слоев
    var baseLayers = {
        /*"OpenStreetMap": osm*/
    };
    var overlays = {
        "Патрули": markersLayerGroup.patrolpoints
    };

    layersControl = new L.Control.Layers(baseLayers, overlays);
    map.addControl(layersControl);

    var LeafIcon = L.Icon.extend({
        options: {
            shadowUrl: '/javascripts/images/marker-shadow.png',
            iconSize:     [25, 25],
            shadowSize:   [40, 40],
            iconAnchor:   [0, 0],
            shadowAnchor: [0, 0],
            popupAnchor:  [0, 0]
        }
    });


    var g0Icon = new LeafIcon({iconUrl: '/javascripts/images/marker-0.png'}),
        g45Icon = new LeafIcon({iconUrl: '/javascripts/images/marker-45.png'}),
        g90Icon = new LeafIcon({iconUrl: '/javascripts/images/marker-90.png'}),
        g135Icon = new LeafIcon({iconUrl: '/javascripts/images/marker-135.png'}),
        g180Icon = new LeafIcon({iconUrl: '/javascripts/images/marker-180.png'}),
        g225Icon = new LeafIcon({iconUrl: '/javascripts/images/marker-225.png'}),
        g270Icon = new LeafIcon({iconUrl: '/javascripts/images/marker-270.png'}),
        g315Icon = new LeafIcon({iconUrl: '/javascripts/images/marker-315.png'});


    $.get('/api/markers/1', function(records) {
        for(var i=0; i<records.length; i=i+3) {
            if (records[i].azimut>=0 && records[i].azimut<45 ){
            markers[i] = L.marker([records[i].longitude,records[i].latitude], {icon: g225Icon}).addTo(map);}
            if (records[i].azimut>=45 && records[i].azimut<90 ){
                markers[i] = L.marker([records[i].longitude,records[i].latitude], {icon: g45Icon}).addTo(map);}
            if (records[i].azimut>=45 && records[i].azimut<135 ){
                markers[i] = L.marker([records[i].longitude,records[i].latitude], {icon: g315Icon}).addTo(map);}
            if (records[i].azimut>=135 && records[i].azimut<180 ){
                markers[i] = L.marker([records[i].longitude,records[i].latitude], {icon: g0Icon}).addTo(map);}
            if (records[i].azimut>=180 && records[i].azimut<225 ){
                markers[i] = L.marker([records[i].longitude,records[i].latitude], {icon: g0Icon}).addTo(map);}
            if (records[i].azimut>=225 && records[i].azimut<270 ){
                markers[i] = L.marker([records[i].longitude,records[i].latitude], {icon: g270Icon}).addTo(map);}
            if (records[i].azimut>=270 && records[i].azimut<315 ){
                markers[i] = L.marker([records[i].longitude,records[i].latitude], {icon: g135Icon}).addTo(map);}
            if (records[i].azimut>=315 && records[i].azimut<360 ){
                markers[i] = L.marker([records[i].longitude,records[i].latitude], {icon: g225Icon}).addTo(map);}


        }

        var linePts = [] ;

        for(var i=0; i<records.length; i++) {
            linePts.push([records[i].longitude,records[i].latitude]);
                    }
// a FOR loop operates on each item in a list
        for( i=0; i < linePts.length; i=i+1 ) {
            // turn this coordinate into a LatLng
            linePts[ i ] = new L.LatLng( linePts[ i ][ 0 ], linePts[ i ][ 1 ] );
        }

        console.log(linePts);
            line = new L.Polyline( linePts, { color: "purple" } );
        map.addLayer(line);

    });




}


$(document).ready(function() {
    // initialize the map on the "map" div
    initLeafletMap(49.90589877, 82.61572301);



    var branches = $("<li><span id='root'>Список платформ:</span><ul>" +
        "<li><span>"+'Платформа 1'+"</span><ul>" +
        "<li><span>"+'Маршрут:'+"</span><ul>" +
        "<li><a href='#' id='samplebutton'>1</a></li>" +
        "<li><a href='#' id='samplebutton'>2</a></li>"+
        "</li></ul></li></ul></li></ul></li>").appendTo("#browser");
    $("#browser").treeview({
        add: branches
    });


    map.on('click', onMapClick);
    var popup = new L.Popup();

    function onMapClick(e) {
        var latlngStr = '(' + e.latlng.lat.toFixed(8) + ', ' + e.latlng.lng.toFixed(8) + ')';
        popup.setLatLng(e.latlng);
        popup.setContent("Координаты точки " + latlngStr);
        map.openPopup(popup);
    };

    $('#samplebutton').live('click', function(){
        alert($(this).html());
    })


});


