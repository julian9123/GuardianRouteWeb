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