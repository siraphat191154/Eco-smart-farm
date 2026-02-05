const video = document.getElementById("webcam");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resultDiv = document.getElementById("result");

let model, webcamStream;

// 👇 โหลดโมเดลจากโฟลเดอร์ "model" ที่อยู่ในเครื่อง
const MODEL_URL = "./model/";

async function loadModel() {
  const modelURL = MODEL_URL + "model.json";
  const metadataURL = MODEL_URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
  console.log("✅ Model Loaded (from local folder)");
}

async function startCamera() {
  try {
    webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = webcamStream;
  } catch (err) {
    alert("❌ ไม่สามารถเปิดกล้องได้: " + err.message);
  }
}

function stopCamera() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
}

async function predictLoop() {
  if (!model || !video.srcObject) return;

  const prediction = await model.predict(video);
  let best = prediction.reduce((max, p) => (p.probability > max.probability ? p : max));
  resultDiv.textContent = `ผลการวิเคราะห์: ${best.className} (${(best.probability * 100).toFixed(1)}%)`;

  requestAnimationFrame(predictLoop);
}

startBtn.addEventListener("click", async () => {
  await loadModel();
  await startCamera();
  predictLoop();
});

stopBtn.addEventListener("click", () => {
  stopCamera();
  resultDiv.textContent = "ผลการวิเคราะห์: -";
});