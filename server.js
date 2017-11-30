'use strict'

var HID = require('node-hid')
var wheel = new HID.HID(1133, 49760)
var io = require('socket.io').listen(8888)

io.on('connect', function(socket) {
  console.log('a user connected')
})

wheel.on('data', function(data) {
  var bit44 = data[44].toString(16)
  var bit43 = ('00' + data[43].toString(16)).substr(-2)
  var hex = bit44 + bit43
  var wheelPosition = parseInt(hex, 16)
  var angleAbs = wheelPosition / 72.25
  var steeringAngle = Math.floor(angleAbs - 450)
  var tps = Math.abs(255 - data[46])
  var bps = Math.abs(255 - data[48])
  var cps = Math.abs(255 - data[50])
  console.log('steering angle:', steeringAngle)
  io.sockets.emit('steering_angle', steeringAngle)
  if (tps != 0) {
    console.log('throttle pedal position:', tps)
    io.sockets.emit('tps', tps)
  }
  if (bps != 0) {
    console.log('brake pedal position:', bps)
    io.sockets.emit('bps', bps)
  }
  if (cps != 0) {
    console.log('clutch pedal position:', cps)
    io.sockets.emit('cps', cps)
  }
  if (tps == 255) {
    io.sockets.emit('tps_opened', 1)
  }
  if (bps == 255) {
    io.sockets.emit('bps_opened', 1)
  }
  if (cps == 255) {
    io.sockets.emit('cps_opened', 1)
  }
  if (tps == 0) {
    io.sockets.emit('tps_closed', 1)
  }
  if (bps == 0) {
    io.sockets.emit('bps_closed', 1)
  }
  if (cps == 0) {
    io.sockets.emit('cps_closed', 1)
  }
})

