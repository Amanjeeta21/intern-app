# Product Catalog

A React Native mobile application for browsing products, viewing product details, managing favorites, and adding personal photos. Built with Expo and TypeScript, with support for persistent storage, light/dark themes, cloud builds, and over-the-air updates.

## Features

- **Product Listing:** Fetch and display products from the DummyJSON API.
- **Search & Categories:** Search products and filter them by category.
- **Product Details:** View product information and browse product images.
- **Favorites:** Add or remove products from favorites with persistent storage.
- **Photo Picker:** Capture or select personal photos using the device camera or gallery.
- **Theme Switching:** Toggle between light and dark themes.
- **Persistent Preferences:** Save favorites, theme preferences, and supported app data using AsyncStorage.
- **Loading & Error States:** Display loading indicators, empty states, error messages, and retry options.
- **Pull to Refresh:** Refresh the product listing.

## Tech Stack

| Technology         | Purpose                                  |
| ------------------ | ---------------------------------------- |
| React Native       | Cross-platform mobile development        |
| Expo SDK 58        | Development and native app tooling       |
| TypeScript         | Type safety                              |
| Expo Router        | File-based navigation                    |
| React Context API  | Shared favorites and theme state         |
| React Hooks        | Component state and lifecycle management |
| AsyncStorage       | Persistent local storage                 |
| Expo Image Picker  | Camera and gallery access                |
| DummyJSON REST API | Product data                             |
| StyleSheet         | Component styling                        |
| EAS Build          | Cloud Android builds                     |
| EAS Update         | Over-the-air updates                     |
| Gradle             | Local Android builds                     |

## Project Setup

### Prerequisites

- Node.js and npm
- Expo Go (for development)
- Android device or emulator
- Expo account (for EAS builds)

### Installation

Clone the repository:

```bash
git clone https://github.com/Amanjeeta21/intern-app.git
cd intern-app
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root using the following configuration:

```env
EXPO_PUBLIC_API_URL=https://dummyjson.com
```

Refer to `.env.example` for the required configuration.

Start the development server:

```bash
npx expo start
```

## Builds

### Local Gradle Build

Generate the native Android project if required:

```bash
npx expo prebuild --platform android
```

Navigate to the Android directory:

```bash
cd android
```

Build a release APK:

```bash
.\gradlew.bat assembleRelease
```

The generated APK is located at:

```text
android/app/build/outputs/apk/release/app-release.apk
```

### EAS Cloud Builds

Configure EAS:

```bash
eas build:configure
```

Log in:

```bash
eas login
```

EAS uses three build profiles:

| Profile     | Purpose                                  | Output         |
| ----------- | ---------------------------------------- | -------------- |
| development | Development client for testing           | Internal build |
| preview     | Internal distribution and device testing | APK            |
| production  | Play Store release                       | AAB            |

Build a preview APK:

```bash
eas build --platform android --profile preview
```

Build a production Android App Bundle:

```bash
eas build --platform android --profile production
```

### Over-the-Air Updates

Publish JavaScript and asset updates without requiring users to reinstall the application:

```bash
eas update --channel preview --message "Update description"
```

OTA updates can modify JavaScript logic, styles, and bundled assets. Changes involving native code, native dependencies, permissions, or native configuration require a new binary build.

### Gradle vs EAS

| Aspect          | Local Gradle                                      | EAS Build                              |
| --------------- | ------------------------------------------------- | -------------------------------------- |
| Build location  | Local machine                                     | Expo cloud                             |
| Setup           | Requires Android SDK, JDK, and Gradle environment | Requires Expo account and EAS CLI      |
| Build speed     | Depends on local hardware and caching             | Depends on cloud queue and build time  |
| Cost            | No Expo cloud build usage                         | Subject to EAS plan limits             |
| Signing         | Local signing configuration                       | EAS-managed or configured credentials  |
| Reproducibility | Environment-dependent                             | Consistent cloud build environment     |
| CI/CD           | Requires pipeline configuration                   | Integrates with EAS workflows          |
| Best suited for | Native debugging and offline builds               | Team builds, CI/CD, and store releases |

**When to use which?**

- **Gradle:** Useful for debugging native Android issues, working offline, and having direct control over local builds.
- **EAS:** Useful for cloud builds, consistent build environments, team collaboration, and production releases.

Note: APKs signed with different signing keys generally cannot update one another as existing installations. Android may report `INSTALL_FAILED_UPDATE_INCOMPATIBLE`.

## Preview APK

[Product Catalog – Preview APK](https://expo.dev/accounts/amanjeeta/projects/product-catalog/builds/8d62544d-990c-4916-a036-cf068ff8f8c5)

- [Products — Dark Mode](assets/Screenshots/img%201.jpeg)
- [Products — Light Mode](assets/Screenshots/img%202.jpeg)
- [Favorites](assets/Screenshots/img%203.jpeg)
- [Product Image](assets/Screenshots/img%204.jpeg)
- [Camera Options](assets/Screenshots/img%205.jpeg)
- [Product Details](assets/Screenshots/img%206.jpeg)

### Product Details

![Product Details](assets/screenshots/img 6.jpeg)

## Project Information

- **Platform:** Android
- **Package Name:** `com.amanjeeta.productcatalog`
- **App Version:** 1.0.1
- **Android Version Code:** 2
- **Build System:** Gradle and Expo Application Services (EAS)
