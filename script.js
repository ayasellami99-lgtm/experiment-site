// --- Get all page sections ---
const consentDiv = document.getElementById('consent');
const infoDiv = document.getElementById('personal-info');
const questionnaireDiv = document.getElementById('questionnaire');
const experimentDiv = document.getElementById('experiment');

// --- Get page elements ---
const videoEl = document.getElementById('video');
const cameraEl = document.getElementById('camera');
const nextBtn = document.getElementById('next-video');

// --- Your video list (replace with real file names) ---
const videos = [
  'videos/video1.mp4',
  'videos/video2.mp4'
];
let currentVideo = 0;

// --- Step 1: Consent ---
document.getElementById('consent-yes').onclick = async () => {
  consentDiv.classList.add('hidden');
  infoDiv.classList.remove('hidden');

  // Start webcam
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraEl.srcObject = stream;
  } catch (err) {
    alert('Camera access denied!');
  }
};

// --- Step 2: Personal Info ---
document.getElementById('personal-form').onsubmit = e => {
  e.preventDefault();
  infoDiv.classList.add('hidden');
  questionnaireDiv.classList.remove('hidden');
};

// --- Step 3: Questionnaire ---
document.getElementById('start-videos').onclick = () => {
  questionnaireDiv.classList.add('hidden');
  experimentDiv.classList.remove('hidden');
  playVideo();
};

// --- Step 4: Play Videos ---
function playVideo() {
  if (currentVideo < videos.length) {
    videoEl.src = videos[currentVideo];
  } else {
    alert('Experiment complete! Thank you for participating!');
  }
}

// --- Step 5: Next Video Button ---
nextBtn.onclick = () => {
  const laughRating = document.getElementById('laugh-scale').value;
  console.log(`Video ${currentVideo + 1} rating: ${laughRating}`);

  currentVideo++;
  playVideo();
};
let mediaRecorder;
let recordedChunks = [];
let responses = []; // store all answers here

// Consent button
document.getElementById('consent-yes').onclick = async () => {
  consentDiv.classList.add('hidden');
  infoDiv.classList.remove('hidden');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    cameraEl.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };
    mediaRecorder.start();
  } catch (err) {
    alert('Camera access denied!');
  }
};

// Example: when participant rates a video
function submitRating() {
  const rating = document.getElementById('rating').value;
  responses.push({ video: videos[currentVideo], rating });
  currentVideo++;
  playVideo();
}

// Called when the last video is done
async function finishExperiment() {
  alert('Experiment complete! Uploading data...');
  mediaRecorder.stop();

  mediaRecorder.onstop = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('video', blob, 'participant.webm');

    // Upload video
    await fetch('/upload', { method: 'POST', body: formData });

    // Upload questionnaire responses
    await fetch('/save-responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responses)
    });

    alert('All data uploaded. Thank you!');
  };
}

// Example modification in your video logic
function playVideo() {
  if (currentVideo < videos.length) {
    videoEl.src = videos[currentVideo];
  } else {
    finishExperiment(); // instead of alert only
  }
}