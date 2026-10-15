# HeritageLens AI — India Cultural Monument Identification & Storytelling

**HeritageLens AI** is an AI-powered cultural companion that instantly identifies historical monuments from live camera captures or uploaded photos, delivering verified historical dossiers, bilingual audio narration (English and हिन्दी), architectural breakdowns, practical visitor tips, and interactive nearby cultural exploration across Indian heritage landmarks.

---

## Table of Contents
1. [Overview & Features](#overview--features)
2. [Supported Pilot Sites](#supported-pilot-sites)
3. [Quickstart & Local Setup](#quickstart--local-setup)
4. [NPM Scripts & Production Build](#npm-scripts--production-build)
5. [AI Vision API Setup](#ai-vision-api-setup)
6. [Offline Demo Mode](#offline-demo-mode)
7. [Camera Requirements & Permissions](#camera-requirements--permissions)
8. [Security & LocalStorage Details](#security--localstorage-details)
9. [OpenStreetMap & Content Attribution](#openstreetmap--content-attribution)
10. [Single Page Application (SPA) Direct Route Refreshes](#single-page-application-spa-direct-route-refreshes)
11. [Deployment Guide (Frontend & Backend)](#deployment-guide-frontend--backend)

---

## 1. Overview & Features

- **Vision-Based Identification**: Analyzes architectural geometries (arches, domes, minarets, stepwell carvings) using Multimodal AI Neural Vision.
- **Dual Language Audio Guides**: Web Speech API integration with native English and हिन्दी (`hi-IN`) synthesis, synchronized read-along transcripts, and audio playback controls.
- **Cultural Explorer**: Interactive OpenStreetMap maps and curated recommendations for street food, artisan bazaars, and nearby monuments within walking distance.
- **Visitor Practicalities**: Timings, metro stations, entry fees, photography rules, and peak crowd tips compiled from ASI (Archaeological Survey of India) and UNESCO World Heritage records.
- **Quality & Accessibility**: Mobile-first responsive layout (≥44px touch targets), WCAG AA color contrast, reduced-motion compatibility, and zero personal data tracking.

---

## 2. Supported Pilot Sites

HeritageLens AI is pre-calibrated with deep historical records and structural validation for landmark heritage sites across Indian states:

| Monument | Hindi Name | Category | Architectural Style | Built Era / Century |
| :--- | :--- | :--- | :--- | :--- |
| **Red Fort** | लाल किला | Mughal Fort | Indo-Islamic Mughal (Red Sandstone) | 1648 CE (Shah Jahan) |
| **Humayun's Tomb** | हुमायूँ का मकबरा | Mughal Tomb | Charbagh Mughal Garden Tomb | 1572 CE (Empress Bega Begum) |
| **Qutub Minar** | कुतुब मीनार | Minaret / Complex | Indo-Islamic Fluted Minaret | 1192–1220 CE (Qutb-ud-din Aibak) |
| **Lotus Temple** | कमल मंदिर | Bahá'í Temple | Modern Organic Expressionism | 1986 CE (Fariborz Sahba) |
| **India Gate** | इंडिया गेट | War Memorial | Beaux-Arts Triumphal Arch | 1931 CE (Sir Edwin Lutyens) |
| **Gurudwara Bangla Sahib** | गुरुद्वारा बंगला साहिब | Sikh Gurudwara | Sikh Architectural Style with Golden Dome | 1783 CE (Sardar Baghel Singh) |
| **Gurudwara Sis Ganj Sahib** | गुरुद्वारा सीस गंज साहिब | Sikh Gurudwara | Classical Sikh Heritage Gurudwara | 1783 CE (Sardar Baghel Singh) |
| **Jama Masjid** | जामा मस्जिद | Historic Mosque | Imperial Mughal Sandstone & Marble | 1656 CE (Shah Jahan) |
| **Purana Qila** | पुराना किला | Ancient Fort | Mughal-Sur Stone Masonry Fort | 16th Century (Humayun & Sher Shah) |
| **Agrasen ki Baoli** | अग्रसेन की बावली | Historic Stepwell | Medieval Terraced Stepwell (Baoli) | 14th Century (Rebuilt) |

---

## 3. Quickstart & Local Setup

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-org/heritagelens-ai.git
cd heritagelens-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for local dev)
cp .env.example .env

# 4. Launch local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. NPM Scripts & Production Build

The project includes standard scripts for development, linting, building, and static preview:

```json
{
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --port=3000 --host=0.0.0.0",
    "lint": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
```

### Creating a Production Build
Run:
```bash
npm run build
```
This runs TypeScript type checking (`tsc`) and compiles all frontend assets into an optimized, tree-shaken static bundle in the `dist/` directory.

---

## 5. AI Vision API Setup

HeritageLens AI supports both live AI vision recognition and built-in offline verified catalog mode.

### Configuring Access:
1. Navigate to the **Profile & Engine Settings** page (`/profile`).
2. Enter your API key into the input field.
3. Click **"Test Connection"** to verify connectivity with the AI Vision endpoint.
4. Click **"Save Key"** to activate live identification.

---

## 6. Offline Demo Mode

**No external API key is required to explore HeritageLens AI!**

- When no custom key is provided, the application automatically runs in **Verified Mode**.
- Users can click sample images on the home page or select any of the supported monuments across Indian states.
- Verified mode provides deterministic, official ASI & UNESCO historical records, complete architectural breakdowns, and audio guides without making external network calls.

---

## 7. Camera Requirements & Permissions

Web camera access uses the standard browser `navigator.mediaDevices.getUserMedia` API.

### Browser Security Requirements:
1. **Secure Origin Required**: Browsers strictly restrict camera access to **`localhost`** or **HTTPS** origins. If served over plain `http://` on an external IP, the browser will disable camera APIs.
2. **User Permission**: When clicking **"Take Live Photo"**, the user must grant camera permission.
3. **Graceful Fallbacks**: If camera permission is denied or no camera hardware is detected, the app displays a clear diagnostic card with direct fallback to file drag-and-drop / file selector.

---

## 8. Security & LocalStorage Details

### Security Architecture
In this environment, access keys are stored securely:

- **Masked Display**: Keys are masked in the UI (`••••••••••••xxxx`) with an eye toggle for privacy.
- **Zero Logging**: Error handlers sanitize error messages before rendering.
- **One-Click Removal**: Clicking **"Remove Key"** instantly deletes the key from local storage.
- **Zero Telemetry**: No third-party trackers, analytics pixels, or cookies are loaded.

### Production Backend Recommendation
All live requests are routed through the secure server-side proxy (`/api/identify` and `/api/generate-site`) with secrets protected on the backend:
- Protected Express / Cloud Run endpoints (`POST /api/identify`, `POST /api/generate-site`).
- Store platform API credentials securely in Cloud Secret Manager on the server.
- Implement server-side rate-limiting and origin CORS policies.

---

## 9. OpenStreetMap & Content Attribution

- **Map Tiles**: Map data is provided by [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors under the Open Database License (ODbL).
- **Map Rendering**: Rendered using [Leaflet.js](https://leafletjs.com/).
- **Historical Content**: Facts and dossiers are curated from the [Archaeological Survey of India (ASI)](https://asi.nic.in/) and [UNESCO World Heritage Centre](https://whc.unesco.org/).

---

## 10. Single Page Application (SPA) Direct Route Refreshes

Because HeritageLens AI uses `react-router-dom` with HTML5 History Mode (`BrowserRouter`), web servers must route all deep paths (e.g. `/explore`, `/result`, `/profile`) to `/index.html`.

### Configuration by Web Server / Host:

#### Nginx (`/etc/nginx/conf.d/default.conf`):
```nginx
server {
    listen 3000;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Vercel (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Netlify (`_redirects` in `public/`):
```
/*    /index.html   200
```

#### Node.js / Express:
```typescript
import express from 'express';
import path from 'path';

const app = express();
const distPath = path.join(process.cwd(), 'dist');

app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(3000, '0.0.0.0');
```

---

## 11. Deployment Guide (Frontend & Backend)

### Option A: Static Frontend Deployment (Vercel / Netlify / Cloudflare Pages)

1. Push your code to GitHub.
2. Connect your repository to **Vercel** or **Netlify**.
3. Configure Build Settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set SPA rewrite rules as shown in Section 10.

---

### Option B: Containerized Full-Stack Deployment (Google Cloud Run / Docker)

#### Dockerfile:
```dockerfile
# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

#### Deploy to Google Cloud Run:
```bash
# 1. Build and push container image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/heritagelens-ai

# 2. Deploy to Cloud Run on Port 3000
gcloud run deploy heritagelens-ai \
  --image gcr.io/YOUR_PROJECT_ID/heritagelens-ai \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 3000
```

---

## License & Heritage Stewardship
Developed for cultural education and preservation awareness. Historical monument names and imagery belong to their respective cultural domains and the Archaeological Survey of India.
