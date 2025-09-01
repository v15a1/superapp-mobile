# 🚀 WSO2 Super App Mobile (React Native Expo)

The **WSO2 Mobile App** is an all-in-one platform designed to bring essential tools and services to your fingertips for a seamless mobile experience. Built with **React Native Expo**, **TypeScript**, and **Redux**, this Super App integrates secure authentication via **Asgardeo**, a micro-app architecture, and a dynamic app store for downloading and managing features.

---

## 📢 What’s New in This Release

The new WSO2 Mobile App is designed to streamline your digital experience. Here's a quick overview of what's included:

- **Feed**: Stay informed with the latest WSO2 news and upcoming events.
- **Library**: Discover curated blogs covering industry trends, success stories, and expert insights.
- **My Apps**: Access a variety of apps to enhance your digital experience.
- **Profile**: Easily manage your profile and preferences.

✨ **Passkey Authentication is Now Supported with Asgardeo**  
Enjoy passwordless, phishing-resistant sign-ins using FIDO2/WebAuthn for a more secure and seamless login experience.

---

## 📌 Super App Mobile Overview

This Super App serves as a **container** for multiple micro-apps. It:

- Authenticates users using **Asgardeo IAM**.
- Fetches and downloads **micro-apps** from a store.
- Handles **micro-app authentication and token exchange**.
- Manages state using **Redux** with **Redux Thunk**.
- Uses **AsyncStorage** for persistence.

---

## 🔄 Super App Mobile Flow

### **High-Level Overview**

1. User installs & opens the app for the first time

   - App fetches **latest events and news** from wso2.com and **caches** them for 24 hours.

2. Default landing tab is `My Apps`

   - If user **is not authenticated**, no apps are shown.

3. User can navigate:

   - To **Library** tab → Articles are fetched from **WSO2 Library API**.
   - To **Store/Profile** tabs → Prompt to **Sign In** is displayed.

4. If user signs in:

   - Retrieve **access_token & refresh_token** via **Asgardeo IAM**.
   - Fetch **user configurations** and **profile info**.
   - Align locally installed apps with server-side configurations (install/uninstall accordingly).

5. Show:

   - **My Apps** tab → User’s micro apps.
   - **Store** tab → App management functions (update, delete, download).
   - **Profile** tab → Profile details and sign-out option.

6. On re-open, the app:
   - Starts at **My Apps** tab.
   - Checks for a **Super App force update**. If required, shows update screen.
   - Checks if any **micro-apps have updates** and updates them automatically.

---

### Super App Mobile Loading Sequence

```mermaid
sequenceDiagram
    actor User
    participant Super App
    participant IAM as Identity and Access Management (IAM) - Asgardeo
    participant Choreo as API Gateway - Choreo

    User ->> Super App: Open Mobile Application
    Super App ->> IAM: Authorize using client_id of Super App
    IAM -->> Super App: Asgardeo access_token + refresh_token
    Super App ->> Choreo: Resource Access (using IAM access_token)
    Choreo -->> Super App: Resource data
    Super App -->> User: Application loads

```

## 📦 Micro-App Management

### How Micro-Apps Work

1. Micro-apps are listed in the Super App Store.
2. Users can download micro-apps from the store.
3. Downloaded micro-apps are stored using AsyncStorage.
4. When launched, authentication tokens are exchanged for access.
5. The micro-app uses IAM access tokens to communicate with the Choreo API Gateway.

### How Micro-App Updates Work

- The Super App Store checks for updates.
- If an update is available, the micro-app is re-downloaded and replaced.

### Micro App Loading

```mermaid
sequenceDiagram
    actor User
    participant Super App
    participant Micro App
    participant IAM as Identity Access Management (IAM) - Asgardeo
    participant Choreo as API Gateway - Choreo

    User ->> Super App: Open Micro App
    Super App ->> Micro App: Initiate Micro App loading
    Micro App ->> Super App: Request access_token
    Super App ->> IAM: Token exchange (client_id of Micro App + IAM access_token)
    IAM -->> Super App: API access_token
    Super App -->> Micro App: Provide IAM access_token
    Micro App ->> Choreo: Resource Access (using IAM access_token)
    Choreo -->> Micro App: Resource data
    Micro App -->> User: Loads Micro App

```

## 📂 Project Structure

```bash
.
├── README.md                 # Project documentation
├── app                       # Main application screens
│   ├── (tabs)                # Tab navigation screens
│   │   ├── _layout.tsx       # Layout configuration for tab screens
│   │   ├── index.tsx         # Home tab screen
│   │   └── settings.tsx      # Settings tab screen
│   ├── +not-found.tsx        # Not Found (404) screen
│   ├── app-store.tsx         # Micro-app store screen
│   ├── index.tsx             # Entry point of the app
│   └── micro-app.tsx         # Micro-app management screen
├── components                # Reusable UI components
├── constants                 # Static configuration and constants
├── context                   # Redux store and slices
├── hooks                     # Custom React hooks
├── services                  # API service handlers
├── utils                     # Utility functions
```

### Folder Descriptions

- `app/` → Contains screens and navigation logic.
- `components/` → Reusable UI components (widgets, buttons, etc.).
- `context/` → Manages global state using Redux.
- `services/` → Handles API requests (authentication, app store, etc.).
- `utils/` → Utility functions (encryption, request handlers, etc.).

