//Настройки платформы

exports.platform = {
    platformid  : 2
    , track     : 3
}

exports.conString = "tcp://postgres:532@localhost/postgres"

exports.gps = {
      port      :"/dev/ttyACM0"
    , baudrate  : 19200
    , databits  : 8
    , stopbits  : 1
    , parity    : 0
}