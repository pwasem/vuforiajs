var vuforia = function () {

    var client = require(__dirname + '/lib/client');
    var util = require(__dirname + '/lib/util');

    return {

        'client': client,
        'util' : util
    };

};

module.exports = vuforia();
