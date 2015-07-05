
var express      = require("express");
var bodyParser = require('body-parser');
var app          = express();

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
 
function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
// Configuração com o banco de dados:
var mysql      = require('mysql');
var db = mysql.createConnection({
    host     : '54.207.9.240',
    database : 'web_tp2_caixeta',
    user     : 'dreamtech',
    password : '00dreaming00',
    multipleStatements: true
});
db.connect(function(err) {
    if (err) throw err;
        console.log('connected as id ' + db.threadId);
});

//Feio, eu sei... mas é pq estou sem tempo para conseguir desenvolver a verificação de sessão
global.id = '';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// configurar qual templating engine usar.
app.set('view engine', 'hbs');

// define onde estão as views
app.set('views', 'server/views');

//Rotas
app.get('/',function (req, res) {
    //TODO: Fazer controle de sessão
    res.render('index');
});

app.post('/',function (req, res) {
    var query = 'SELECT id_usuario, pass_usuario FROM usuarios WHERE email_usuario LIKE "' + db.escape(req.body.email) + '";';
    db.query(query, function(err, rows, fields) {
        if (err)  { res.send(401, 'Erro ao fazer login: '+ err); }
        else      { 
            if (rows.length===0){
                res.send(401, 'Erro ao fazer login: Usuário inválido!');
            }
            else{
                if(decrypt(rows[0].pass_usuario) === '\''+(req.body.password)+'\''){
                    global.id = rows[0].id_usuario;
                    res.redirect('/app');
                }
                else{
                    res.send(401, 'Erro ao fazer login: Senha inválida!');                
                }
            }
        }       
    });
    
});

app.get('/register',function (req, res) {
    res.render('register');
});

app.post('/register',function (req, res) {
    var passhash = encrypt(db.escape(req.body.password));
    var query = 'INSERT INTO usuarios (nm_usuario, snm_usuario, email_usuario, pass_usuario) VALUES ("' + db.escape(req.body.nome) + '" , "' + db.escape(req.body.sobrenome) + '" , "' + db.escape(req.body.email) + '" , "' + passhash + '");';
    db.query(query, function(err, result) {
        if (err)  { res.send(401, 'Erro ao registrar: '+ err); }
        else      { 
            global.id = result.insertId;
            res.redirect('../app');
        }
    });
    
});

app.get('/app',function (req, res) {
    if(global.id===''){
        res.redirect('/');
    }
    else{
        console.log(global.id);
                        var query = 'SELECT * FROM eventos WHERE id_usuario = ' + global.id + ';';
                db.query(query, function(err, rows, fields) {
                    if(err) { res.send(401, 'Erro ao recarregar o calendário: '+ err); }
                    else{
                        var result = [];
                        for ( var i in rows){
                            var ini = new Date(''+ rows[i].dt_ini_evento+' '+rows[i].hr_ini_evento);
                            var mili_ini = ini.getTime();
                            var fim = new Date(''+ rows[i].dt_fim_evento+' '+rows[i].hr_fim_evento);
                            var mili_fim = fim.getTime();
                            var event = {
                                "id": rows[i].id_evento,
                                "title": rows[i].titulo_evento,
                                "url": "#",
                                "class": "event-important",
                                "start": mili_ini,
                                "end": mili_fim
                                };
                            result.push(event);                        
                        }
                        res.render('calendario',result);
                    }
                });
    }
});

app.post('/app',function (req, res) {
    if(db.escape(req.body.nome).length>0 && db.escape(req.body.desc).length>0 && db.escape(req.body.dt_ini).length>0 && db.escape(req.body.hr_ini).length>0 && db.escape(req.body.dt_fim).length>0 && db.escape(req.body.hr_fim).length>0){
    console.log("Add tarefa");
        var query = 'INSERT INTO eventos (titulo_evento, desc_evento, dt_ini_evento,hr_ini_evento,dt_fim_evento, hr_fim_evento, id_usuario) VALUES ("' + db.escape(req.body.nome) + '" , "' + db.escape(req.body.desc) + '" , ' + db.escape(req.body.dt_ini) + ' , ' + db.escape(req.body.hr_ini) + ' , ' + db.escape(req.body.dt_fim) + ' , ' + db.escape(req.body.hr_fim) + ', ' + global.id + ');';
        db.query(query, function(err, result) {
            if (err)  { res.send(401, 'Erro ao adicionar: '+ err); }
            else      
            { 
                var query = 'SELECT * FROM eventos WHERE id_usuario = ' + global.id + ';';
                db.query(query, function(err, rows, fields) {
                    if(err) { res.send(401, 'Erro ao recarregar o calendário: '+ err); }
                    else{
                        var result = [];
                        for ( var i in rows){
                            var ini = new Date(''+ rows[i].dt_ini_evento+' '+rows[i].hr_ini_evento);
                            var mili_ini = ini.getTime();
                            var fim = new Date(''+ rows[i].dt_fim_evento+' '+rows[i].hr_fim_evento);
                            var mili_fim = fim.getTime();
                            var event = {
                                "id": rows[i].id_evento,
                                "title": rows[i].titulo_evento,
                                "url": "#",
                                "class": "event-important",
                                "start": mili_ini,
                                "end": mili_fim
                                };
                            result.push(event);                        
                        }
                        res.json(''+result);
                        res.send(200);
                    }
                });
            }
        });
    }
    
});

app.get('/logout',function (req, res) {
    global.id='';
    res.redirect('/');
});



//TODO: Fazer Login com FB

// configurar para servir os arquivos estáticos da pasta "client"
app.use(express.static('client'));


app.set('port', (process.env.PORT || 3000));

// abrir servidor
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
