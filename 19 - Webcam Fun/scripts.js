const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const redEffect = function(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // R
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // G
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // B
  }
  return pixels;
}

const rgbSplit = function(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // R
    pixels.data[i + 100] = pixels.data[i + 1]; // G
    pixels.data[i + 150] = pixels.data[i + 2]; // B
  }
  return pixels;
}

const getVideo = function() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error(`ERROR: `, err);
    });
}

const paintToCanvas = function() {
  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    let pixels = ctx.getImageData(0, 0, width, height);
    pixels = rgbSplit(pixels);
    ctx.globalAlpha = 0.1;
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

const takePhoto = function() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  strip.insertBefore(link, strip.firstChild);
}

getVideo();

video.addEventListener('canplay', paintToCanvas);