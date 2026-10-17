# 🔑 Master Credentials, Account Creation & Deployment Manual

This manual contains the **exact working credentials** for the HeritageLens AI project, plus complete step-by-step instructions so anyone receiving this codebase can create new accounts, configure API keys, and deploy to **Render**, **TiDB Cloud**, **Cloudinary**, **SerpAPI**, and **Google Cloud**.

---

## 1. Project Master Working Credentials

Below are the active production credentials configured in the root `.env` file:

| Service | Environment Variable | Current Value / Setting | Description |
| :--- | :--- | :--- | :--- |
| **TiDB Cloud** | `TIDB_HOST` | `gateway01.ap-southeast-1.prod.aws.tidbcloud.com` | TiDB Serverless Host |
| **TiDB Cloud** | `TIDB_PORT` | `4000` | MySQL Port (Default 4000) |
| **TiDB Cloud** | `TIDB_USER` | `3yNmh6obhCvoANU.root` | Database Root User |
| **TiDB Cloud** | `TIDB_PASSWORD` | `5XxFFXfAi1sPrY6Z` | Database Cluster Password |
| **TiDB Cloud** | `TIDB_DATABASE` | `test` | Target Database Name |
| **TiDB Cloud** | `DATABASE_URL` | `mysql://3yNmh6obhCvoANU.root:5XxFFXfAi1sPrY6Z@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}` | Complete SSL URI |
| **Cloudinary** | `CLOUDINARY_CLOUD_NAME` | `x7d7wzts` | Media CDN Cloud Name |
| **Cloudinary** | `CLOUDINARY_API_KEY` | `553348649876821` | Cloudinary API Key |
| **Cloudinary** | `CLOUDINARY_API_SECRET` | `5Eqdz6q1zvJEckm7GIJGy8KBXGs` | Cloudinary API Secret |
| **SerpAPI** | `SERPAPI_KEY` | `11e81901e285bd08446535fbd299b88f5ab57946b7d7116ef49db53ae03f88c6` | Google Images Live Search Engine |
| **Admin Portal** | `ADMIN_SECRET_KEY` | `heritage_secure_admin_2026` | Secret Passcode to unlock `/profile` |
| **Server** | `PORT` | `5000` | Express Server Listening Port |
| **AI Vision Engine** | `GEMINI_API_KEY` | *(Set in Render / Server Environment)* | Multimodal AI Model Access Key |
| **Google Places** | `GOOGLE_PLACES_API_KEY` | *(Optional, or use SerpAPI fallback)* | Verified Google Maps Photo API |

---

## 2. Step-by-Step Account Setup & Key Generation

If you need to generate fresh credentials from scratch, follow these instructions for each platform:

