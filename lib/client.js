var client = function (options) {

    var https = require('https');
    var util = require(__dirname + '/util');

    var doHttpsRequest = function (httpsOptions, body, callback) {

        var request = https.request(httpsOptions, function (response) {

            var data = '';

            response.setEncoding('utf8');

            response.on('data', function (chunk) {

                data += chunk;
            });

            response.on('end', function () {

                var result = JSON.parse(data);

                if (response.statusCode === 200 || response.statusCode === 201) {

                    callback(null, result);

                } else {

                    var error = new Error(result.result_code);
                    callback(error);
                }
            });
        });

        request.on('error', function (error) {

            callback(error);
        });

        request.write(body);
        request.end();
    };

    var doRequest = function (request, callback) {

        request.accessKey = options.accessKey;
        request.secretKey = options.secretKey;

        var hostname =  'vws.vuforia.com';
        var endpoint = request.path;

        var httpsOptions = {

            hostname: hostname,
            path: endpoint,
            method: request.method,
            headers: {

                'Content-Length': Buffer.byteLength(request.body),
                'Content-Type': request.type,
                'Authorization': util.createAuthorization(request),
                'Date': util.timestamp()
            }

        };

        doHttpsRequest(httpsOptions, request.body, callback);
    };

    var addTarget = function (target, callback) {

        var request = {

            'body': JSON.stringify(target),
            'type': 'application/json',
            'method': 'POST',
            'timestamp': new Date(),
            'path': '/targets'
        };

        doRequest(request, callback);
    }

    return {

        'addTarget' : addTarget
    }

};

module.exports = client;
