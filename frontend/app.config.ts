// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
import "dotenv/config";
import type { ExpoConfig } from "expo/config";
import fs from "fs";
import path from "path";

// Resolve a file if it exists; return undefined otherwise
const here = (...p: string[]) => path.resolve(__dirname, ...p);
const fileIfExists = (p: string) => (fs.existsSync(p) ? p : undefined);

const profile =
  process.env.EAS_BUILD_PROFILE ??
  (process.env.NODE_ENV === "production" ? "production" : "development");

// Allow forks to build by providing sensible defaults, while letting you override via env.
const APP_NAME = process.env.APP_NAME ?? "";
const APP_SCHEME = process.env.APP_SCHEME ?? "";
const APP_SLUG = process.env.APP_SLUG ?? "";
const APP_OWNER = process.env.APP_OWNER ?? "";
const APP_VERSION = process.env.APP_VERSION ?? "1.0.0";
const BUNDLE_ID = process.env.BUNDLE_IDENTIFIER ?? "com.example";
const ANDROID_PACKAGE = process.env.ANDROID_PACKAGE ?? "com.example";
const IOS_URL_SCHEME = process.env.IOS_URL_SCHEME ?? "example.scheme";
const EAS_PROJECT_ID = process.env.EAS_PROJECT_ID ?? "";

// Firebase files (written by scripts; kept out of git)
const iosPlist = fileIfExists(here("google-services/GoogleService-Info.plist"));
const androidJson = fileIfExists(here("google-services/google-services.json"));

const config: ExpoConfig = {
  name: APP_NAME,
  slug: APP_SLUG,
  scheme: APP_SCHEME,
  version: APP_VERSION,
  owner: APP_OWNER,
  newArchEnabled: true,
  userInterfaceStyle: "automatic",
  ios: {
    supportsTablet: true,
    requireFullScreen: true,
    bundleIdentifier: BUNDLE_ID,
    googleServicesFile: iosPlist,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      UIBackgroundModes: ["remote-notification"],
    },
    entitlements: {
      "aps-environment":
        profile === "production" ? "production" : "development",
    },
    icon: {
      dark: "./assets/images/ios-light.png",
      light: "./assets/images/ios-light.png",
      tinted: "./assets/images/ios-tinted.png",
    },
  },
  android: {
    package: ANDROID_PACKAGE,
    googleServicesFile: androidJson,
    permissions: [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
    ],
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#476481",
    },
    compileSdkVersion: 35,
    targetSdkVersion: 35,
    minSdkVersion: 24,
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "@react-native-firebase/app",
    [
      "expo-build-properties",
      {
        ios: { useFrameworks: "static" },
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#FFFFFF",
        image: "./assets/images/splash-icon.png",
        dark: {
          image: "./assets/images/splash-icon.png",
          backgroundColor: "#000000",
        },
        imageWidth: 200,
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
        recordAudioAndroid: true,
      },
    ],
    "expo-router",
    [
      "expo-secure-store",
      {
        configureAndroidBackup: true,
        faceIDPermission:
          "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
      },
    ],
    ["expo-screen-orientation", { initialOrientation: "DEFAULT" }],
    ["expo-font", { fonts: ["./assets/fonts/SpaceMono-Regular.ttf"] }],
    [
      "@react-native-google-signin/google-signin",
      { iosUrlScheme: IOS_URL_SCHEME },
    ],
  ],
  experiments: { typedRoutes: true },
  extra: {
    router: { origin: false },
    eas: { projectId: EAS_PROJECT_ID },
  },
  assetBundlePatterns: ["**/*"],
};

export default config;
