// app.config.js
require('dotenv').config();
module.exports = {
  expo: {
    name: "proyecto",
    slug: "proyecto",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIBackgroundModes: ["fetch", "location"],
        NSLocationWhenInUseUsageDescription: "We need your location to track your air quality.",
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiUrl: process.env.API_URL || 'https://default-api-url.com',
      apiKey: process.env.API_KEY || 'your-default-api-key',
    }
  }
};