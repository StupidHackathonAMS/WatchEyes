const FaceDetectify = require("face-detectify");


var five = require("johnny-five");
var board = new five.Board();

var spawn = require('child_process').spawn;


board.on("ready", function() {
  var servo = new five.Servo(10);

  console.log("Servo ready...");

  setInterval(() => {
    var prc = spawn('imagesnap');

    // prc.stdout.setEncoding('utf8');
    // prc.stdout.on('data', function (data) {
    // var str = data.toString()
    // var lines = str.split(/(\r?\n)/g);
    // console.log(lines.join(""));
    // });

    /*
    Example:
    { data:
      [ { total: 1, width: 95, height: 95, x: 1323, y: 462 },
        { total: 1, width: 95, height: 95, x: 994, y: 476 } ] }
    */

    prc.on('close', function (code) {
      if (code != 0) {
        console.error('process exit code ' + code);
      } else {
        FaceDetectify.fromFile(`${__dirname}/snapshot.jpg`).then((rects) => {
          // console.log('data', rects);
          if (rects.data.length == 0) {
            //console.log('no face detected');
          } else {
            const x = rects.data[0].x + rects.data[0].width/2;
            // console.log('data', rects.data[0]);
            console.log(`face: n=${rects.data.length}, x=${x}`);


            // servo 30 - 70

            const servoX = Math.round(80-(x/1000)*60);

            console.log('servo', servoX);

            servo.to(servoX);
          }


        }).catch(console.error);
      }
    });
  }, 2000);
});





