var myUserId = "";
var tokenSesion;
var myUser;
var miToken;
var contador = 0;
var displayName;
var email;
var photoURL;
var phoneNumber;
var validBrowser = 0;
var contador = 0;
var testigo = 0;
var userName;
var userLastName;
var userCellPhone;
var codRuta;
var registrado = 0;
var intentos = 0;
var distancia = 0;
$(document).ready(function() {
//    alert('Mensaje index.html');
});
var app = {
    initialize: function() {
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
    }
};
app.initialize();


function cambioPagina(pagina){
    location.href = pagina;
    mensaje(pagina);
}
function inicio(){
    cambioPagina("login.html");
//    cambioPagina("mapaRuta.html");    
}
function transicion(){
    cambioPagina("telefonoConductor.html");
}
$(document).ready(main);
function main () {
    $('.icono-bar').click(function(){
        if (contador == 1) {
            $('nav').animate({
                left: '0'
            });
            contador = 0;
        } else {
            contador = 1;
            $('nav').animate({
                left: '-100%'
            });
        }
    });
    $('.map').click(function(){
        if (contador == 0) {
            $('nav').animate({
                left: '-100%'
            });
            contador = 1;
        }
    });
    // Mostramos y ocultamos submenus
    $('.submenu').click(function(){
        $(this).children('.children').slideToggle();
    });
}
function ocultarMenu() {
    $('nav').animate( { left: '-100' } );
    $('.submenu').click(function(){
        $(this).children('.children').slideToggle();
    });
}

function abrir() { 
    open('pruebaPopup.html','','top=300,left=300,width=300,height=300') ; 
} 

var inputs = document.getElementsByClassName('formulario__input');
for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('keyup', function(){
    if(this.value.length>=1) {
      this.nextElementSibling.classList.add('fijar');
    } else {
      this.nextElementSibling.classList.remove('fijar');
    }
  });
}

function obtenercodEmp() {
    codRuta = "EMP";
    var numero;
    codRuta += String.fromCharCode(Math.floor((Math.random() * (122 - 97)+97) + 1));
    codRuta += String.fromCharCode(Math.floor((Math.random() * (122 - 97)+97) + 1));
    codRuta += String.fromCharCode(Math.floor((Math.random() * (122 - 97)+97) + 1));
    codRuta += String.fromCharCode(Math.floor((Math.random() * (122 - 97)+97) + 1));
    codRuta += menorCero(Math.round(Math.random() * (98) + 1));
    codRuta += menorCero(Math.round(Math.random() * (98) + 1));
    codRuta = codRuta.toUpperCase();
}

function menorCero( valor ) {
    if( valor < 10 ) {
        return valor += "0" + valor;
    } else {
        return valor;
    }
}


function cerrarPopUp() {
    var $popUp = $('#mensajeError');
    $popUp[0].close();
}

function campoDiligenciado(etiqueta) {
//    $("formulario__label").css("margin-top", "-125px");
//    $("#" + etiqueta).css("margin-top", "-125px");
//    alert("etiqueta:" + $('#txt' + etiqueta ).val().length);
    if( $('#txt' + etiqueta ).val().length > 0 ) {
        if( etiqueta == "Celular" ) {
            $('#lbl' + etiqueta ).removeClass("formulario__label_cel");
            $('#lbl' + etiqueta ).addClass("formulario__label_cel_lleno");
        } else {
            $('#lbl' + etiqueta ).removeClass("formulario__label");
            $('#lbl' + etiqueta ).addClass("formulario__label_lleno");
        }
    } else {
        if( etiqueta == "Celular" ) {
            $('#lbl' + etiqueta ).removeClass("formulario__label_cel_lleno");
            $('#lbl' + etiqueta ).addClass("formulario__label_cel");
        } else {
            $('#lbl' + etiqueta ).removeClass("formulario__label_lleno");
            $('#lbl' + etiqueta ).addClass("formulario__label");
        }        
    }
//    
}

/**
 * \fn getKilometros().
 *
 * \Description: Devuelve la distancia en kilomegtros entre dos puntos dados por su latitud y longitud
 *
 * \param (integer) lat1 : Latitud del punto 1
 * \param (integer) long1 : Longitud del punto 1
 * \param (integer) lat2 : Latitud del punto 2
 * \param (integer) long2 : Longitud del punto 2
 *
 * \return (integer) Distancia en kilometros
 *
 **/

function getKilometros(lat1,lon1,lat2,lon2) {
    rad = function(x) {return x*Math.PI/180;}
    var R = 6378.137; //Radio de la tierra en km
    var dLat = rad( lat2 - lat1 );
    var dLong = rad( lon2 - lon1 );
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(3); //Retorna tres decimales
}