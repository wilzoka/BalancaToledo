const express = require('express')
    , app = express()
    , http = require('http').Server(app)
    , SerialPort = require('serialport')
    ;
const port = new SerialPort(process.env.COM, {
    baudRate: 4800,
    dataBits: 7
});
let lastvalue = {
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
http.listen(process.env.NODE_PORT, function () {
    console.log('Server UP', 'PID ' + process.pid, 'Port', process.env.NODE_PORT);
});
function placeString(str, place, position) {
    return [str.slice(0, position), place, str.slice(position)].join('')
}
let x = 0;
let str = '';
port.on('data', function (data) {
    let original = data.toString('utf8').trim();
    let aux = parseInt(original);
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