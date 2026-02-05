const MODEL_PATH = "model/";

let model, maxPredictions;

const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const placeholder = document.getElementById('placeholder');
const predictBtn = document.getElementById('predictBtn');
const resultDiv = document.getElementById('result');
const progressBarsDiv = document.getElementById('progress-bars');

// ✅ โหลดโมเดลจากโฟลเดอร์ภายในโปรเจกต์
async function init() {
  const modelURL = MODEL_PATH + "model.json";
  const metadataURL = MODEL_PATH + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  console.log("✅ โมเดลโหลดสำเร็จ");
}
init();

// 📷 เมื่อผู้ใช้เลือกภาพ
imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

// 🧠 เมื่อกดปุ่ม "วิเคราะห์ภาพ"
predictBtn.addEventListener('click', async () => {
  if (!model) {
    alert("ยังโหลดโมเดลไม่เสร็จ กรุณารอสักครู่...");
    return;
  }
  if (!preview.src) {
    alert("กรุณาเลือกรูปภาพก่อน!");
    return;
  }

  // วิเคราะห์ภาพ
  const prediction = await model.predict(preview);

  // ล้าง progress bar เดิม
  progressBarsDiv.innerHTML = '';

  // หาคลาสที่มั่นใจที่สุด
  let top = prediction[0];
  for (let p of prediction) {
    if (p.probability > top.probability) top = p;
  }

  // แสดงผลลัพธ์
  resultDiv.textContent = `ผลการวิเคราะห์: ${top.className}`;

  // สร้าง progress bar สำหรับแต่ละคลาส
  prediction.forEach(p => {
    const container = document.createElement('div');
    container.classList.add('progress-container');

    const label = document.createElement('span');
    label.classList.add('progress-label');
    label.textContent = `${p.className} (${(p.probability * 100).toFixed(1)}%)`;

    const bar = document.createElement('div');
    bar.classList.add('progress-bar');
    bar.style.width = `${p.probability * 100}%`;

    container.appendChild(label);
    container.appendChild(bar);
    progressBarsDiv.appendChild(container);
  });
});
