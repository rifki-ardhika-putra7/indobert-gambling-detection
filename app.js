document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("textInput");
  const cekButton = document.getElementById("cekButton");
  const statusDiv = document.getElementById("status");
  const resultCard = document.getElementById("resultCard");
  const resultLabel = document.getElementById("resultLabel");
  const resultScore = document.getElementById("resultScore");
  const progressBar = document.getElementById("progressBar");
  const stickerArea = document.getElementById("stickerArea");

  const API_URL = "http://127.0.0.1:8000/klasifikasi";

  cekButton.addEventListener("click", () => {
    const text = textInput.value;

    // Reset tampilan
    statusDiv.innerText = "";
    resultCard.style.display = "none";
    resultCard.classList.remove("show", "judi", "aman");
    progressBar.style.width = "0%";
    stickerArea.innerHTML = "";

    if (!text.trim()) {
      statusDiv.innerText = "Teks tidak boleh kosong!";
      return;
    }

    statusDiv.innerText = "Menganalisis... Mohon tunggu...";
    cekButton.disabled = true;

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        statusDiv.innerText = "";
        resultCard.style.display = "block"; // Tampilkan kartu hasil
        setTimeout(() => resultCard.classList.add("show"), 50); // Animasi fade-in

        const keyakinan = data.keyakinan * 100; // Ambil skor sebagai persentase
        resultScore.innerText = `Keyakinan: ${keyakinan.toFixed(2)}%`;

        let stickerPath = "";
        let labelText = "";

        if (data.status === "Terindikasi Judi") {
          resultCard.classList.add("judi");
          labelText = "TERINDIKASI JUDI";
          stickerPath = "./assets/stop_judi.png"; // Path ke stiker Stop Judi
        } else {
          resultCard.classList.add("aman");
          labelText = "AMAN";
          stickerPath = "./assets/aman.png"; // Path ke stiker Aman
        }

        resultLabel.innerText = labelText;

        // Set lebar progress bar dan stiker
        progressBar.style.width = `${keyakinan}%`;
        stickerArea.innerHTML = `<img src="${stickerPath}" alt="${labelText} Sticker">`;
      })
      .catch((error) => {
        console.error("Error:", error);
        statusDiv.innerText =
          "Error: Gagal terhubung ke API. Pastikan API sudah jalan.";
        resultCard.style.display = "none";
      })
      .finally(() => {
        cekButton.disabled = false;
      });
  });
});
