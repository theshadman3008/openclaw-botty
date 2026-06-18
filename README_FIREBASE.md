# Ross AI Dashboard - Firebase Edition

## 🏗️ Architettura

Dashboard moderna con **autenticazione Firebase** e **database Firestore** in tempo reale.

```
┌─────────────────────────────────────────┐
│         GitHub Pages (Frontend)         │
│  - login.html (Auth UI)                 │
│  - index.html (Dashboard)               │
│  - app.js (Firebase Client)             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Firebase (Google Cloud)            │
│  - Authentication (Email/Password)      │
│  - Firestore Database (NoSQL)           │
│  - Storage (PDF, immagini)              │
└─────────────────────────────────────────┘
```

## 📁 File Progetto

| File | Descrizione |
|------|-------------|
| `login.html` | Pagina di login con Firebase Auth |
| `index.html` | Dashboard principale (protetta) |
| `firebase-config.js` | Configurazione Firebase (DA COMPILARE) |

## 🔥 Setup Firebase (Step-by-Step)

### 1. Crea Progetto Firebase

1. Vai su [console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"**
3. Nome: `ross-ai-dashboard`
4. Abilita Google Analytics (opzionale)
5. Click **"Create Project"**

### 2. Abilita Authentication

1. Sidebar: **Build** → **Authentication**
2. Click **"Get Started"**
3. Tab **"Sign-in method"**
4. Click **"Email/Password"** → Enable → **Save**

### 3. Crea Utente Admin

1. Sidebar: **Authentication** → **Users**
2. Click **"Add User"**
3. Email: `tua@email.com`
4. Password: `tua_password_sicura`
5. Click **"Add User"**

### 4. Crea Database Firestore

1. Sidebar: **Build** → **Firestore Database**
2. Click **"Create Database"**
3. Scegli **"Start in Test Mode"** (poi aggiorniamo le rules)
4. Location: **europe-west1** (Belgium) o **europe-west3** (Frankfurt)
5. Click **"Enable"**

### 5. Registra App Web

1. Project Overview → Click icona **Web** (`</>`)
2. App nickname: `Ross Dashboard`
3. ✅ **NON** spuntare "Also set up Firebase Hosting"
4. Click **"Register App"**
5. **Copia le credenziali** (`firebaseConfig`)

### 6. Aggiorna `firebase-config.js`

Sostituisci i valori placeholder:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // ← Incolla qui
    authDomain: "ross-ai-dashboard.firebaseapp.com",
    projectId: "ross-ai-dashboard",
    storageBucket: "ross-ai-dashboard.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
```

### 7. Aggiorna Security Rules

#### Firestore Rules (`firestore.rules`):

Vai su **Firestore Database** → **Rules** → Incolla:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email == 'tua@email.com';
    }
  }
}
```

Click **"Publish"**.

#### Storage Rules (se usi Storage):

Vai su **Storage** → **Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.email == 'tua@email.com';
    }
  }
}
```

## 🚀 Deploy su GitHub Pages

### 1. Inizializza Repository

```bash
cd /workspace/media
git init
git add .
git commit -m "Initial commit - Firebase dashboard"
git branch -M main
git remote add origin https://github.com/theshadman3008/openclaw-botty.git
git push -u origin main
```

### 2. Abilita GitHub Pages

1. Vai su: `https://github.com/theshadman3008/openclaw-botty/settings/pages`
2. **Source**: Deploy from a branch
3. **Branch**: main / folder: **/** (root)
4. Click **Save**
5. URL: `https://theshadman3008.github.io/openclaw-botty/`

### 3. Testa Login

1. Apri: `https://theshadman3008.github.io/openclaw-botty/login.html`
2. Login con email/password creati in Firebase
3. Dovresti essere redirectizzato a `index.html`

## 📊 Struttura Database Firestore

### Collection: `conversazioni`

```javascript
{
  id: "conv_20260618_001",
  timestamp: Timestamp(2026-06-18 08:30:00),
  topic: "Rassegna Stampa Tecnologica",
  snippet: "Ho trovato 5 notizie verificate...",
  telegramLink: "https://web.telegram.org/k/#@TestHeyrossbot",
  categoria: "news",
  tags: ["rassegna", "AI", "cybersecurity"]
}
```

### Collection: `rassegna`

```javascript
{
  id: "2026-06-18",
  data: "2026-06-18",
  notizie: [
    {
      titolo: "Microsoft 365 Copilot vulnerabilità",
      categoria: "Cybersecurity",
      source: "Cyber Security 360",
      summary: "Varonis rivela SearchLeak...",
      url: "https://...",
      impactScore: 9
    }
  ],
  pdfUrl: "https://raw.githubusercontent.com/.../Rassegna_Tech.pdf",
  publishedAt: Timestamp(2026-06-18 08:15:00),
  avgImpact: 7.8
}
```

### Collection: `documenti`

```javascript
{
  id: "doc_001",
  titolo: "Fastweb AI Strategy",
  tipo: "pdf",
  uploadDate: Timestamp(2026-06-15),
  firebaseUrl: "gs://ross-ai-dashboard.appspot.com/docs/fastweb_ai.pdf",
  githubUrl: "https://raw.githubusercontent.com/.../docs/fastweb_ai.pdf",
  categoria: "strategy"
}
```

## 🛠️ Script Python per Update Dashboard

Crea `/workspace/update_firebase_dashboard.py`:

```python
import requests
from datetime import datetime
import json

# Configurazione
FIREBASE_CONFIG = {
    "apiKey": "YOUR_API_KEY",
    "projectId": "ross-ai-dashboard"
}

# ID Token (ottienilo da Firebase Console o auth flow)
ID_TOKEN = "YOUR_FIREBASE_ID_TOKEN"

def add_conversazione(topic, snippet, categoria, tags, telegram_link):
    """Aggiunge conversazione a Firestore"""
    url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_CONFIG['projectId']}/databases/(default)/documents/conversazioni"
    
    headers = {
        "Authorization": f"Bearer {ID_TOKEN}",
        "Content-Type": "application/json"
    }
    
    doc = {
        "fields": {
            "topic": {"stringValue": topic},
            "snippet": {"stringValue": snippet},
            "categoria": {"stringValue": categoria},
            "tags": {"arrayValue": {"values": [{"stringValue": t} for t in tags]}},
            "telegramLink": {"stringValue": telegram_link},
            "timestamp": {"timestampValue": datetime.now().isoformat() + "Z"}
        }
    }
    
    response = requests.post(url, json=doc, headers=headers)
    return response.status_code == 200

def add_rassegna(data, notizie, pdf_url, avg_impact):
    """Aggiunge rassegna stampa a Firestore"""
    url = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_CONFIG['projectId']}/databases/(default)/documents/rassegna"
    
    headers = {
        "Authorization": f"Bearer {ID_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Converti notizie in formato Firestore
    notizie_fields = []
    for n in notizie:
        notizia = {
            "mapValue": {
                "fields": {
                    "titolo": {"stringValue": n.get('titolo', '')},
                    "categoria": {"stringValue": n.get('categoria', '')},
                    "source": {"stringValue": n.get('source', '')},
                    "summary": {"stringValue": n.get('summary', '')},
                    "url": {"stringValue": n.get('url', '')},
                    "impactScore": {"integerValue": n.get('impactScore', 5)}
                }
            }
        }
        notizie_fields.append(notizia)
    
    doc = {
        "fields": {
            "id": {"stringValue": data},
            "data": {"stringValue": data},
            "notizie": {"arrayValue": {"values": notizie_fields}},
            "pdfUrl": {"stringValue": pdf_url},
            "avgImpact": {"doubleValue": avg_impact},
            "publishedAt": {"timestampValue": datetime.now().isoformat() + "Z"}
        }
    }
    
    response = requests.post(url, json=doc, headers=headers)
    return response.status_code == 200

# Esempio usage
if __name__ == "__main__":
    # Aggiungi conversazione
    add_conversazione(
        topic="Workshop Cisco ENPEC 2026",
        snippet="Ho creato 7 slide landscape per il workshop...",
        categoria="workshop",
        tags=["cisco", "workshop", "AI"],
        telegram_link="https://web.telegram.org/k/#@TestHeyrossbot"
    )
    
    # Aggiungi rassegna
    notizie = [
        {
            "titolo": "Microsoft 365 Copilot vulnerabilità",
            "categoria": "Cybersecurity",
            "source": "Cyber Security 360",
            "summary": "Varonis rivela SearchLeak...",
            "url": "https://...",
            "impactScore": 9
        }
    ]
    
    add_rassegna(
        data="2026-06-18",
        notizie=notizie,
        pdf_url="https://raw.githubusercontent.com/.../Rassegna_Tech.pdf",
        avg_impact=7.8
    )
    
    print("Dashboard aggiornata!")
```

## 🔐 Ottenere ID Token per Script Python

### Metodo 1: Firebase Admin SDK (Consigliato)

```bash
pip install firebase-admin
```

```python
import firebase_admin
from firebase_admin import credentials, auth

# Scarica service account da Firebase Console:
# Project Settings → Service Accounts → Generate New Private Key

cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Crea token
token = auth.create_custom_token('admin@ross-ai.com')
```

### Metodo 2: Login Manuale (Quick & Dirty)

1. Apri browser → Login su dashboard
2. Apri DevTools → Application → Local Storage
3. Copia token Firebase
4. Usalo nello script Python

## 📱 Funzionalità Dashboard

### Sezioni:

1. **💬 Conversazioni** — Ultime 10 conversazioni con snippet e tag
2. **📰 Rassegna Stampa** — Ultime 5 rassegne con link PDF
3. **📄 Documenti** — Lista documenti scaricabili
4. **⚡ Chat Rapida** — Link diretti a Telegram

### Real-time Updates:

La dashboard usa `onSnapshot()` di Firestore per aggiornamenti in tempo reale. Quando aggiorni il database via script Python, la dashboard si aggiorna automaticamente (entro pochi secondi).

## 🎨 Personalizzazione

### Cambiare Colori:

Modifica le variabili CSS in `index.html`:

```css
:root {
    --primary: #667eea;       /* Colore principale */
    --secondary: #764ba2;     /* Colore secondario */
    --accent: #00d4ff;        /* Accenti */
}
```

### Cambiare Logo:

Modifica `.logo-icon` in `index.html` e `login.html`:

```html
<span class="logo-icon">🤖</span>  <!-- Cambia emoji -->
```

## 🔒 Security Best Practices

1. **Mai committare `firebase-config.js` con chiavi reali** — Usa variabili d'ambiente
2. **Aggiorna Firestore Rules** — Non usare test mode in production
3. **Abilita App Check** — Previene abusi da client non autorizzati
4. **Monitora Usage** — Firebase Console → Usage → Vedi query, storage, bandwidth

## 📈 Monitoring

- **Firebase Console** → Usage → Query, storage, bandwidth
- **Firebase Console** → Authentication → Utenti attivi, login falliti
- **GitHub Insights** → Traffic → Viste pagina, cloni

## 🐛 Troubleshooting

### Errore: "Firebase not defined"
- Controlla che `firebase-config.js` sia caricato PRIMA di `index.html`

### Errore: "Permission denied"
- Verifica Firestore Rules in Firebase Console
- Assicurati che l'utente sia autenticato

### Dashboard non si aggiorna
- Controlla console browser (F12) per errori
- Verifica che i dati esistano in Firestore Console

## 🚀 Prossimi Step

1. ✅ Crea progetto Firebase
2. ✅ Copia credenziali in `firebase-config.js`
3. ✅ Crea utente admin
4. ✅ Deploy su GitHub
5. ✅ Testa login
6. ✅ Script Python per update automatico

---

**Dashboard URL:** `https://theshadman3008.github.io/openclaw-botty/login.html`

**Documentazione completa:** `/workspace/media/firebase_architecture.md`
