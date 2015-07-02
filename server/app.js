
var express = require("express");
var app     = express();

// Configuração com o banco de dados:
var mysql    = require('mysql');
var pool     =    mysql.createPool({
    connectionLimit : 100, //importante limitar
    host     : '54.207.9.240',
    user     : 'dreamtech',
    password : '00dreaming00',
    database : 'web_tp2_caixeta',
    debug    :  false
});

function handle_database(req,res) {
   
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Erro na conexão com a base de dados"});
          return;
        }
        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Erro na conexão com a base de dados"});
              return;    
        });
  });
}



// configurar qual templating engine usar.
app.set('view engine', 'hbs');

// define onde estão as views
app.set('views', 'server/views');

// configurar para servir os arquivos estáticos da pasta "client"
app.use(express.static('client'));


// abrir servidor
app.listen(3000);