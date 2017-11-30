'use strict'

var io = require('socket.io-client')
var socket = io('http://localhost:8888')

socket.on('connect', function() {
  console.log(socket.id)
})

socket.on('steering_angle', function(data) {
  console.log('Steering angle:', data)
})

socket.on('tps_opened', function(data) {
  console.log('Throttle pedal open')
})

socket.on('bps_opened', function(data) {
  console.log('Brake pedal open')
})

socket.on('cps_opened', function(data) {
  console.log('Clutch pedal open')
})
