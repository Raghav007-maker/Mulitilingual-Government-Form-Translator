# 🛡️ FormSetu V2.0 — Multilingual Government Form Studio

FormSetu is a premium, high-fidelity, and secure dark-mode web application for extracting, translating, and downloading government forms and official documents side-by-side. 

FormSetu features a stateless architecture leveraging **Gemini 2.5 Flash** for layout-preserving multimodal OCR and field extraction, paired with **Gemini 2.5 Flash dynamic translation mapping** and a robust **pdfkit Unicode compiler** to produce clean, regional-compliant translated outputs.

---

## 🎨 Design System

FormSetu utilizes a cutting-edge visual aesthetic designed to impress:
- **Core Theme:** Deep Space Navy background (`#030712`) overlayed with a custom `40px` square mesh grid.
- **Accents:** Cybernetic Neon Cyan (`#00f2ff`) primary color and deep space Purple (`#7000ff`) glow shadows.
- **Typography:** Bold headings styled in **Cabinet Grotesk** (Tight tracking, 900 weight) paired with geometric **Satoshi** body text.
- **Glassmorphism:** Navigation menus, workspace cards, and auth portals feature translucent panels (`rgba(255,255,255,0.03)` background, `backdrop-filter: blur(12px)`, and thin `rgba(255,255,255,0.1)` boundaries).
- **Animations:** Subtle scanning lines, glow transitions, and responsive micro-interactions.

---

## ⚙️ Core Architecture (Side-by-Side Studio)

FormSetu is built on a clean, honest, and highly robust document workflow:

1. **Secure Ingestion & Routing**: Scanned JPG, PNG, or PDF files are validated through Multer buffers.
2. **Dynamic OCR Decision Tree**:
   - **Digital PDFs**: Extracted using a high-efficiency digital text-layer scraper (`pdf-parse`) to optimize speeds.
   - **Scanned PDFs or Images**: Handled using **Gemini 2.5 Flash** to extract complex form field labels, headings, and fillable fields in reading order.
3. **Structured Field Preserver**: The Gemini prompt is explicitly tuned to maintain blank lines, underline markers, and fillable inputs using underscores (e.g. `प्रथम नाम :  _______ मध्य नाम : ________`).
4. **Dynamic Target Language Mapping**: Automatically maps frontend target language selections (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, and Urdu) into the Gemini Translation Engine, translating original documents layout-safely into the chosen Indic regional script.
5. **High-Fidelity PDF Kit Compiler**: Exports clean translated text into Unicode-compliant PDFs with Arial/Mangal fallbacks to guarantee Indic regional characters render without squares or rectangles.
6. **Zero-Storage Security Policy**: All uploaded buffers and temp files are forcefully scrubbed from server memory and disk (`fs.unlinkSync`) immediately upon success, completion, or error states.

---

## 🛡️ Secure Authentication Guard
* **Local Session Registry**: Agent sign-up profiles, passphrases, and secure sessions are tracked dynamically via local storage. 
* **State Safeguard**: Bypasses complex databases while fully enforcing credential-based access controls, complete with password match verification and duplicate register locks.

---

## 🚀 Quick Start

### 📋 Prerequisites
- **Node.js** v18+
- **pnpm** or **npm** installed

### 🛠️ Configuration
Create or update the `.env` file in the **`Backend`** folder:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
TEMP_FILE_DIR=temp_uploads
```

### 💻 Development Setup

1. **Start the Backend Engine**:
   ```bash
   cd Backend
   npm install
   npm run dev
   ```
   * Running at: `http://localhost:3001/`

2. **Start the Frontend Studio**:
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```
   * Running at: `http://localhost:5173/`

---

## 📂 Project Structure

```
├── Backend/                 # Express Node.js Backend Server
│   ├── src/
│   │   ├── config/         # Environment standard validation & Env Loading
│   │   ├── middleware/     # Rate limiter, Error handler & Zod validator
│   │   ├── services/       # OCR & Dynamic Translation Engines (Gemini & System PDF compiler)
│   │   ├── controllers/    # Upload controller & translate API handler
│   │   └── server.ts       # Server bootloader
│   ├── .env                # Private keys config (Excluded from git)
│   └── package.json
│
├── Frontend/               # React Vite Frontend Client
│   ├── client/
│   │   ├── components/     # Document & Translation side-by-side viewers
│   │   ├── pages/          # Unified landing, auth, upload & studio pages
│   │   ├── hooks/          # useTranslation core state-machine
│   │   └── App.tsx         # Routing entry point
│   └── package.json
│
└── .gitignore               # Multi-folder exclusion rule sheet
```

---

## ⚡ API Endpoints

### 📤 Upload & OCR Document
- **URL**: `POST /api/upload`
- **Body**: `multipart/form-data` with `file` field containing the image or PDF.
- **Response**:
```json
{
  "success": true,
  "jobId": "f7d75efc-974a-4e20-bf18-fe730ffc8112",
  "originalText": "Extracted regional text here..."
}
```

### 🌐 Translate Document
- **URL**: `POST /api/translate`
- **Body**: `application/json`
```json
{
  "text": "Extracted regional text here...",
  "targetLang": "bn",
  "jobId": "f7d75efc-974a-4e20-bf18-fe730ffc8112"
}
```
- **Response**:
```json
{
  "success": true,
  "translatedText": "অনুবাদ করা টেক্সট এখানে...",
  "detectedLanguage": {
    "language": "auto",
    "confidence": 1
  },
  "provider": "gemini-translator"
}
```

### 📥 Download Compiled Unicode PDF
- **URL**: `GET /api/download/:jobId`
- **Response**: Raw file stream of compiled Unicode PDF.

### 🧹 Manual Storage Cleanup
- **URL**: `DELETE /api/cleanup/:jobId`
- **Response**: Status `200` indicating temporary buffers have been cleared from the memory registry.

---

*FormSetu — Produced for a secure, fast, and digitally accessible Multilingual India.* 🇮🇳