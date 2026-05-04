<div align="center">

<img src="assets/Recyclai_logo_v1.png" alt="Recycl.ai" width="120" height="120" />

# Recycl.ai

**Changing the world one can at a time.**

[![React Native](https://img.shields.io/badge/React_Native-0.76-20232A?style=flat-square&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK-52-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

Point your phone at any object or barcode. Recycl.ai identifies the material and tells you exactly how to recycle it — or how to reuse it elsewhere (craft, donation, repurpose). Instructions are specific to your city. AI applied to sustainability.

## Stack

| Layer | Tools |
|---|---|
| Mobile | React Native · Expo · TypeScript · React Navigation |
| On-device ML | TFLite (MobileNetV3-Large, int8 quantized) · react-native-fast-tflite |
| LLM fallback | Claude API · FastAPI · Railway |
| Auth & DB | Supabase (PostgreSQL + RLS) |
| CI/CD | GitHub Actions · EAS |

## Running locally

```bash
git clone https://github.com/SantiagoGuty/How-to-recycl.ai.git
cd how-to-recycl-ai
npm install
npx expo start
```

For a native build (USB required):

```bash
npx expo run:android
```

---

<div align="center">

<h3>Santiago Gutiérrez Morales · MCS @ University of Illinois Urbana-Champaign</h3>

<br />

<img src="assets/Recyclai_logo_white.png" alt="Recycl.ai" width="67" height="67" />

</div>