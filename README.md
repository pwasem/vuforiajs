vuforiajs
=========

 Node.js client for the Vuforia Web Services API (VWS API)
 
 usage
=========
 
 ```
 
     var vuforia = require('vuforiajs');
     
     var client = vuforia.client({
     
         'accessKey': 'df8d23140eb443505c0661c5b58294ef472baf64',
         'secretKey': '46fab274fe49285b5c1660c505344be04132d8fd'
     });
     
     client.addTarget({
     
         'name': 'Your Image',
         'width': 32.0,
         'image': vuforia.util.encodeFileBase64(__dirname + '/image.png'),
         'active_flag': true,
         'application_metadata': vuforia.util.encodeBase64('some metadata about your image')
     
     }, function (error, result) {
     
         if (error) {
     
             console.error(error);
     
         } else {
     
             console.log(result);
         }
     });
     
     /*
      * also try: 
      *
      * client.listTargets(callback)
      * client.retrieveTarget(targetId,callback) 
      * client.updateTarget(targetId,target,callback) 
      * client.deleteTarget(targetId,callback) 
      * client.checkForDuplicateTargets(targetId,callback)
      */


 ```
