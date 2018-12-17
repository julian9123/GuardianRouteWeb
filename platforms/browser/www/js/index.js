'use strict';

var myUserId = "";
var tokenSesion = 0;
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
var iconoSel = "", entUser = "", entRoute = ""
var entCode = "";
var alphaLow = "abcdefghijklmnopqrstuvwxyz";
var alphaUp = "abcdefghijklmnopqrstuvwxyz".toLocaleUpperCase();
var tblRtAlt = ['alert', 'starandfinish', 'entRoute', 'datacar', 'datacars', 'drivervstravel', 'starandfinish', 'placavskey', 'entUser', 'entGroup', 'uservscode', 'usersvstravel', 'mensaje', 'datadriver', 'schGroup', 'listvstravel', 'logerrdata', 'docs', 'contact'];
var objCnx = [];
var enterpriseUser = "";
var entChoose = "";
var alertas = [ "Envió una alerta ¡Estamos en un congestión vehicular grave!, a sus usuarios de ruta.",
                "Envió una alerta ¡Sufrimos un accidente!, a sus usuarios de ruta.",
                "Envió una alerta ¡Tenemos un daño mecánico!, a sus usuarios de ruta."
              ];
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

function openPopUp(pagina) {
    open(pagina,'','top=300,left=300,width=300,height=300') ;
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

function obtenercodEmp(opt) {
    codRuta = opt;
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
        return valor = "0" + valor;
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
//    var elem = document.getElementById("routeFind");
//    elem.textContent = "";
    if ($('#txt' + etiqueta ).val().length > 0) {
        if (etiqueta == "Celular") {
            $('#lbl' + etiqueta ).removeClass("formulario__label_cel");
            $('#lbl' + etiqueta ).addClass("formulario__label_cel_lleno");
        } else if (etiqueta.substr(0,4).trim() == "Ruta") {
            $('#lbl' + etiqueta ).removeClass("formulario__labelDialog");
            $('#lbl' + etiqueta ).addClass("formulario__labelDialog_lleno");
        } else if (etiqueta.trim() == "Ciudad" || etiqueta.trim() == "Empleado" || etiqueta.trim() == "Direccion" || etiqueta.trim() == "CelularC" || etiqueta.trim() == "UserNameCns" || etiqueta.trim() == "CelularX") {
            $('#lbl' + etiqueta ).removeClass("formulario__labelDialogEmp");
            $('#lbl' + etiqueta ).addClass("formulario__labelDialogEmp_lleno");
        } else {
            $('#lbl' + etiqueta ).removeClass("formulario__label");
            $('#lbl' + etiqueta ).addClass("formulario__label_lleno");
        }
    } else {
        if (etiqueta == "Celular") {
            $('#lbl' + etiqueta ).removeClass("formulario__label_cel_lleno");
            $('#lbl' + etiqueta ).addClass("formulario__label_cel");
        } else if (etiqueta.substr(0,4).trim() == "Ruta") {
            $('#lbl' + etiqueta ).removeClass("formulario__labelDialog_lleno");
            $('#lbl' + etiqueta ).addClass("formulario__labelDialog");
        } else if(etiqueta.trim() == "Ciudad" || etiqueta.trim() == "Empleado" || etiqueta.trim() == "Direccion" || etiqueta.trim() == "CelularC" || etiqueta.trim() == "UserNameCns" || etiqueta.trim() == "CelularX") {
            $('#lbl' + etiqueta ).removeClass("formulario__labelDialogEmp_lleno");
            $('#lbl' + etiqueta ).addClass("formulario__labelDialogEmp");
        } else {
            $('#lbl' + etiqueta ).removeClass("formulario__label_lleno");
            $('#lbl' + etiqueta ).addClass("formulario__label");
        }
    }
//    console.log($('#txt' + etiqueta ).val() + " - " + etiqueta.substr(0,4).trim());
    if ($('#txt' + etiqueta ).val().length > 5 && etiqueta.substr(0,4).trim() == "Ruta") {
        if (etiqueta == 'RutaRem') return;
        var alphaLow = "abcdefghijklmnopqrstuvwxyz";
        var alphaUp = "abcdefghijklmnopqrstuvwxyz".toLocaleUpperCase();
        var number = "0123456789";
        var routeCode = "";
        var tmpLetra = ""
        var texto = $('#txt' + etiqueta ).val();
        for (var i = 0; i < texto.length; i++) {
            var letra = texto.charAt(i);
            for (var j = 0; j < alphaLow.length; j++) {
                if( letra == alphaLow.charAt(j) ) {
                    tmpLetra = letra.toLocaleUpperCase();
                }
            }
            for (var j = 0; j < alphaUp.length; j++) {
                if (letra == alphaUp.charAt(j)) {
                    tmpLetra = letra;
                }
            }
            for (var j = 0; j < number.length; j++) {
                if (letra == number.charAt(j))
                    tmpLetra = letra;
            }
            routeCode += tmpLetra;
        }
        csnRouteEnt(routeCode);
    }
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

function rad(x) {
    if(x == 0 ) { return 0; }
    return x*Math.PI/180;
}

function getKilometros(lat1,lon1,lat2,lon2) {
    var R = 6378.137; //Radio de la tierra en km
    var dLat = rad( lat2 - lat1 );
    var dLong = rad( lon2 - lon1 );
//    console.log("getK " + dLat + ":" + dLong);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
//    console.log("getKA " + a);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//    console.log("getKC " + c);
    var d = R * c;
//    console.log("getKR " + R);
//    console.log("PosGeo:" + d);
    return d; //Retorna tres decimales
}

function menuSeleccionado(iconoNuevo) {
    $('#' + iconoNuevo ).removeClass("md-light");
    $('#' + iconoNuevo ).addClass("md-dark");
}
function menuNoSeleccionado(iconoNuevo) {
    $('#' + iconoNuevo ).removeClass("md-dark");
    $('#' + iconoNuevo ).addClass("md-light");
}

function abrirOpcionModal(modal) {
    var $popUp = $('#' + modal);
    $popUp[0].showModal();
}

function closePopUp(modal) {
    var $popUp = $('#' + modal);
    $popUp[0].close();
}

function cargaDatos() {
    cnsUserEnt();
    $("#txtNombres").val(userName);
    alert($("#txtNombres").val());
    $("#txtApellidos").val(userLastName);
    $("#txtCelular").val(userCellPhone);
}

function espera( ms ) {
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while( d2 - d < ms );
}

function minToMayus(textMin) {
    var number = "0123456789";
    var routeCode = "";
    var tmpLetra = ""
    var texto = textMin;
    for( var i = 0; i < texto.length; i++ ) {
        var letra = texto.charAt(i);
        for( var j = 0; j < alphaLow.length; j++ ) {
            if( letra == alphaLow.charAt(j) ) {
                tmpLetra = letra.toLocaleUpperCase();
            }
        }
        for( var j = 0; j < alphaUp.length; j++ ) {
            if( letra == alphaUp.charAt(j) ) {
                tmpLetra = letra;
            }
        }
        for( var j = 0; j < number.length; j++ ) {
            if( letra == number.charAt(j) ) {
                tmpLetra = letra;
            }
        }
        routeCode += tmpLetra;
    }
    return routeCode;
}

function getCapitalLetter(textMin) {

    var listNumber = "0123456789";
    var returnText = "";
    var tmpLetra = "";
    var texto = textMin;

    if (texto.length <= 0) return;

    for (var i = 0; i < texto.length; i++) {
        tmpLetra = "";
        var letra = texto.charAt(i);
        for( var j = 0; j < listNumber.length; j++ ) {
            if (letra == listNumber.charAt(j)) {
                tmpLetra = letra;
                j = listNumber.length + 1;
                returnText += tmpLetra;
            }
        }
        if (tmpLetra != "") continue;
        if (i == 0)
            tmpLetra = texto.charAt(0).toLocaleUpperCase();
        else if (tmpLetra == "" && letra == " " && texto.length > i + 1) {
//            console.log('getCapitalLetterB ' + texto.charAt(i) + ' ' + letra);
            for( var j = 0; j < listNumber.length; j++ ) {
                if (texto.charAt(i + 1) == listNumber.charAt(j)) {
                    tmpLetra = texto.charAt(i + 1);
                    j = listNumber.length + 1;
                    i++;
                    returnText += letra + tmpLetra;
                }
            }
            if (tmpLetra != "") continue;
            tmpLetra = " " + texto.charAt(i + 1).toLocaleUpperCase();
            i++;
        }
        else
            tmpLetra = texto.charAt(i);
        returnText += tmpLetra;
//        console.log('getCapitalLetterC ' + returnText);
    }

    return returnText;
}

function getCodRoute() {
    codRuta = "";
    codRuta += String.fromCharCode(Math.floor((Math.random() * (122 - 97)+97) + 1));
    codRuta += String.fromCharCode(Math.floor((Math.random() * (122 - 97)+97) + 1));
    codRuta += menorCero(Math.round(Math.random() * (98) + 1));
    codRuta += String.fromCharCode(Math.floor((Math.random() * (122 - 97)+97) + 1));
    codRuta += String.fromCharCode(Math.floor((Math.random() * (122 - 97)+97) + 1));
    codRuta = codRuta.toUpperCase();
//    console.log("codRuta: " + codRuta);
}

function valCellNumber(option) {
    var cellNumber = ""
    if (option == 1) cellNumber = $("#txtCelular").val();
    if (option == 2) cellNumber = $("#txtCelularX").val();
    if (option == 3) cellNumber = $("#txtCelularC").val();
//    console.log(option + "=" + cellNumber);
    var tmpCellNumer = "";
    var number = "0123456789";
    for (var i = 0; i < cellNumber.length; i++) {
        for (var j = 0; j < number.length; j++) {
            if (cellNumber.charAt(i) == number.charAt(j))
                tmpCellNumer += cellNumber.charAt(i);
        }
    }
    if (option == 1) $("#txtCelular").val(tmpCellNumer);
    if (option == 2) $("#txtCelularX").val(tmpCellNumer);
    if (option == 3) $("#txtCelularC").val(tmpCellNumer);
}

function getMoveImage() {
//    console.log('getMoveImage:' + screen.width + " - " + screen.height);
//    for (var i = 0; i < screen.width;) {
    return;
    var i = 0;
        setInterval(function() {
            document.getElementById("imagen").style.marginLeft = String(i) + "px";
            i++;
        }, 10);
//    }
}