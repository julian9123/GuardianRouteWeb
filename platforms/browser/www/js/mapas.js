var map;
var myLat = -34.397,
    myLong = 150.644,
    myRadius,
    userLocation,
    address,
    panorama,
    streetPlace;
var infoWindow;
var options;
var obj = new Object();
var markers = [];
$(document).ready(function() {
//    alert('Mensaje index.html');
//    concurrentMapa();
});
var app = {
    initialize: function() {
        document.addEventListener('deviceready', function () {
            cordova.plugins.backgroundMode.setEnabled(true);
            cordova.plugins.backgroundMode.onactivate = function() {
                setInterval(posicionActual, 3000);
            };
        });
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        
    }
};
app.initialize();
/*
cordova.plugins.backgroundMode.isScreenOff(function() {
    cordova.plugins.backgroundMode.moveToBackground();
});
*/
function initMap() {
    map = new google.maps.Map( document.getElementById('map'), { center: {lat: myLat, lng: myLong}, zoom: 10, 
                              mapTypeId: google.maps.MapTypeId.ROADMAP } );
    infoWindow = new google.maps.InfoWindow({map: map});
    options = { enableHighAccuracy: true, maximumAge: 100, timeout: 100000 };
    setInterval(posicionActual, 3000);
}
function myPositions() {
//    var infoWindow = new google.maps.InfoWindow();
//    var options = { enableHighAccuracy: true, maximumAge: 100, timeout: 60000 };
    var image = { url: '../img/android/drawable-mdpi/marcaruta.png',
                  size: new google.maps.Size(29, 39),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(0, 29)
                };
    var shape = { coords: [1, 1, 1, 20, 18, 20, 18, 1], type: 'poly' };
    var i = 0, j = 0, k = 0, marcador;
    var datos = conn.database().ref("travel");
    datos.orderByValue().on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            obj.ruta = data.key;
            var reg = data.val();
            obj.longitud = reg.longitud;
            obj.latitud = reg.latitud;
            markers.push(obj);
            marcador = new google.maps.Marker({ position: new google.maps.LatLng(obj.latitud, obj.longitud), map: map, 
                                             title: 'Ruta:' + obj.ruta, icon: image, shape: shape });
//            alert(JSON.stringify(reg));
        } );
    } );
    google.maps.event.addListener(marcador, 'click', (function(marker, i) {
        return function() {
            infowindow.setContent('Ruta:' + obj.ruta);
            infowindow.open(map, marker);
      }
    })(marcador, i));
    google.maps.event.addDomListener(window, 'load', initMap);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                      'Servicio de Geolocation Fallo' :
                      'Error: Your browser doesn\'t support geolocation.');
}

function posicionActual() {
    myPositions();
/*
    markers.forEach( function (elemento, indice, array) {
        console.log(elemento, indice);
    } );
    console.log("Contador:" + contador);
*/    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            guardarPosicion(pos);
//            infoWindow.setContent('Ubicado en el Mapa');
            if( contador == 1 ){ map.setCenter(pos); }
        },
        function(error) {
            handleLocationError(true, infoWindow, map.getCenter());
        }, options );
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
    
}
/*
function concurrentMapa() {
    while(true) {
//        posicionActual();
        console.log("Hola mundo");
        setTimeout(concurrentMapa, 5000);
    }
}
//Concurrent.Thread.create(posicionActual);
*/