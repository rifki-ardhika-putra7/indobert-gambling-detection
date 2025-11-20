const API_URL = "http://127.0.0.1:8000/klasifikasi";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "cekJudi",
    title: "Cek Indikasi Judi",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "cekJudi" && info.selectionText) {
    const teksYangDiHighlight = info.selectionText;

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: teksYangDiHighlight }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`Respon API bermasalah. Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        // 1. Simpan data hasilnya ke 'storage'
        chrome.storage.local.set({ analysisResult: data }, () => {
          // 2. Setelah data disimpan, BUKA JENDELA POP-UP
          bukaJendelaHasil();
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        // Kalo error, simpan data error-nya
        const dataError = { status: "Error", keyakinan: 0 };
        chrome.storage.local.set({ analysisResult: dataError }, () => {
          bukaJendelaHasil();
        });
      });
  }
});

// Fungsi baru buat buka jendela pop-up
function bukaJendelaHasil() {
  chrome.windows.create({
    url: "popup.html", // File HTML yang mau dibuka
    type: "popup", // Tipe jendela (tanpa address bar, dll)
    width: 450, // Lebar pop-up
    height: 500, // Tinggi pop-up
  });
}
