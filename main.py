import uvicorn
from fastapi import FastAPI, Request, Form, UploadFile, File
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn.functional as F
from transformers import BertTokenizer, BertForSequenceClassification
import pandas as pd
import io
import base64
from wordcloud import WordCloud
import time

app = FastAPI()

# 1. SETUP CORS (Biar browser gak error connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

# 2. LOAD MODEL (Hanya sekali saat start)
MODEL_PATH = "./model_skripsi_siap_download"
print("⏳ Sedang memuat Model IndoBERT...")
try:
    tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
    model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
    model.eval()
    print("✅ Model Berhasil Dimuat!")
except Exception as e:
    print(f"❌ ERROR FATAL: Gagal load model di '{MODEL_PATH}'")
    print(f"Pesan Error: {e}")

# 3. LOGIC PREDIKSI (DENGAN FILTER "MAIN")
def get_prediction(text):
    # A. Prediksi AI Murni
    inputs = tokenizer(str(text), return_tensors="pt", truncation=True, padding=True, max_length=64)
    with torch.no_grad():
        outputs = model(**inputs)
    probs = F.softmax(outputs.logits, dim=1)
    confidence, predicted_class = torch.max(probs, dim=1)
    
    label_id = predicted_class.item()
    score = confidence.item() * 100
    
    # B. LOGIC FILTER (SATPAM TAMBAHAN)
    # Mencegah kata netral seperti "Main bola" dianggap judi
    text_lower = str(text).lower()
    
    # Keyword "Judi Keras" (Wajib ada salah satu kalau mau divonis judi)
    keywords_judi_keras = [
        'slot', 'gacor', 'zeus', 'depo', 'wd', 'withdraw', 'maxwin', 
        'scatter', 'pragmatic', 'togel', 'rtp', 'link di bio', 'bocoran',
        'pola', 'olympus', 'mahjong', 'bet', 'rollingan', 'bonus new member',
        'garansi kekalahan', 'situs resmi', 'petir merah', 'x500'
    ]
    
    # Jika AI bilang JUDI (1), tapi tidak ada keyword keras...
    if label_id == 1:
        contains_judi_keyword = any(word in text_lower for word in keywords_judi_keras)
        
        if not contains_judi_keyword:
            # Batalkan keputusan AI, ubah jadi Aman
            label_id = 0 
            score = 99.0 # Paksa yakin aman
    
    label = "JUDI ONLINE 🚨" if label_id == 1 else "AMAN ✅"
    return label, score, label_id

# 4. ROUTE / ENDPOINT API

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/predict-single")
async def predict_single(text: str = Form(...)):
    label, score, _ = get_prediction(text)
    return {"label": label, "score": f"{score:.2f}%"}

@app.post("/api/predict-batch")
async def predict_batch(file: UploadFile = File(...)):
    start_time = time.time()
    
    # Baca File
    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except:
        return {"error": "Format file salah. Harus CSV."}
    
    # Cari Kolom Teks
    col_name = None
    for c in df.columns:
        if c.lower() in ['text', 'text_clean', 'caption', 'content', 'komentar', 'tweet']:
            col_name = c
            break
    
    if not col_name:
        return {"error": "Tidak ditemukan kolom teks (namai kolomnya: 'text' atau 'caption')"}

    # Proses Loop
    results = []
    judol_texts = []
    total_judol = 0
    total_aman = 0
    
    # Ambil semua teks
    all_texts = df[col_name].astype(str).tolist()

    # Proses per baris
    for txt in all_texts:
        label, score, label_id = get_prediction(txt)
        
        results.append({
            "text": txt,
            "label": label,
            "score": f"{score:.2f}%"
        })
        
        if label_id == 1:
            total_judol += 1
            judol_texts.append(txt)
        else:
            total_aman += 1

    # Generate Word Cloud
    wc_image = None
    if judol_texts:
        try:
            text_gabungan = " ".join(judol_texts)
            # Pastikan font path benar atau default
            wc = WordCloud(width=800, height=400, background_color='white', colormap='Reds').generate(text_gabungan)
            img = io.BytesIO()
            wc.to_image().save(img, format='PNG')
            img.seek(0)
            wc_image = base64.b64encode(img.getvalue()).decode()
        except Exception as e:
            print(f"Gagal WC: {e}")

    return {
        "data": results,
        "stats": {
            "total": len(results),
            "judol": total_judol,
            "aman": total_aman
        },
        "wordcloud": wc_image
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)