vuforiajs
=========

 Node.js client for the Vuforia Web Services API (VWS API)
 
 usage
=========
 
 ```
 
     var vuforia = require('vuforia');
     
     var client = vuforia.client({
         "accessKey": "abcdefghijklmnop",
         "secretKey": "qwertzuiopüasdfg""
     });
     
     client.addTarget({
     
         'name': 'Your Image',
         'width': 32.0,
         'image': vuforia.util.encodeFileBase64(__dirname + '/image.png'),
         'active_flag': true,
         'application_metadata': vuforia.util.encodeBase64('Some metadata about your image')
     
     }, function (error, result) {
     
         if (error) {
     
             console.error(error);
     
         } else {
     
             console.log(result);
         }
     });


 ```
