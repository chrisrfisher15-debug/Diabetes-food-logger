# Meal Log (Diabetes food logger)

A personal **meal + insulin log** for people with diabetes. v1 lets you record what you ate and the insulin dose **you already took**. Data stays on the device.

This project targets **Expo SDK 54**, the SDK in **Expo Go from the Apple App Store and Google Play**. You do **not** need an Expo/EAS account or a custom native build to try it on a phone.

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

## Run on your phone (iPhone or Android)

Same app, same steps. Expo Go is the supported way to open it on a real device.

1. Install **Expo Go** on the phone
   - **iPhone:** [Expo Go on the App Store](https://apps.apple.com/app/expo-go/id982107779)
   - **Android:** [Expo Go on Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. On a computer, install [Node.js 18+](https://nodejs.org/) and clone this repo. Check out this feature branch, or `main` after it is merged:

   ```bash
   git clone https://github.com/chrisrfisher15-debug/Diabetes-food-logger.git
   cd Diabetes-food-logger
   git checkout cursor/diabetes-food-logger-v1-8119
   npm install
   npx expo start
   ```

3. Phone and computer on the **same Wi‑Fi**. Scan the QR code:
   - **iPhone:** open the Camera app (or Expo Go) and scan the QR code
   - **Android:** open Expo Go and use **Scan QR code**
4. If the project never loads (campus/guest Wi‑Fi, different networks, or a failed LAN connection), stop the server and start a tunnel instead. No EAS login required:

   ```bash
   npx expo start --tunnel
   ```

   Then scan the new QR code.

If Expo Go says the project is incompatible, this app needs the **SDK 54** Expo Go from the store. Update Expo Go, or install the SDK 54 build from [expo.dev/go](https://expo.dev/go).

## Run on a computer

```bash
npm install
npx expo start
```

Then press `w` for web, or `a` / `i` if you have an Android emulator or iOS Simulator.

```bash
npm run web
npm run start:tunnel
npm run typecheck
```

## Later: optional store-style builds (not required)

`eas.json` has a **preview** profile for a future installable build. You do **not** need this (or an Expo login) to use Expo Go.

- **Android:** `eas build -p android --profile preview` can produce an APK you can sideload.
- **iOS:** there is no equivalent “just download an IPA” path. A later installable iOS build needs an Apple Developer account and TestFlight (or a development build).

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
- Logs are saved only on the current device. Clearing Expo Go / app data removes them.