### A. TiDB Cloud (Free Serverless MySQL Database)
1. **Sign Up**: Go to [https://tidbcloud.com](https://tidbcloud.com) and sign up with GitHub or Google (Free Forever tier requires no credit card).
2. **Create Cluster**:
   - Click **"Create Cluster"** -> Select **"Serverless"** (Free).
   - Choose your preferred AWS region (e.g. `ap-southeast-1` Singapore or `us-east-1` N. Virginia).
   - Click **"Create"**.
3. **Get Credentials**:
   - In your cluster overview, click the **"Connect"** button on the top right.
   - Select connection method: **"General"** / **"Node.js"**.
   - Click **"Generate Password"** and copy the password immediately (it will only be shown once).
   - Copy the `Host`, `User`, `Port (4000)`, and the full `DATABASE_URL`.
   - Update `TIDB_HOST`, `TIDB_USER`, `TIDB_PASSWORD`, and `DATABASE_URL` in your `.env`.

---

### B. Cloudinary (Cloud Image & Asset Hosting)
1. **Sign Up**: Go to [https://cloudinary.com](https://cloudinary.com) and create a free account.
2. **Dashboard Overview**:
   - On your Cloudinary Dashboard under **"Product Environment Credentials"**, you will see:
     - **Cloud Name** (e.g. `x7d7wzts`)
     - **API Key** (e.g. `553348649876821`)
     - **API Secret** (Click "Show" or "Copy API Secret")
3. **Configure Media Folder**:
   - Cloudinary automatically creates the `heritagelens/` folder on first upload.
   - Update `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in your `.env`.

---

### C. SerpAPI (Google Images Live Search Engine)
1. **Sign Up**: Go to [https://serpapi.com](https://serpapi.com) and register for a free account (100 free searches/month, no credit card required).
2. **Retrieve API Key**:
   - Navigate to [https://serpapi.com/dashboard](https://serpapi.com/dashboard).
   - In the left sidebar or top banner, locate **"Your Private API Key"**.
   - Copy the key and set it as `SERPAPI_KEY` in your `.env`.

---

### D. Google AI Studio (Multimodal Neural Vision Model)
1. **Get Free API Key**:
   - Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
   - Sign in with your Google account.
   - Click **"Create API key"** -> Select **"Create API key in new project"**.
2. **Configure Key**:
   - Copy the generated API key (starts with `AIzaSy...`).
   - Set it as `GEMINI_API_KEY` in your server environment (and in `.env`).

---

### E. Google Cloud Platform (Google Maps & Places API) — Optional
*Note: The website already embeds interactive Google Maps and Google Tiles without requiring an API key. If you wish to enable the optional server-side Google Places Photo API:*
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., `HeritageLens-Maps`).
3. Under **"APIs & Services" > "Library"**, enable:
   - **Places API (New)**
   - **Maps JavaScript API**
4. Under **"Credentials"**, click **"Create Credentials" > "API key"**.
5. Set the key as `GOOGLE_PLACES_API_KEY` in your `.env`.

---

## 3. Local Development Setup

To run HeritageLens AI locally on your computer:

```bash
# 1. Clone the repository
git clone https://github.com/ratandeep1017/HeritageLens.git
cd HeritageLens

# 2. Install dependencies
npm install

# 3. Create or verify your local .env file
# Ensure the variables from Section 1 above are populated in your .env file

# 4. Start Development Mode (starts both Vite frontend & Express backend)
npm run dev
```

The frontend will be accessible at: `http://localhost:5173`  
The backend API runs on port 5000: `http://localhost:5000`

---

## 4. Production Deployment to Render (Step-by-Step)

HeritageLens AI is built to deploy seamlessly to [Render](https://render.com) as a single, unified Node.js Web Service:

1. **Push to GitHub**:
   Ensure all changes are committed and pushed to your GitHub repository:
   ```bash
   git add .
   git commit -m "Deploy HeritageLens AI"
   git push origin main
   ```

2. **Create New Web Service on Render**:
   - Log into [dashboard.render.com](https://dashboard.render.com).
   - Click **"New +"** -> **"Web Service"**.
   - Connect your GitHub repository (`HeritageLens`).

3. **Configure Service Settings**:
   - **Name**: `heritagelens-ai`
   - **Region**: Singapore or Frankfurt (closest to your TiDB database region)
   - **Branch**: `main`
   - **Root Directory**: `.` (leave blank)
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Instance Type**: `Free`

4. **Add Environment Variables on Render**:
   Navigate to the **"Environment Variables"** section in your Render service dashboard and add:
   ```env
   NODE_ENV=production
   PORT=5000
   ADMIN_SECRET_KEY=heritage_secure_admin_2026
   TIDB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
   TIDB_PORT=4000
   TIDB_USER=3yNmh6obhCvoANU.root
   TIDB_PASSWORD=5XxFFXfAi1sPrY6Z
   TIDB_DATABASE=test
   DATABASE_URL=mysql://3yNmh6obhCvoANU.root:5XxFFXfAi1sPrY6Z@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}
   CLOUDINARY_CLOUD_NAME=x7d7wzts
   CLOUDINARY_API_KEY=553348649876821
   CLOUDINARY_API_SECRET=5Eqdz6q1zvJEckm7GIJGy8KBXGs
   SERPAPI_KEY=11e81901e285bd08446535fbd299b88f5ab57946b7d7116ef49db53ae03f88c6
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Deploy**:
   - Click **"Deploy Web Service"**.
   - Render will clone the repository, run `npm install`, compile the Vite production bundle into `dist/`, and boot `server.js`.
   - Your live URL will be active at: `https://heritagelens-ai.onrender.com`.
