var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
    console.log('******** File created from base64 encoded string ********');
}

// convert image to base64 encoded string
var base64str = base64_encode('input.jpg');

var bitmap = new Buffer(base64str, 'base64');

sharp(bitmap)
  .resize(200, 100)
  .max()
  .toFormat('jpeg')
  .toBuffer()
  .then(function(outputBuffer) {
    // outputBuffer contains JPEG image data no wider than 200 pixels and no higher
    // than 200 pixels regardless of the inputBuffer image dimensions
    // convert base64 string back to image 
    fs.writeFileSync('out.jpg', outputBuffer);
    console.log('done')
  });


sharp('input.jpg')
  .resize(300, 200)
  .toFile('output.jpg', function(err) {
    console.log(err)
    // output.jpg is a 300 pixels wide and 200 pixels high image
    // containing a scaled and cropped version of input.jpg
  });