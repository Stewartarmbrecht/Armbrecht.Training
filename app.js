var express = require('express'),
   mongo = require('mongoskin');

var connection = 'stewartarmbrecht:Password@widmore.mongohq.com:10000/ArmbrechtTraining';
var app = express();
app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});

app.post('/accounts', function(req, res){
    var account = {
        name: req.body.name,
        description: req.body.description
    };
    var conn = mongo.db(connection);
    conn.collection('account').insert(account, null, function(err, items){
        if(err) throw err;
        res.send(JSON.stringify(items));
    });
});
app.get('/accounts/:id', function(req, res){
    var conn = mongo.db(connection);
    conn.collection('account')
        .findById(req.params.id, function(err, items){
            if(err) throw err;
            res.send(JSON.stringify(items));
        });
});
app.put('/accounts/:id', function(req, res){
    var account = req.body;
    var conn = mongo.db(connection);
    conn.collection('account').updateById(req.params.id, null, account, null, function(err, item){
        if(err) throw err;
        res.send(JSON.stringify(item));
    });
});
app.patch('/accounts/:id', function(req, res){
    var account = req.body;
    var conn = mongo.db(connection);
    conn.collection('account').updateById(req.params.id, {$set: account}, function(err, item){
        if(err) throw err;
        res.send(JSON.stringify(item));
    });
});
app.get('/accounts', function(req, res){
    var conn = mongo.db(connection);
    conn.collection('account')
        .find()
        .toArray(function(err, items){
            if(err) throw err;
            res.send(JSON.stringify(items));
          });
});
app.delete('/accounts/:id', function(req, res){
    var conn = mongo.db(connection);
    conn.collection('account').removeById(req.params.id, null, function(){
       res.send(200); 
    });
});
app.listen(process.env.C9_PORT, process.env.IP);
console.log('Listening on ' + process.env.IP  + ':' + process.env.C9_PORT);