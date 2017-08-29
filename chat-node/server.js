var app     =     require("express")();
var mysql   =     require("mysql");
var http    =     require('http').Server(app);
var io      =     require("socket.io")(http);
var session = require('express-session');
var firebase = require('firebase');
var localStorage = '';
var localStorageId = '';
var usernameD = '';
var usernameDId = '';

var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'vzert2017',
  database:'notificaciones',
  socketPath:'/Applications/MAMP/tmp/mysql/mysql.sock'
});

var config = {
    apiKey: "AIzaSyC19RF5MhVJhlrrN9LZ3SRpBrqjwWztyiw",
    authDomain: "notificacion-cd32e.firebaseapp.com",
    databaseURL: "https://notificacion-cd32e.firebaseio.com",
    projectId: "notificacion-cd32e",
    storageBucket: "notificacion-cd32e.appspot.com",
    messagingSenderId: "665323947746"
};
firebase.initializeApp(config);

var sess;
app.use(session({secret:"ui2hf893hf232ofn3023fp"}));

var sess;

app.get('/',function(req, res){
     sess=req.session;
     sess.usuario = 5;
     console.log(sess.usuario);
    res.sendFile(__dirname + '/login.html');
});

var usuarioSession = '';

app.get('/validate',function(req,res){
  req.session.user = usernameD;

    if(!req.session.user){
      //return res.status(401).send();
      res.redirect('/');
    }
    res.redirect('/chat/'+usernameDId);
});

app.get('/chat/:userid',function(req, res){
    if(!req.session.user){
      res.redirect('/');
    }
    usuarioSession = req.session.user;
    res.sendFile(__dirname + '/index.html');
});

var usernamee = '';

io.on('connection',function(socket){  
    socket.on('nuevo',function(mensaje,userid,username){
      var funcion = addComentario(mensaje,userid);
      io.emit('refrescar',mensaje,username);
    });
    socket.on('login',function(user,pass){
        acceso(user,pass);
    });
    /*socket.on('setUsername',function(userId){
      getUsername(userId);
    });*/
    io.emit('username'+usernameDId,usuarioSession);
    io.emit('user_id',usernameDId);
});


var getUsername = function(userId){
  connection.connect(function(error){
    connection.query("select usuario from usuarios where id="+userId+";",function (error, results, fields){
        for (var value in results){
            usernamee = results[value].usuario;
        }
    });
    
  });
}

var acceso = function(user,pass){
  var usernamee = '';
  connection.connect(function(error){
      connection.query("select id,usuario,pass from usuarios where usuario='"+user+"' and pass='"+pass+"' ",function (error, results, fields) {
      if (error){
        alert('Datos incorrectos');
      }else{
          var data = JSON.stringify(results);
        if(data == "[]"){
          io.emit('loginError');
        }else{
            io.emit('loginSuccess',user);
            var json = JSON.parse(data);
            for(var value in json){
              localStorage = require('localStorage'),
              valor1 = json[value].usuario;
              localStorageId = require('localStorage'),
              valor2 = json[value].id;
              usernameD = JSON.stringify(valor1);
              usernameDId = JSON.stringify(valor2);
            }
        }
      }
    });
  });
  
}

var addComentario = function (mensaje,userId) {
    connection.connect(function(error) {
      var sql = "INSERT INTO `chat` (`mensaje`,`usuario_id`) VALUES ('"+mensaje+"',"+userId+")";
      connection.query(sql);
      firebase.database().ref('Notificaciones/chat/').push({
        mensaje:mensaje,
        usuario_id:userId
      });
    });
    connection.on('error', function(error) {
      console.log('error en la conexion de db '+error);
    }); 
}

http.listen(5000,function(){
    console.log("Listening on 5000"); 
});