### File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `ListItem.tsx`, `Widget.tsx`)
- Screens/Pages: `kebab-case.tsx` (e.g., `app-store.tsx`, `micro-app.tsx`)
- Hooks: `camelCase.ts` (e.g., `useThemeColor.ts`)
- Services & Utils: `camelCase.ts` (e.g., `authService.ts`, `requestHandler.ts`)
- Redux Slices: `camelCaseSlice.ts` (e.g., `authSlice.ts`)
- Constants: `PascalCase.ts` (e.g., `Colors.ts`, `Constants.ts`)

## ⚙️ Environment Variables (`.env`)

Create a `.env` file and set up the required environment variables:

```dotenv
EXPO_PUBLIC_CLIENT_ID=<asgardeo-project-client-id> # Asgardeo Client ID
EXPO_PUBLIC_REDIRECT_URI=<redirect-uri>            # Redirect URI for authentication flow
EXPO_PUBLIC_TOKEN_URL=https://api.asgardeo.io/t/<asgardeo-organization-name>/oauth2/token
EXPO_PUBLIC_LOGOUT_URL=https://api.asgardeo.io/t/<asgardeo-organization-name>/oidc/logout
EXPO_PUBLIC_BACKEND_BASE_URL=<backend-url>         # Backend API Base URL

APP_NAME=<app-name>                                # App Display name
APP_SLUG=<app-slug>
APP_SCHEME=<app-scheme>
APP_VERSION=1.0.0
APP_OWNER=<app-owner>                              # EAS App owner
BUNDLE_IDENTIFIER=com.example.superapp
ANDROID_PACKAGE=com.example.superapp
EAS_PROJECT_ID=<app-eas-id>                        # EAS Project ID

IOS_URL_SCHEME=com.googleusercontent.apps.xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx      # Google Sign-In (usually your REVERSED_CLIENT_ID from the iOS plist)

# Firebase config as a Base64
FIREBASE_IOS_PLIST_B64=<base-64-string>            # Google Services file as a base64 string
FIREBASE_ANDROID_JSON_B64=<base-64-string>         # Google Services file as a base64 string

```

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Create and Configure the Environment File

First, copy the example environment file to create your local configuration:

```bash
cp .env.example .env
```

Next, open the newly created `.env` file and fill in the required values.

### 2. Generate Base64 for Firebase Configuration

To use Firebase services, you need to convert your `GoogleService-Info.plist` (iOS) and `google-services.json` (Android) files into Base64 strings.

**On macOS:**

```bash
# For iOS: Encodes the file and copies the string to your clipboard
base64 -i path/to/your/GoogleService-Info.plist | tr -d '\n' | pbcopy

# For Android: Encodes the file and copies the string to your clipboard
base64 -i path/to/your/google-services.json | tr -d '\n' | pbcopy
```

**On Linux:**

```bash
# For iOS: Encodes the file and prints the string to the terminal
base64 -w 0 path/to/your/GoogleService-Info.plist

# For Android: Encodes the file and prints the string to the terminal
base64 -w 0 path/to/your/google-services.json
```

**On Windows (using PowerShell):**

```powershell
# For iOS:
[Convert]::ToBase64String([IO.File]::ReadAllBytes("path\to\your\GoogleService-Info.plist"))

# For Android:
[Convert]::ToBase64String([IO.File]::ReadAllBytes("path\to\your\google-services.json"))
```

Paste the generated strings into the `FIREBASE_IOS_PLIST_B64` and `FIREBASE_ANDROID_JSON_B64` variables in your `.env` file.

### 3. Install Dependencies

With your `.env` file configured, run the following command to install all necessary packages.

```bash
npm install
```

> **Note:** The `postinstall` script will automatically run, which performs two key actions:
>
> 1.  It decodes the `FIREBASE_IOS_PLIST_B64` and `FIREBASE_ANDROID_JSON_B64` variables from your `.env` file and creates the `google-services/GoogleService-Info.plist` and `google-services/google-services.json` files.
> 2.  It installs dependencies in the root directory to set up Husky for pre-commit hooks.

### 4. Start the Application

You are now ready to start the Expo development server:

```bash
npx expo start
```

In the output, you'll find options to open the app in a

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start development by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## 🛠️ Debugging & Common Issues

### Authentication Issues

❌ **Problem**: Login fails or returns an error.\
✅ **Solution**:

- Ensure `EXPO_PUBLIC_CLIENT_ID` and `EXPO_PUBLIC_REDIRECT_URI` are correct.
- Check Asgardeo configurations (Redirect URIs & OAuth settings).

### Micro-App Download Fails

❌ **Problem**: Micro-apps are not downloading.\
✅ **Solution**:

- Ensure the backend API (`EXPO_PUBLIC_BACKEND_BASE_URL`) is reachable.
- Check storage permissions if using file system storage.

### Firebase Files Not Found

❌ **Problem**: The build fails with an error indicating `GoogleService-Info.plist` or `google-services.json` is missing.\
✅ **Solution**:

- Ensure the `FIREBASE_IOS_PLIST_B64` and `FIREBASE_ANDROID_JSON_B64` variables in your `.env` file are not empty and contain valid Base64 strings.
- Try running `npm run write-firebase-files` manually to regenerate the files.
- If the issue persists, delete the `node_modules` directory and run `npm install` again.

---
