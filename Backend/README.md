# Multilingual Form Translator Backend

Backend API for the Multilingual Government Form Translator application.

## Features

- **Text Translation**: Translate text between multiple languages using Google Translate API (FREE)
- **Language Detection**: Automatically detect the language of input text
- **Supported Languages**: Get list of supported languages
- **No API Key Required**: Completely free translation service
- **CORS Support**: Configured for frontend integration

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Translation
- `POST /api/translate` - Translate text
- `POST /api/detect` - Detect language of text
- `GET /api/languages` - Get supported languages

## Environment Variables

Create a `.env` file in the backend directory (optional):

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Note**: No API key required! The service uses Google Translate's free public API.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Usage

### Translate Text
```bash
curl -X POST http://localhost:3001/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "q": "Hello world",
    "target": "hi",
    "source": "auto"
  }'
```

### Detect Language
```bash
curl -X POST http://localhost:3001/api/detect \
  -H "Content-Type: application/json" \
  -d '{
    "q": "नमस्ते दुनिया"
  }'
```

### Get Supported Languages
```bash
curl http://localhost:3001/api/languages
```
