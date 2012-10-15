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
    var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        maxZoom: 18
        , minZoom: 12
    });

    // add the layer to the map, set the view to a given place and zoom
    map.addLayer(osm).setView(new L.LatLng(lat, long), 15);

    //устанавливаем границы перемещения по карте
    //@todo необходимо перенести данные константы в файл настроек
    var southWest = new L.LatLng(49.83222502, 82.35420227);
    var northEast = new L.LatLng(50.21514028, 83.05183411);
    var bounds = new L.LatLngBounds(southWest, northEast);
    map.setMaxBounds(bounds);

    // создание словаря со слоями маркеров и добавление на карту оных
    markersLayerGroup = {
        patrol  : new L.LayerGroup()
        , incident: new L.LayerGroup()
    }
    map.addLayer(markersLayerGroup.patrol);
    map.addLayer(markersLayerGroup.incident);

    // словарь со всеми маркерами, присутствующими на карте
    markers = {}

    $.get('/api/markers/1', function(records) {
        //удаляем лишние маркеры, которых не должно быть на карте
        var i=0.001;
        for (var record in records) {

            var marker = L.marker([49.9069,82.6125]).addTo(map);
        }
    });

}


$(document).ready(function() {
    // initialize the map on the "map" div
    initLeafletMap(49.900, 82.625);


    map.on('click', onMapClick);
    var popup = new L.Popup();

    /**
     * Вывод всплывающего сообщения по клику на карте
     * @param e
     */
    function onMapClick(e) {
        var latlngStr = '(' + e.latlng.lat.toFixed(8) + ', ' + e.latlng.lng.toFixed(8) + ')';
        popup.setLatLng(e.latlng);
        popup.setContent("Координаты точки " + latlngStr);
        map.openPopup(popup);
    };


    /**
     * Заменяет иконки маркеров на полноразмерный или уменьшенный вариант в зависимости от уровня увеличения на карте
     */
    function onZoomEnd(){
        for (var item in markers) {
            setMarkerIcon(markers[item]);
        }
    };
    //Привязка функции изменения значков маркеров к событию zoomend
    map.on('zoomend', onZoomEnd);

    /**
     * Переназначение иконки маркера
     * @param {L.Marke} marker
     * @param {String} icon Наименование иконки, которое автоматически преобразуется в абсолютный путь
     */

});