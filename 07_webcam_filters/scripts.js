const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
var timer; 

// captures video from webcam 
function getVideo () {
    navigator.mediaDevices.getUserMedia({video: true, audio: false}) // promise
        .then(localMediaStream => {
            console.log(localMediaStream)
            video.srcObject = localMediaStream;   // createObjectURL disabled in Chrome
            video.play(); 
        }).catch(err => {
            console.log("Please allow app access to webcam", err);
        });
    }
    
function paintToCanvas(button) {
    clearInterval(timer); 
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width; 
    canvas.height = height; // canvas dimensions should match video dimensions


    timer = setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height); // for filter application
    var x = button.id;
    if (x == 1) {
        pixels = grayScale(pixels);    
    }

    if (x == 2) {
        pixels = redEffect(pixels)
        ctx.globalAlpha = 0.9;
    }
    if (x == 3) {
        pixels = blueEffect(pixels); 
        ctx.globalAlpha = 0.8;
    }
    
    if (x == 4) {
        pixels = rgbSplit(pixels);
        ctx.globalAlpha = 0.1;
    }

    if (x == 5) {
        pixels = greenScreen(pixels); 
    } 
　　ctx.putImageData(pixels,0,0); 
   }, 64); // wait time in ms 
}


   function takePhoto() {
    // the audio: 
    snap.currentTime = 0; 
    snap.play(); 

    // extract data from canvas: 
    const data = canvas.toDataURL('img/png'); 
    const link = document.createElement('a') // anchor
    link.href = data; 
    link.setAttribute('download', 'kakko_ii');
    link.innerHTML = `<img src="${data}" />`; 
    strip.insertBefore(link, strip.firstChild);
   }

   function grayScale(pixels) {
    for (i = 0; i < pixels.data.length; i+=4) {
     pixels.data[i] =  pixels.data[i] / 2; // R
     pixels.data[i+1] = pixels.data[i] / 2; // G
     pixels.data[i+2] = pixels.data[i] / 2; // B
    }
    return pixels; 
 } 
   function redEffect(pixels) {
       for (i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i] = pixels.data[i] + 175; // R
        pixels.data[i+1] = pixels.data[i+1] - 100; // G
        pixels.data[i+2] = pixels.data[i+2] * 0.25; // B
       }
       return pixels; 
    } 

    function blueEffect(pixels) {
        for (i = 0; i < pixels.data.length; i+=4) {
         pixels.data[i] = pixels.data[i] * 0.25; // R
         pixels.data[i+1] = pixels.data[i+1] - 100; // G
         pixels.data[i+2] = pixels.data[i+2] + 175; // B
        }
        return pixels; 
     } 

    function rgbSplit(pixels) {
        for (i = 0; i < pixels.data.length; i+=4) {
         pixels.data[i - 150] = pixels.data[i] // R
         pixels.data[i + 500] = pixels.data[i+1]; // G
         pixels.data[i - 550] = pixels.data[i+2]  // B
        }
        return pixels; 
     } 

    function greenScreen(pixels) {
        const levels = {}; 
        document.querySelectorAll('.rgb input').forEach(input => {
            levels[input.name] = input.value;
        }); 

        for (i = 0; i < pixels.data.length; i = i + 4) {
            red = pixels.data[i + 0];
            green = pixels.data[i + 1];
            blue = pixels.data[i + 2];
            alpha = pixels.data[i + 3];
        
            if (red >= levels.rmin
              && green >= levels.gmin
              && blue >= levels.bmin
              && red <= levels.rmax
              && green <= levels.gmax
              && blue <= levels.bmax) {
              // take it out!
              pixels.data[i + 3] = 0;
            }
          }
          return pixels;
    }

    getVideo(); 


