var config = {
                apiKey: 'AIzaSyB5lqBfnODzRWdigNjIdmLBUIvsUmW13uk',
                authDomain: 'juliancorp-9123.firebaseapp.com',
                databaseURL: 'https://juliancorp-9123.firebaseio.com',
                storageBucket: 'juliancorp-9123.appspot.com',
                messagingSenderId: '1085529323533'
             };
var conn = firebase.initializeApp(config);
var proveedor = new firebase.auth.GoogleAuthProvider();
proveedor.addScope('https://www.googleapis.com/auth/contacts.readonly');
proveedor.addScope('profile');
proveedor.addScope('email');
proveedor.addScope('openid');
var autor = conn.auth();
var msg = conn.messaging();
//Conexion con  persistencia
function conectar() {
    autor.onAuthStateChanged( function( user ) {
        if ( user ) {
        // User is signed in.
            displayName = user.displayName;
            email = user.email;
            photoURL = user.photoURL;
            myUserId = user.uid;
            phoneNumber = user.phoneNumber;
//            console.log("Intento 2" + myUserId);
            user.getIdToken().then( function( accessToken ) {
                if( contador > 0 || intentos > 0 ) { return; }
                cnsUsuarioEmpresa();
                if( registrado > 0 ) { 
                    cambioPagina("mapaRuta.html");
                    return;
                } else {
                    cambioPagina("createEnterprise.html");
                    return;
                }
            } );
        } 
    } );
//Valida si hay conexion
    var uiConfig = {
        signInSuccessUrl: 'mapaRuta.html',
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
/*
            firebase.auth.FacebookAuthProvider.PROVIDER_ID

            firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.PhoneAuthProvider.PROVIDER_ID
*/          
        ],
        tosUrl: 'http://guardianrutas.com/politicas-y-condiciones-de-uso-guardian-app-padres/'
      };
    var ui = new firebaseui.auth.AuthUI(autor);
    ui.start('#firebaseui-auth-container', uiConfig);    
}

function initApp() {
/*
    if( myUserId != "" ) {
        console.log("Intento 1" + myUserId);
        return; 
    }
*/  
    if( autor.currentUser )  {
        myUserId = autor.currentUser.uid;
        console.log("Intento 3" + myUserId);
//                return myUserId;
    }
    autor.onAuthStateChanged( function( user ) {
        if ( user ) {
        // User is signed in.
            displayName = user.displayName;
            email = user.email;
            photoURL = user.photoURL;
            myUserId = user.uid;
            phoneNumber = user.phoneNumber;
            console.log("Intento 2" + myUserId);
//            return myUserId;
/*            
            user.getIdToken().then( function( accessToken ) {
                if( contador > 0 || intentos > 0 ) { return; }
                cnsRutasEmpresa();
                if( registrado > 0 ) { 
                    cambioPagina("mapaRuta.html");
                } else {
                    cambioPagina("createEnterprise.html");
                }
            });
*/            
        } else {
            if( autor.currentUser )  {
                myUserId = autor.currentUser.uid;
                console.log("Intento 3" + myUserId);
//                return myUserId;
            }
        }
    }, function( error ) {
      console.log("Error Login:" + error);
    } );
}

function cerrarSesion(){
    autor.signOut();
    redireccionar("index.html");
}