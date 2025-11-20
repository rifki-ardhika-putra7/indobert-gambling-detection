// Dijalankan pas pop-up kebuka
document.addEventListener("DOMContentLoaded", () => {
  // Ambil semua elemen di popup.html
  const resultCard = document.getElementById("resultCard");
  const resultLabel = document.getElementById("resultLabel");
  const resultScore = document.getElementById("resultScore");
  const progressBar = document.getElementById("progressBar");
  const stickerArea = document.getElementById("stickerArea");

  // Ambil data hasil analisis dari 'storage'
  chrome.storage.local.get("analysisResult", (data) => {
    if (data.analysisResult) {
      const result = data.analysisResult;

      const keyakinan = result.keyakinan * 100;
      resultScore.innerText = `Keyakinan: ${keyakinan.toFixed(2)}%`;

      let stickerPath = "";
      let labelText = "";

      // Cek statusnya (Sama kayak app.js)
      if (result.status === "Terindikasi Judi") {
        resultCard.classList.add("judi");
        labelText = "TERINDIKASI JUDI";
        stickerPath = "./assets/stop_judi.png";
      } else {
        resultCard.classList.add("aman");
        labelText = "AMAN";
        stickerPath = "./assets/aman.png";
      }

      resultLabel.innerText = labelText;

      // Set stiker dan progress bar
      stickerArea.innerHTML = `<img src="${stickerPath}" alt="${labelText} Sticker">`;
      // Set 'setTimeout' biar animasi progress bar-nya jalan
      setTimeout(() => {
        progressBar.style.width = `${keyakinan}%`;
      }, 100); // Kasih jeda 100ms

      // (PENTING) Hapus data dari storage setelah ditampilkan
      chrome.storage.local.remove("analysisResult");
    } else {
      // Kalo ada error
      resultLabel.innerText = "ERROR";
      resultScore.innerText = "Data hasil tidak ditemukan.";
    }
  });
});
