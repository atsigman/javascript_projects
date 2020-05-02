//get elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip');
const ranges = player.querySelectorAll('.player__slider');
const fullScreenToggle = player.querySelector('.player__fullscreen'); 

//build functions

function togglePlay() {
   const method = video.paused ? 'play' : 'pause';
   video[method]();
   
}

function updateButton() {
    const icon = this.paused ? '▶' : '▌▌'; 
    toggle.textContent = icon; 
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
   video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`; // update flexbasis parameter of progress__filled 
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration; 
    video.currentTime = scrubTime; 
}

function toggleFullScreen() {
    if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen(); 
    }
} 

// connect event listeners

video.addEventListener('click', togglePlay); 
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
toggle.addEventListener('click', togglePlay); 
skipButtons.forEach(skipbutton => skipbutton.addEventListener('click', skip)); 
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate)); 
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

let mousedown = false; 
progress.addEventListener('click', scrub); 
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));  // if mousedown is false, returns false and does not run scrub
progress.addEventListener('mousedown', () => mousedown = true); // flag  
progress.addEventListener('mouseup', () => mousedown = false); 

fullScreenToggle.addEventListener('click', toggleFullScreen); 