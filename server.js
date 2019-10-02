const express = require('express')
    , app = express()
    , http = require('http').Server(app)
    , SerialPort = require('serialport')
    ;
var port = new SerialPort("COM1", {
    baudRate: 4800,
    dataBits: 7
});
var lastvalue = {
    weight: 0
    , tare: 0
}
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', function (req, res) {
    res.send(JSON.stringify(lastvalue));
});
http.listen(8082, function () {
    console.log('Server UP', 'PID ' + process.pid);
});
function placeString(str, place, position) {
    return [str.slice(0, position), place, str.slice(position)].join('')
}
var x = 0;
var str = '';
port.on('data', function (data) {
    var original = data.toString('utf8').trim();
    var aux = parseInt(original);
    if (Number.isInteger(aux)) {
        x++;
        str += '' + original;
        if (x === 3) {
            lastvalue.weight = parseFloat(placeString(str.substring(0, 6), '.', 4));
            lastvalue.tare = parseFloat(placeString(str.substring(6, 12), '.', 4));
        }
    } else {
        str = '';
        x = 0;
    }
});