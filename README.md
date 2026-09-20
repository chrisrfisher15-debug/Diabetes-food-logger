# Meal Log (Diabetes food logger)

A personal **meal + insulin log** for people with diabetes. v1 lets you record what you ate and the insulin dose **you already took**. Data stays on the device.

## This is not medical advice

This app is for **personal logging only**. It is **not** a medical device, **not** medical advice, and **not** an insulin dose calculator or recommender. It never invents or suggests a dose from carbs, ratios, or glucose. Follow your clinician’s plan.

## What v1 does

- Home / history with a clear not-medical-advice disclaimer
- Add a meal log:
  - Meal name or notes
  - Foods (name + optional carbs in grams)
  - Insulin units **you enter**
  - Optional blood glucose (mg/dL)
  - Timestamp (defaults to now, editable)
- Chronological history; tap a log to view, edit, or delete it
- Local persistence with AsyncStorage (no account or backend)

Later: optional insulin pump integration may be explored. v1 has no pump, CGM, or other health-device features.

## Run it

You need Node.js 18+ and [Expo](https://docs.expo.dev/).

```bash
npm install
npx expo start
```

Then:

- Press `w` for web
- Scan the QR code with Expo Go on a phone
- Press `a` (Android) or `i` (iOS simulator) if those toolchains are installed

Other scripts:

```bash
npm run web
npm run android
npm run ios
npm run typecheck
```

## Project layout

```
app/                 Expo Router screens
  index.tsx          History + disclaimer
  log/new.tsx        Add a meal
  log/[id].tsx       View / edit / delete
src/
  components/        Shared UI
  context.tsx        In-memory + persisted logs
  storage.ts         AsyncStorage
  validation.ts      User-entered values only
```

## Notes

- Insulin is stored exactly as you type it. The app will not calculate a dose from carbs.
- Logs are saved only on the current device/browser. Clearing app data or site storage removes them.
