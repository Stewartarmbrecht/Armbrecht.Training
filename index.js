var http = require('http'),
   mongo = require('mongoskin');

http.createServer(function (req, res) {

    var conn = mongo.db('stewartarmbrecht:Qc!814u2@widmore.mongohq.com:10000/ArmbrechtTraining');
    conn.collection('account')
        .find({name:'My Account'})
        .toArray(function(err, items){
            if(err) throw err;
    
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify(items));
          });

}).listen(process.env.C9_PORT, process.env.IP);
console.log('Server running...');
