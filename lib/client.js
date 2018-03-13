const vwsHostname = 'vws.vuforia.com';
const cloudRecoHostname = 'cloudreco.vuforia.com';

var client = function (options) {

    var https = require('https');
    var util = require(__dirname + '/util')();

    var doHttpsRequest = function (httpsOptions, body, callback) {

        var request = https.request(httpsOptions, function (response) {

            var data = '';

            response.setEncoding('utf8');

            response.on('data', function (chunk) {

                data += chunk;
            });

            response.on('end', function () {

                try {

                    var result = JSON.parse(data);

                    if (response.statusCode === 200 || response.statusCode === 201) {

                        callback(null, result);

                    } else {

                        var error = new Error(result.result_code);
                        callback(error, result);
                    }

                } catch (error) {

                    callback(error, {});
                }
            });
        });

        request.on('error', function (error) {

            callback(error);
        });

        request.write(body);
        request.end();
    };

    var doVwsRequest = function (request, callback) {

        request.accessKey = options.accessKey;
        request.secretKey = options.secretKey;
        request.timestamp = util.timestamp();

        var httpsOptions = {

            hostname: vwsHostname,
            path: request.path,
            method: request.method,
            headers: {

                'Content-Length': Buffer.byteLength(request.body),
                'Content-Type': request.contentTypeHeader || request.type,
                'Authorization': util.createAuthorization(request),
                'Date': request.timestamp
            }

        };

        doHttpsRequest(httpsOptions, request.body, callback);
    };

    var doCloudRecoRequest = function (request, callback) {
        
        request.accessKey = options.clientAccessKey;
        request.secretKey = options.clientSecretKey;
        request.timestamp = util.timestamp();

        var httpsOptions = {

            hostname: cloudRecoHostname,
            path: request.path,
            method: request.method,
            headers: {

                'Content-Length': Buffer.byteLength(request.body),
                'Content-Type': request.contentTypeHeader || request.type,
                'Authorization': util.createAuthorization(request),
                'Date': request.timestamp
            }

        };

        doHttpsRequest(httpsOptions, request.body, callback);
    };

    var listTargets = function(callback) {

        var request = {

            'path': '/targets',
            'method': 'GET',
            'type': 'application/json',
            'body': ''
        };

        doVwsRequest(request, callback);

    };

    var addTarget = function (target, callback) {

        var request = {

            'path': '/targets',
            'method': 'POST',
            'type': 'application/json',
            'body': JSON.stringify(target)
        };

        doVwsRequest(request, callback);
    };

    var retrieveTarget = function (targetId, callback) {

        var request = {

            'path': '/targets/' + targetId,
            'method': 'GET',
            'type': 'application/json',
            'body': ''
        };

        doVwsRequest(request, callback);

    };

    var updateTarget = function (targetId, target, callback) {

        var request = {

            'path': '/targets/' + targetId,
            'method': 'PUT',
            'type': 'application/json',
            'body': JSON.stringify(target)
        };

        doVwsRequest(request, callback);
    };

    var deleteTarget = function (targetId, callback) {

        var request = {

            'path': '/targets/' + targetId,
            'method': 'DELETE',
            'type': 'application/json',
            'body': ''
        };

        doVwsRequest(request, callback);
    };

    var checkForDuplicateTargets = function (targetId, callback) {

        var request = {

            'path': '/duplicates/' + targetId,
            'method': 'GET',
            'type': 'application/json',
            'body': ''
        };

        doVwsRequest(request, callback);
    };

    var cloudRecoQuery = function (binaryImage, max_num_results, callback) {

        var request = {
            
            'path': '/v1/query',
            'method': 'POST',
            'type': 'multipart/form-data',
            'body': util.createCloudRecoQueryBody(binaryImage, max_num_results),
            'contentTypeHeader': util.createCloudRecoQueryContentTypeHeader()
        };

        doCloudRecoRequest(request, callback);
    };

    var retrieveTargetSummary = function (targetId, callback) {
        
        var request = {

            'path': '/summary/' + targetId,
            'method': 'GET',
            'type': 'application/json',
            'body': ''
        };

        doVwsRequest(request, callback);
    };

    return {

        'listTargets' : listTargets,
        'addTarget': addTarget,
        'retrieveTarget': retrieveTarget,
        'updateTarget' : updateTarget,
        'deleteTarget' : deleteTarget,
        'checkForDuplicateTargets': checkForDuplicateTargets,
        'cloudRecoQuery': cloudRecoQuery,
        'retrieveTargetSummary':retrieveTargetSummary
    };

};

module.exports = client;
