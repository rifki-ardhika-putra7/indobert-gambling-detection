# 🎰 IndoBERT Gambling Detection API

> **High-performance REST API for detecting online gambling content in Indonesian text using Fine-Tuned IndoBERT.**
> *Final Year Thesis (Skripsi) Project.*

![Dashboard Preview](https://via.placeholder.com/800x400?text=Ganti+dengan+Screenshot+Dashboard+Lu)
*(Ganti link di atas dengan URL gambar screenshot Dashboard web lu)*

---

## ⚠️ IMPORTANT: Model Weights Required
Dikarenakan ukuran file model **IndoBERT Fine-Tuned** melebihi batas GitHub (>400MB), file tersebut **TIDAK DISERTAKAN** dalam repository ini.

Untuk menjalankan aplikasi, Anda wajib mengunduh model secara manual:

1.  **Download Model (`.safetensors` & Configs):**
    👉 **[MASUKKAN LINK GOOGLE DRIVE / HUGGINGFACE LU DI SINI]**
2.  Buat folder baru bernama `model_skripsi_siap_download` di root direktori.
3.  Masukkan semua file hasil download ke dalam folder tersebut.

---

## 🚀 Overview
Proyek ini dikembangkan sebagai solusi teknis untuk memberantas penyebaran konten promosi judi online yang marak di media sosial Indonesia.

Sistem ini menggunakan **IndoBERT (Indonesian BERT)**, sebuah model *Language Model* berbasis Transformer yang telah di-*fine-tune* dengan dataset ribuan komentar spam judi online. Hasilnya adalah sistem klasifikasi teks yang mampu membedakan antara kalimat wajar dan promosi judi dengan akurasi tinggi.

Aplikasi ini dibungkus menjadi **REST API** dengan antarmuka Web (Dashboard) untuk mempermudah penggunaan oleh pihak berwenang atau moderator platform.

## ✨ Key Features

### 🧠 1. AI Core Intelligence
* **IndoBERT Fine-Tuning:** Menggunakan *Pre-trained Model* terbaik untuk Bahasa Indonesia.
* **Contextual Understanding:** Mampu memahami konteks kalimat (bukan sekadar pencocokan kata kunci/keyword).

### 💻 2. Functional Modules
* **Real-time Prediction:** API endpoint untuk klasifikasi teks tunggal (< 100ms).
* **Bulk Analysis (CSV):** Fitur upload file CSV untuk memproses ribuan data sekaligus.
* **Visual Dashboard:** Menampilkan statistik deteksi, grafik persentase (Pie Chart), dan sebaran kata kunci (Word Cloud).
* **Reporting:** Ekspor hasil analisis ke dalam format CSV/Excel.

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Deep Learning** | Python, PyTorch, HuggingFace Transformers |
| **Model Architecture** | IndoBERT-Base-Uncased |
| **Backend API** | Flask (Python) |
| **Data Processing** | Pandas, NumPy |
| **Frontend** | HTML5, CSS3, Chart.js (Dashboard) |

## 📦 Installation & Setup

Ikuti langkah ini untuk menjalankan sistem di komputer lokal (Localhost).

### 1. Clone Repository
```bash
git clone [https://github.com/rifki-ardhika-putra7/indobert-gambling-detection.git](https://github.com/rifki-ardhika-putra7/indobert-gambling-detection.git)
cd indobert-gambling-detection
