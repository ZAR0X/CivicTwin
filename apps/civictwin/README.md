# CivicTwin Bhopal 🏙️

**CivicTwin Bhopal** is a premium, state-of-the-art civic reporting and command center application built on Expo (React Native for Mobile and Web). The platform empowers citizens to report civic hazards (like potholes, sewage leaks, or dangling wires), verifies them through community upvoting, and diagnoses issues instantly using Gemini AI.

---

## ✨ Features

### 1. Interactive 3D Map & Satellite Mode
* **3D Extrusions:** Extrudes buildings in 3D dynamically at zoom level 15+ using vector tiles.
* **Snapchat-Style Thermal Heatmap:** Employs a Snapchat-style orange/yellow/blue density heatmap to visualize neighborhood hazard concentrations.
* **ESRI Satellite Layer:** Toggles between a futuristic 3D vector map and high-resolution **ESRI World Imagery** satellite tiles.
* **Smooth Navigation:** Includes map controls for resetting orientation (Compass), locking rotation, and locating the user.

### 2. Custom Issue Blips (Lag & Drift Free)
* **Visual Thumbnails:** Custom HTML elements render actual issue image thumbnails inside circular blips, complete with severity-based pastel glow rings (Red for High, Orange for Medium, Yellow for Low).
* **Smooth Panning:** Engineered with a two-level DOM structure (outer container with absolute positioning and no transitions; inner child holding the visual layout with hover transforms) to ensure markers stick exactly to their locations without any dragging lag or drift.
* **Conditional Labels:** Issue category and severity level labels appear dynamically when zooming past level 14.

### 3. Centered Issue Details Card
* Displays a centered, modal-style blurred detail sheet when clicking any marker.
* Shows the issue image gallery, precise GPS coordinates, and a human-readable **Address**.
* Separates information into distinct **User Description** and **AI Diagnostics Review** sections.
* Includes community verification buttons allowing citizens to confirm active reports (+50 PTS).

### 4. Gemini AI Reporting Flow
* **Live GPS Tracking:** Captures real-time latitude and longitude when initiating a report.
* **Evidence Upload:** Captures camera evidence and accepts voice/typed descriptions.
* **Gemini Diagnostics:** Runs local/server Gemini AI analysis to classify category, severity, and assign the appropriate municipal department.
* **Count Syncing:** Submitting reports immediately increments the command center ticket count and plots a new blip at the reported location.

---

## 🛠️ Technology Stack

* **Frontend Framework:** [Expo (React Native)](https://expo.dev) with File-based routing (Expo Router).
* **Map Rendering:** [MapLibre GL JS](https://maplibre.org) rendered inside WebGL canvas overlays.
* **Map Basemaps:** OpenFreeMap (Vector Styles) & ESRI World Imagery (Raster Satellite tiles).
* **Styling & UI:** Vanilla CSS + Tailwind-equivalent clean styles, customized Glassmorphism (expo-blur), and harmonized Slate pastels.
* **AI Diagnostics:** Google Gemini API (integrated via Supabase Edge Functions or simulated mock fallback).
* **Database & Auth:** Supabase REST + PostgreSQL (optional, falls back automatically to local storage and mock databases).

---

## 📂 Project Structure

```
apps/user-app/
├── src/
│   ├── app/                      # Expo Router File-based navigation pages
│   │   ├── _layout.tsx           # Context providers and root shell
│   │   ├── index.tsx             # Main Map and Command Center Dashboard
│   │   └── settings.tsx          # Settings screen (Theme toggles & Profile)
│   ├── components/
│   │   └── LoginScreen.tsx       # Glassmorphism login & OTP verification
│   ├── constants/
│   │   ├── mapHtml.ts            # HTML/JS template rendering the MapLibre canvas
│   │   └── theme.ts              # Global premium typography and layout tokens
│   ├── context/
│   │   └── AppContext.tsx        # Global state (theme, user authentication, reports list)
│   └── services/
│       └── apiService.ts         # Supabase & Gemini API service with mock fallbacks
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Credentials (Optional)
Open `src/services/apiService.ts` and set your credentials to switch from local mock mode to a live Supabase backend:
```typescript
export const SUPABASE_URL = "YOUR_SUPABASE_URL"; 
export const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

### 3. Start Development Server
```bash
# Run on Web (default port 8081)
npm run web

# Start Expo Developer Tools
npx expo start
```
* Press `w` to open in browser (web app).
* Scan the QR code using the Expo Go app on iOS or Android to run native.

### 4. Build for Production (EAS Build)
The project is configured for EAS Build (linked to Expo Application Services).
```bash
# Configure platforms
eas build:configure

# Trigger build
eas build --platform all
```

---

