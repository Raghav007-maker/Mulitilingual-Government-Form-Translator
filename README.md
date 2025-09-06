# Multilingual Government Form Translator

A comprehensive web application for translating government forms and documents into multiple Indian regional languages. The application provides both form field translation and document translation capabilities with OCR support.

## Features

- **Form Translation**: Translate government form fields and labels into 12+ Indian languages
- **Document Translation**: Upload PDFs or text files and translate them with OCR support
- **Multi-language Support**: Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu
- **OCR Integration**: Automatic text extraction from scanned PDFs using Tesseract.js
- **Privacy-first**: All processing happens in the browser, no data stored on servers
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Translation**: LibreTranslate API with fallback services
- **OCR**: Tesseract.js for PDF text extraction

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mulitilingual-Government-Form-Translator
   ```

2. **Start both servers**
   
   **Windows:**
   ```bash
   start-dev.bat
   ```
   
   **Linux/Mac:**
   ```bash
   chmod +x start-dev.sh
   ./start-dev.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Manual Setup

1. **Backend Setup**
   ```bash
   cd Backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

## Configuration

### Backend Environment Variables

Create a `.env` file in the `Backend` directory:

```env
# Translation API Configuration
TRANSLATE_API_KEY=your_api_key_here
TRANSLATE_API_URL=https://libretranslate.de

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `Frontend` directory:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3001
```

## API Endpoints

### Backend API

- `GET /health` - Health check
- `POST /api/translate` - Translate text
- `POST /api/detect` - Detect language
- `GET /api/languages` - Get supported languages

### Example API Usage

```bash
# Translate text
curl -X POST http://localhost:3001/api/translate \
  -H "Content-Type: application/json" \
  -d '{"q": "Hello world", "target": "hi", "source": "auto"}'

# Detect language
curl -X POST http://localhost:3001/api/detect \
  -H "Content-Type: application/json" \
  -d '{"q": "नमस्ते दुनिया"}'
```

## Project Structure

```
├── Backend/                 # Backend API server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── README.md
├── Frontend/               # React frontend
│   ├── client/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities and config
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   └── README.md
├── start-dev.bat          # Windows startup script
├── start-dev.sh           # Unix startup script
└── README.md              # This file
```

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Router
- PDF.js
- Tesseract.js

### Backend
- Node.js
- Express
- TypeScript
- Zod (validation)
- CORS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.