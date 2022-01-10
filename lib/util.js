const boundary = "----------ThIs_Is_tHe_bouNdaRY_$";

var util = function () {

    var crypto = require('crypto');
    var fs = require('fs');

    var timestamp = function() {

        var now = new Date();
        return now.toUTCString();
    };

    var encodeBase64 = function(input) {

        var serialization = input.toString();

        var buffer = new Buffer(serialization);

        return buffer.toString('base64');
    };

    var decodeBase64 = function(input) {

        var buffer = new Buffer(input,'base64');

        return buffer.toString();
    };

    var encodeFileBase64 = function(path) {

        var buffer = fs.readFileSync(path);

        return buffer.toString('base64');
    };

    var hashHmacSha1Base64 = function (key, input) {

        var hmacSha1base64 =

            crypto
                .createHmac('sha1', key)
                .update(input)
                .digest('base64');

        return hmacSha1base64;

    };

    var hashMd5Hex = function (input) {

        var md5 =

            crypto
                .createHash('md5')
                .update(input)
                .digest('hex');

        return md5;
    };

    var createStringToSign = function (request) {

        var newLine = '\n';

        var stringToSign =

            request.method + newLine +
            hashMd5Hex(request.body) + newLine +
            request.type + newLine +
            request.timestamp + newLine +
            request.path;

        return stringToSign;

    };

    var createSignature = function (request) {

        var stringToSign = createStringToSign(request);

        var signature = hashHmacSha1Base64(request.secretKey, stringToSign);

        return signature;
    };

    var createAuthorization = function (request) {

        var signature = createSignature(request);

        var authorization = 'VWS ' + request.accessKey + ':' + signature;

        return authorization;
    };

    var createCloudRecoQueryBody = function (binaryImage, max_num_results) {
        var body =  "";

        if (max_num_results !== undefined) {
            if (isNaN(max_num_results)) {
                throw new Error("max_num_results is not a number");
            } else if (max_num_results < 1 || max_num_results > 10) {
                throw new Error("max_num_results is out of allowed interval [1-10]");
            } else {
                var body = body + 
                "--"+boundary + "\r\n" +
                'Content-Disposition: form-data; name="max_num_results"' + "\r\n\r\n" +
                max_num_results + "\r\n";
            }
        }

        var body = body + 
        "--"+boundary + "\r\n" +
        'Content-Disposition: form-data; name="image"; filename="image.jpg"' + "\r\n" +
        "Content-Type: image/jpeg\r\n\r\n" +
        binaryImage + "\r\n" +
        "--" + boundary + "--\r\n";

        return Buffer.from(body, 'binary');
    };

    var createCloudRecoQueryContentTypeHeader = function () {
        return "multipart/form-data; boundary=" + boundary;
    };

    return {

        'timestamp' : timestamp,
        'encodeBase64' : encodeBase64,
        'decodeBase64' : decodeBase64,
        'encodeFileBase64' : encodeFileBase64,
        'hashHmacSha1Base64' : hashHmacSha1Base64,
        'hashMd5Hex': hashMd5Hex,
        'createAuthorization' : createAuthorization,
        'createCloudRecoQueryBody' : createCloudRecoQueryBody,
        'createCloudRecoQueryContentTypeHeader' : createCloudRecoQueryContentTypeHeader
    };

};

module.exports = util;