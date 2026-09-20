# Google Play Store (Android) — later

**You do not need any of this to use the app today.** On a phone, install Expo Go and follow **Run on your phone** in the [README](./README.md). This page is only for a later Play Store listing.

This app is a **personal meal + insulin logger**. It is **not** a medical device, **not** FDA-cleared, **not** medical advice, and **not** an insulin dose calculator.

## What you must do outside this repo

1. Create a [Google Play Console](https://play.google.com/console) developer account (one-time **$25** USD as of 2026).
2. Publish a **privacy policy URL** (Play requires one). Frame the app as a personal logger: local-only meal/insulin/glucose notes, not a medical device, not dose advice. v1 does not send this data to a server.
3. Install EAS CLI and log in (`npm i -g eas-cli` then `eas login`). An Expo account is required for cloud builds, not for Expo Go.
4. Create an EAS project once (`eas init` / link this app) if you have not already.
5. Build an **Android App Bundle (AAB)** and upload it in Play Console.

This repo does **not** include Play Console credentials, a hosted privacy policy, or store screenshots. Those stay in your Google/Expo accounts.

## Package identity

Play Console **application id** is Expo’s `android.package` in `app.json`:

- Android application id / package: `com.chrisrfisher.meallog`
- iOS bundle id (for a later App Store/TestFlight build): `com.chrisrfisher.meallog`

Do not change this id after you create the Play app. Google treats it as permanent.

## Build commands (when you are ready)

```bash
npm i -g eas-cli
eas login
eas init
eas build -p android --profile production
```

`production` in `eas.json` builds an **AAB** for Play (`android.buildType: app-bundle`).

Optional internal testers (sideload APK, not Play production):

```bash
eas build -p android --profile preview
```

**iOS note:** a later installable iOS binary needs an Apple Developer Program account and TestFlight (or App Store). There is no Play-style “upload an APK” equivalent.

## Play Console checklist

### App content and rating
- Complete the **content rating** questionnaire (likely Everyone / similar; no user-generated public content in v1).
- Declare this is **not** a medical device and does **not** provide treatment or dosing advice.

### Data safety form (v1, as the code works today)
Be accurate; do not claim encryption, accounts, or cloud sync that the app does not have.

| Topic | v1 behavior |
| --- | --- |
| Account | None |
| Backend / analytics | None in this repo |
| Data collected and sent off device | None. Meal name, foods, carbs, insulin units, optional glucose, and timestamps stay in on-device AsyncStorage |
| Health data | User-entered meal and insulin notes are stored **only on the device**. Clearing Expo Go / app data deletes them |
| Data sharing | Not shared with third parties by this app |
| Encryption in transit | Not applicable (no network upload of logs) |
| Encryption at rest | OS app storage only; v1 does not add its own encrypted database |

If you later add analytics, accounts, or backup, update the Data safety form before shipping that version.

### Store listing
Prepare these in Play Console (not in this repo):

- **Title** (max 30): `Meal Log`
- **Short description** (max 80): `Personal meal and insulin log. Not medical advice. Follow your clinician's plan.`
- **Full description** (draft you can paste, then edit):

  Meal Log is a personal journal for meals and the insulin dose you already took.

  You can record a meal name, foods (optional carbs), the insulin units you entered, optional blood glucose, and a time. Favorite foods remember amounts you saved so you can prefill a log. You can always edit the insulin field before saving.

  This is not a medical device and is not FDA-cleared. It does not calculate or recommend insulin doses. It is not connected to a pump or CGM. Follow your clinician’s plan.

  In this version, logs stay on your phone. There is no account and no cloud backup.

- **App icon**: 512×512
- **Feature graphic**: 1024×500
- **Phone screenshots**: at least 2 (home with the disclaimer visible, add-meal form). Tablet shots optional
- **Privacy policy URL**: required (you must host this yourself; Play will reject a listing without a working URL)

## After the AAB is ready

1. In Play Console, create the app with package `com.chrisrfisher.meallog`.
2. Complete Data safety, content rating, and store listing (including privacy policy).
3. Upload the AAB from `eas build -p android --profile production`.
4. Start with **internal testing**, then closed/open testing, then production when Google’s review finishes.

Play review can ask extra questions for health-related apps. Keep the in-app disclaimer and do not describe the app as treatment, diagnosis, or a pump/CGM product.
