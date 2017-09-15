var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";
var path = require('path'),
  async = require('async'), //https://www.npmjs.com/package/async
  newman = require('newman'),
  fs = require('fs');

var parametersForTestRun = {
    collection: path.join(__dirname, 'chat.postman_collection.json'), // your collection
    environment: path.join(__dirname, 'test.postman_environment.json'), //your env
  };
var http = require('http');
parallelCollectionRun = function(done) {
  newman.run(parametersForTestRun, done);
};
var tests=[];





var runTest = function (res) {
    console.log('run');
    // Runs the Postman sample collection thrice, in parallel.
async.parallel(tests,
  function(err, results) {
    err && console.error(err);

    results.forEach(function(result) {
      var failures = result.run.failures;
      console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
             
        `${result.collection.name} ran successfully.`);
//console.log(result);

    });
    res.write('Runed');
    res.end();
    tests=[];
  });
  
  
}
var loadTest = function (max) {
    for (var i = 0; i < max; i++) {
        tests.push(parallelCollectionRun);
        
        if(i>=max){
            runTest();
        }
    }
    
}
http.createServer(function (req, res) {
    //console.log(req);
    console.log(req.url);
    console.log(req.method);
    var re = /^((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
    var test = re.exec(req.url);
    //test[2].replace("/","");
    var number="";
    if(test!=null){
        try{
            number = test[2].replace("/","");
            number = parseInt(number);
            if(number>100){
                throw new Error("Limit concurrents");
            }
            if(test[3]=='dudnd73nbx823nbxins8jxznd83ndinxomsjdnew8723ndushg237wndjsd73slks83'
                &&req.method=='GET'){

                loadTest(number);
                //res.write('run..!');
                runTest(res);
               // res.write('Service active');
               // res.end();
                return;
            }else{
                throw new Error("method error");
            }
        }catch (exception) {
            res.write('Service active:'+exception);
            res.end();
            return;
        }
    }else{
       fs.readFile('./views/index.html', function (err, html) {
            if (err) {
                console.log(err); 
            }       
                res.writeHeader(200, {"Content-Type": "text/html"});  
                res.write(html);  
                res.end(); 
        });  
    }

    
    
   
    
  //res.writeHead(200, {'Content-Type': 'text/plain'});
    
 // res.write('Service active');
  //res.end();
}).listen(port);
