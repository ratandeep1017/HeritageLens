# 🏛️ HeritageLens AI — Cultural Heritage Discovery & Intelligent Catalog Platform

**HeritageLens AI** is a full-stack, multimodal cultural companion and autonomous monument cataloging platform. It instantly identifies historical monuments from camera captures, photo uploads, or search queries, delivering ASI/UNESCO-verified historical dossiers, bilingual audio narration (English and हिन्दी), architectural analysis, live interactive Google Maps, and an autonomous state-wise catalog generation engine across India.

---

## 📑 Table of Contents

1. [System Architecture & Flow Diagram](#1-system-architecture--flow-diagram)
2. [Core Modules Directory & Project Structure](#2-core-modules-directory--project-structure)
3. [Database Architecture & Entity-Relationship (ER) Diagram](#3-database-architecture--entity-relationship-er-diagram)
4. [AI Pipeline & Autonomous State-Wise Catalog Engine](#4-ai-pipeline--autonomous-state-wise-catalog-engine)
5. [Google Maps Geolocation & 4-Tier Image Search Engine](#5-google-maps-geolocation--4-tier-image-search-engine)
6. [Admin Control Portal & Security Governance](#6-admin-control-portal--security-governance)
7. [Active Project Credentials & Environment Configuration](#7-active-project-credentials--environment-configuration)
8. [Step-by-Step Account Setup & API Key Generation Guide](#8-step-by-step-account-setup--api-key-generation-guide)
   - [A. Render Web Service Deployment](#a-render-web-service-deployment)
   - [B. TiDB Cloud Serverless MySQL](#b-tidb-cloud-serverless-mysql)
   - [C. Cloudinary Media CDN](#c-cloudinary-media-cdn)
   - [D. SerpAPI (Google Images Engine)](#d-serpapi-google-images-engine)
   - [E. Google AI Studio (Multimodal Vision Engine)](#e-google-ai-studio-multimodal-vision-engine)
   - [F. Google Cloud Platform (Maps & Places)](#f-google-cloud-platform-maps--places)
9. [Quickstart & Local Development](#9-quickstart--local-development)
10. [Deep-Dive Technical Guides (`description/` Directory)](#10-deep-dive-technical-guides-description-directory)
11. [Attributions & License](#11-attributions--license)

---

## 1. System Architecture & Flow Diagram

HeritageLens AI operates with a decoupled architecture supporting both cloud production infrastructure and zero-downtime offline failover.

```mermaid
graph TD
    User([🌍 Visitor / User]) <-->|HTTPS| Cloudflare[Cloudflare CDN / DNS]
    Cloudflare <-->|Reverse Proxy| SPA[React 19 + Vite Frontend SPA]
    
    subgraph "Frontend Client Layer (Browser)"
        SPA --> Router[React Router DOM]
        Router --> Home[HomePage.tsx - Hero, AI Scan & State Directory]
        Router --> Explore[ExplorePage.tsx - State Filters & Catalog Grid]
        Router --> Result[ResultPage.tsx - Monument Dossier & Media]
        Router --> Admin[ProfilePage.tsx - Passcode Gate & Admin Portal]
        
        Result --> MapComp[SiteLocationMap.tsx]
        Result --> AudioComp[AudioNarrationPlayer.tsx]
        Result --> NearbyComp[NearbyExplorerSection.tsx]
        Admin --> AdminMgr[HeritageSiteAdminManager.tsx]
        
        MapComp --> Leaflet[Leaflet.js + Google Tiles]
        MapComp --> GoogleEmbed[Google Maps 3D Embed Iframe]
        AudioComp --> WebSpeech[Web Speech Synthesis API]
    end

    subgraph "Backend API Layer (Node.js / Express)"
        SPA <-->|REST Endpoints /api/*| Express[server.js - Express Engine]
        Express --> Auth[Admin Passcode Gate /api/admin/*]
        Express --> SitesRoute[Catalog Manager /api/sites/*]
        Express --> GeocodeRoute[Live Geocoder /api/geocode]
        Express --> ImgSearch[Multi-Tier Image Engine /api/image-search]
        Express --> AI_Identify[Visual Recognition /api/identify]
        Express --> AI_Dossier[Autonomous Dossier Generator /api/generate-site]
    end

    subgraph "Persistent Storage & Cloud Services"
        SitesRoute <-->|SSL Connection Pool| TiDB[(TiDB Cloud Serverless MySQL)]
        SitesRoute -.->|Failover Sync| LocalJSON[(data/heritage_sites_db.json)]
        ImgSearch --> SerpAPI[SerpAPI - Google Images Search]
        ImgSearch --> GPlaces[Google Places New & Legacy API]
        ImgSearch --> WikiCommons[Wikimedia Commons API]
        ImgSearch --> Cloudinary[(Cloudinary Media CDN)]
        GeocodeRoute --> Nominatim[OpenStreetMap Nominatim]
        GeocodeRoute --> WikiGeo[Wikipedia Geosearch API]
        AI_Identify & AI_Dossier --> GeminiEngine[Multimodal AI Vision & LLM]
    end
```

---

## 2. Core Modules Directory & Project Structure

```
HeritageLens/
├── data/                               # Persistent Storage & Failover Backups
│   ├── heritage_sites_seed.json        # Permanent baseline monuments dataset
│   └── heritage_sites_db.json          # Live dynamic file backup when DB is offline
├── description/                        # Modular Deep-Dive Technical Documentation
│   ├── 01_system_architecture_and_modules.md
│   ├── 02_ai_pipeline_and_catalog_generation.md
│   ├── 03_google_maps_and_image_sourcing.md
│   ├── 04_database_schema_and_er_diagram.md
│   └── 05_credentials_and_deployment_manual.md
├── server/                             # Server Micro-Modules & Cloud Connectors
│   ├── cloudinary.js                   # Cloudinary SDK wrapper & upload proxy
│   ├── db.js                           # TiDB Cloud MySQL pool, migrations & auto-seed
│   ├── gemini.js                       # AI Vision & autonomous dossier generation
│   ├── places.js                       # Google Places API photograph retrieval
│   └── validator.js                    # Query sanitization & harmful input guardrails
├── src/                                # Frontend React 19 Application
│   ├── components/                     # Modular Reusable Components
│   │   ├── ApiKeyPromptModal.tsx       # AI configuration modal
│   │   ├── AudioNarrationPlayer.tsx    # Native speech synthesizer player
│   │   ├── Footer.tsx                  # Global footer, attribution & language toggle
│   │   ├── HeritageSiteAdminManager.tsx# Full CRUD catalog administration portal
│   │   ├── Navbar.tsx                  # Header navigation & locale selector
│   │   ├── NearbyExplorerSection.tsx   # Curated nearby points of interest
│   │   ├── SecurityAndTestPlanSection.tsx # Architecture diagnostics
│   │   └── SiteLocationMap.tsx         # Google Maps (Roadmap, Satellite, Google 3D)
│   ├── data/                           # Client Baseline Datasets & Fallbacks
│   │   ├── delhiHeritage.ts            # Delhi historical dossiers
│   │   ├── delhiNearbyData.ts          # Curated nearby food & monuments
│   │   ├── heritageSites.ts            # Master baseline monument array
│   │   └── upcomingRegions.ts          # Indian States metadata & target monuments
│   ├── pages/                          # Primary Application Routes
│   │   ├── ExplorePage.tsx             # State-filtered directory with search & cards
│   │   ├── HomePage.tsx                # Hero section, AI scanner & state explorer hub
│   │   ├── ProfilePage.tsx             # Restricted Admin Portal (Passcode Protected)
│   │   └── ResultPage.tsx              # Full dossier view, audio guide & interactive map
│   ├── services/                       # Client Data & Remote Synchronization Services
│   │   ├── geminiService.ts            # Client-side AI fallback & error sanitization
│   │   ├── heritageDataStore.ts        # Reactive catalog store with TiDB sync
│   │   └── storage.ts                  # LocalStorage wrapper (settings, tokens, history)
│   ├── types/                          # TypeScript Interfaces & Data Contracts
│   │   └── index.ts                    # HeritageSite, Result, UserSettings definitions
│   ├── utils/                          # Geolocation, Coordinates & Fallbacks
│   │   ├── geoCoordinates.ts           # All-India GPS registry & live geocoder
│   │   └── imageFallback.ts            # Multi-domain image fallback loader
│   ├── App.tsx                         # Root router & application layout
│   ├── index.css                       # Tailwind CSS & custom animations
│   └── main.tsx                        # Application mount point
├── .env                                # Local environment secrets (Server & DB)
├── .env.example                        # Template environment configuration
├── package.json                        # Node dependencies & build scripts
├── server.js                           # Express REST API server & static file host
├── tsconfig.json                       # TypeScript compiler configuration
└── vite.config.ts                      # Vite bundler build settings & dev proxy
```

---

## 3. Database Architecture & Entity-Relationship (ER) Diagram

HeritageLens AI uses **TiDB Cloud Serverless MySQL** with continuous synchronization to local JSON backups.

```mermaid
erDiagram
    HERITAGE_SITES {
        VARCHAR(120) id PK "Canonical URL-safe slug, e.g. 'golden-temple'"
        VARCHAR(255) name "Official English name"
        VARCHAR(100) category "Classification, e.g. 'Sikh Heritage', 'Mughal Architecture'"
        JSON data "Complete rich bilingual monument dossier document"
        TIMESTAMP created_at "Creation timestamp"
        TIMESTAMP updated_at "Last modification timestamp"
    }

    SITE_LOCATION {
        FLOAT latitude "Geographic latitude coordinate"
        FLOAT longitude "Geographic longitude coordinate"
        VARCHAR state "Indian State / Union Territory"
        VARCHAR hindiState "Devanagari State Name"
        VARCHAR city "City or district location"
        VARCHAR hindiCity "Devanagari City Name"
    }

    TRAVEL_TIPS {
        VARCHAR timings "Visiting hours and days"
        VARCHAR entryFee "Ticket and admission pricing"
        VARCHAR nearestMetro "Nearest transit / metro station"
        TEXT bestTimeToVisit "Ideal seasonal and daily visiting window"
        JSON rules "Array of dress code and visitor guidelines"
    }

    NEARBY_ATTRACTIONS {
        VARCHAR name "Attraction title"
        VARCHAR distance "Kilometer or meter distance from site"
        TEXT description "Cultural and historical summary"
    }

    ADMIN_SESSIONS {
        VARCHAR(64) token PK "SHA-256 session token"
        TIMESTAMP expires_at "Token expiry timestamp"
        BOOLEAN is_active "Session validity flag"
    }

    HERITAGE_SITES ||--|| SITE_LOCATION : "embeds in data"
    HERITAGE_SITES ||--|| TRAVEL_TIPS : "embeds in data"
    HERITAGE_SITES ||--o{ NEARBY_ATTRACTIONS : "contains array in data"
    ADMIN_SESSIONS ||--o{ HERITAGE_SITES : "manages and audits"
```

### SQL Table Schema (`server/db.js`)
```sql
CREATE TABLE IF NOT EXISTS heritage_sites (
  id VARCHAR(120) NOT NULL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 4. AI Pipeline & Autonomous State-Wise Catalog Engine

### A. Safety Guardrails & Query Sanitization
Every query submitted through the search bar is screened by [server/validator.js](file:///c:/Users/ratan/OneDrive/Desktop/FOLDERS/HeritageLens/server/validator.js):
- **Harmful / Contraband Shield**: Rejects weapons, drugs, adult material, or illegal items.
- **Entity Filter**: Rejects gadgets, animals, personal names, food items, or abstract concepts (e.g. "iPhone", "golden retriever", "bitcoin").
- **Physical Landmark Verification**: The AI system instruction enforces strict rejection if a query does not refer to a real, physical monument or cultural landmark on Earth.

### B. Autonomous State Detection & Catalog Expansion
When an uncataloged monument is queried (e.g., *"Golden Temple"*):
1. **AI Synthesis**: Generates a complete ASI/UNESCO-grade dossier in English and Hindi.
2. **State & Centroid Inference**: Detects that Golden Temple is in **Punjab** (`state: 'Punjab'`, `hindiState: 'पंजाब'`).
3. **Dynamic State Hub Generation**:
   - When the user or administrator clicks **"+ Add to Catalog"**, the monument is saved to TiDB Cloud.
   - The Home Page (`Section 5: Explore Heritage by State`) dynamically creates a new **Punjab** state directory hub with active monument counts and filter pills without code redeployment.

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Visitor
    participant UI as 🖥️ HomePage
    participant Store as 📦 HeritageDataStore
    participant API as ⚡ /api/generate-site
    participant AI as 🧠 AI Vision Engine
    participant Maps as 🗺️ Google Places / SerpAPI
    participant DB as 🗄️ TiDB Cloud

    User->>UI: Searches "Golden Temple"
    UI->>API: POST /api/generate-site { query: "Golden Temple" }
    API->>AI: Synthesizes bilingual history, era, style, and coordinates
    AI-->>API: Returns complete dossier (State: Punjab, Coords: 31.6200, 74.8765)
    API->>Maps: Searches verified photographs
    Maps-->>API: Returns authentic high-resolution images
    API-->>UI: Displays preview with "+ Add to Catalog"
    User->>UI: Clicks "+ Add to Catalog"
    UI->>DB: POST /api/sites (Inserts record)
    DB-->>UI: Confirmed (201 Created)
    UI->>Store: Updates reactive state
    UI-->>User: Punjab hub appears live with Golden Temple listed!
```

---

## 5. Google Maps Geolocation & 4-Tier Image Search Engine

### A. Google Maps Integration ([src/components/SiteLocationMap.tsx](file:///c:/Users/ratan/OneDrive/Desktop/FOLDERS/HeritageLens/src/components/SiteLocationMap.tsx))
- **Interactive Map Modes**:
  1. **"Map" (Google Roadmap Tiles)**: Street grid, metro stations, and local landmarks using `mt1.google.com/vt/lyrs=m`.
  2. **"Satellite" (Google Aerial & Hybrid)**: High-resolution satellite imagery with street overlays using `mt1.google.com/vt/lyrs=y`.
  3. **"Google 3D" (Native Google Maps)**: Full native Google Maps embed with 3D terrain and official Google business markers.
- **Turn-by-Turn Directions**: Direct link opening native Google Maps navigation pre-filled with the monument's destination coordinates.
- **Live Geocoder (`/api/geocode`)**: Uses OpenStreetMap Nominatim and Wikipedia Geosearch to dynamically resolve exact GPS coordinates if coordinates are missing.

### B. 4-Tier Authentic Photograph Pipeline
To avoid stock art and generic illustrations, [server.js](file:///c:/Users/ratan/OneDrive/Desktop/FOLDERS/HeritageLens/server.js) queries four photo sources in sequence:
1. **Tier 1 (SerpAPI Google Images)**: Direct high-resolution Google Images search (`engine: 'google_images'`).
2. **Tier 2 (Google Places API)**: Official visitor and archaeological photographs from Google Maps listings.
3. **Tier 3 (Wikimedia Commons API)**: Public domain archaeological photography.
4. **Tier 4 (Wikipedia PageImages API)**: Canonical hero images from Wikipedia.
5. **Cloudinary CDN Upload**: The best photograph is uploaded to Cloudinary (`folder: 'heritagelens'`, transformation `quality: 'auto:eco', fetch_format: 'auto'`) for permanent, optimized delivery.

---

## 6. Admin Control Portal & Security Governance

The **Admin Portal** ([src/pages/ProfilePage.tsx](file:///c:/Users/ratan/OneDrive/Desktop/FOLDERS/HeritageLens/src/pages/ProfilePage.tsx) and [src/components/HeritageSiteAdminManager.tsx](file:///c:/Users/ratan/OneDrive/Desktop/FOLDERS/HeritageLens/src/components/HeritageSiteAdminManager.tsx)) provides full management of the platform:

- **Passcode Protected**: Unlocked via `ADMIN_SECRET_KEY` (Default: `heritage_secure_admin_2026`).
- **Catalog Management (CRUD)**:
  - Add new monuments with automated AI pre-fill.
  - Edit timings, tickets, descriptions, metro stations, and image URLs.
  - Delete obsolete or duplicate entries from TiDB Cloud and local JSON.
  - Re-fetch fresh Google Maps/Places photography for any monument with a single click.
- **System Health Diagnostics**: Live monitor checking TiDB Cloud connectivity, Cloudinary CDN status, and AI engine reachability.

---

## 7. Active Project Credentials & Environment Configuration

Below is the master list of active environment credentials configured for this project in `.env`:

```env
# ==============================================================================
# HeritageLens AI — Active Master Environment Configuration
# ==============================================================================

# 1. TiDB Cloud Serverless MySQL Database
TIDB_HOST="gateway01.ap-southeast-1.prod.aws.tidbcloud.com"
TIDB_PORT=4000
TIDB_USER="3yNmh6obhCvoANU.root"
TIDB_PASSWORD="5XxFFXfAi1sPrY6Z"
TIDB_DATABASE="test"
DATABASE_URL="mysql://3yNmh6obhCvoANU.root:5XxFFXfAi1sPrY6Z@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={\"rejectUnauthorized\":true}"

# 2. Cloudinary Media CDN
CLOUDINARY_CLOUD_NAME="x7d7wzts"
CLOUDINARY_API_KEY="553348649876821"
CLOUDINARY_API_SECRET="5Eqdz6q1zvJEckm7GIJGy8KBXGs"

# 3. SerpAPI (Google Images Live Search Engine)
SERPAPI_KEY="11e81901e285bd08446535fbd299b88f5ab57946b7d7116ef49db53ae03f88c6"

# 4. Administrator Access Passcode
ADMIN_SECRET_KEY="heritage_secure_admin_2026"

# 5. Server Configuration
PORT=5000
NODE_ENV="production"

# 6. AI Vision Model (Set in Render Dashboard or .env)
# Get a free key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="your_api_key_here"

# 7. Optional Google Cloud Places API (Fallback already handled by SerpAPI)
# GOOGLE_PLACES_API_KEY="your_google_cloud_places_api_key"
```

---

## 8. Step-by-Step Account Setup & API Key Generation Guide

If you are transferring this codebase to another developer or deploying to your own infrastructure, follow these step-by-step instructions to create new accounts:

### A. Render Web Service Deployment
1. Sign up at [https://render.com](https://render.com).
2. Click **"New +"** > **"Web Service"** > Connect your GitHub repository (`HeritageLens`).
3. Set the following build and runtime settings:
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. In the **"Environment Variables"** tab on Render, copy and paste all keys from [Section 7](#7-active-project-credentials--environment-configuration).
5. Click **"Deploy Web Service"**. Render will build the Vite SPA, boot `server.js`, and provide a live `https://heritagelens-ai.onrender.com` URL.

---

### B. TiDB Cloud Serverless MySQL
1. Go to [https://tidbcloud.com](https://tidbcloud.com) and sign up (Free Forever tier, no credit card required).
2. Click **"Create Cluster"** > Select **"Serverless"** (Free).
3. Choose region (e.g. AWS Singapore `ap-southeast-1` or US East `us-east-1`).
4. Click **"Connect"** on your cluster page > Select **"Node.js"**.
5. Click **"Generate Password"** and copy the password immediately.
6. Copy `Host`, `User`, `Port (4000)`, and the complete `DATABASE_URL` into your `.env`.

---

### C. Cloudinary Media CDN
1. Go to [https://cloudinary.com](https://cloudinary.com) and create a free account.
2. From your Cloudinary Dashboard under **"Product Environment Credentials"**, copy:
   - **Cloud Name** (e.g. `x7d7wzts`)
   - **API Key** (e.g. `553348649876821`)
   - **API Secret** (e.g. `5Eqdz6q1zvJEckm7GIJGy8KBXGs`)
3. Paste these values into your `.env` file. Cloudinary will automatically create the `heritagelens/` folder on the first photo upload.

---

### D. SerpAPI (Google Images Engine)
1. Go to [https://serpapi.com](https://serpapi.com) and register for a free account (100 free searches/month, no credit card required).
2. Navigate to [https://serpapi.com/dashboard](https://serpapi.com/dashboard).
3. Copy **"Your Private API Key"** from the dashboard.
4. Set it as `SERPAPI_KEY` in your `.env`.

---

### E. Google AI Studio (Multimodal Vision Engine)
1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Sign in with any standard Google account.
3. Click **"Create API Key"** > Select **"Create API key in new project"**.
4. Copy the generated key (starts with `AIzaSy...`).
5. Set it as `GEMINI_API_KEY` in your server environment and `.env`.

---

### F. Google Cloud Platform (Maps & Places) — Optional
*Note: The website already embeds interactive Google Maps and Google Roadmap/Satellite tiles without requiring any API keys. If you wish to enable the optional server-side Google Places Photo API:*
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project > Navigate to **"APIs & Services" > "Library"**.
3. Enable **"Places API (New)"** and **"Maps JavaScript API"**.
4. In **"Credentials"**, click **"Create Credentials" > "API key"**.
5. Add the key as `GOOGLE_PLACES_API_KEY` in your `.env`.

---

## 9. Quickstart & Local Development

### Prerequisites
- Node.js 18.x or 20.x or higher
- npm 9.x or higher

```bash
# 1. Clone repository
git clone https://github.com/ratandeep1017/HeritageLens.git
cd HeritageLens

# 2. Install all dependencies
npm install

# 3. Configure local environment variables
cp .env.example .env
# Verify credentials in .env match Section 7

# 4. Start local development server
npm run dev
```

- **Frontend App**: `http://localhost:3000` (or `http://localhost:5173`)
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

### Building for Production Locally
```bash
# Verify TypeScript type checks
npm run lint

# Compile production bundle into dist/
npm run build

# Start production server
npm start
```

---

## 10. Deep-Dive Technical Guides (`description/` Directory)

For specialized technical breakdowns, refer to the dedicated markdown manuals inside the [description/](file:///c:/Users/ratan/OneDrive/Desktop/FOLDERS/HeritageLens/description/) directory:

- [01_system_architecture_and_modules.md](file:///c:/Users/ratan/OneDrive/Desktop/FOLDERS/HeritageLens/description/01_system_architecture_and_modules.md) — Comprehensive module-by-module code map and lifecycle.
- [02_ai_pipeline_and_catalog_generation.md](file:///c:/Users/ratan/OneDrive/Desktop/FOLDERS/HeritageLens/description/02_ai_pipeline_and_catalog_generation.md) — Autonomous research prompts, guardrails, and admin verification.
- [03_google_maps_and_image_sourcing.md](file:///c:/Users/ratan/OneDrive/Desktop/FOLDERS/HeritageLens/description/03_google_maps_and_image_sourcing.md) — Google Maps layers, geocoding resolver, and SerpAPI/Places photo cascade.
- [04_database_schema_and_er_diagram.md](file:///c:/Users/ratan/OneDrive/Desktop/FOLDERS/HeritageLens/description/04_database_schema_and_er_diagram.md) — TiDB Cloud Serverless MySQL, SSL configuration, and ER models.
- [05_credentials_and_deployment_manual.md](file:///c:/Users/ratan/OneDrive/Desktop/FOLDERS/HeritageLens/description/05_credentials_and_deployment_manual.md) — Production secrets, account creation guides, and Render hosting manual.

---

## 11. Attributions & License

- **Historical Records & Content**: Curated from the [Archaeological Survey of India (ASI)](https://asi.nic.in/), [UNESCO World Heritage Centre](https://whc.unesco.org/), and regional cultural management trusts.
- **Mapping & Geodata**: Map tiles and geocoding data powered by [Google Maps](https://maps.google.com), [OpenStreetMap](https://www.openstreetmap.org/copyright), and [Esri](https://www.esri.com).
- **License**: MIT License. Open for educational, cultural preservation, and public utility initiatives.
