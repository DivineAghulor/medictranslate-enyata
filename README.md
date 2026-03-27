# MedicTranslate

**MedicTranslate** is an accessible web application that helps people understand their lab test results from an image upload.  
Built for the [Buildathon by Enyata](https://buildathon.enyata.com/), the project aims to make health knowledge easier to access for people who cannot easily visit or afford a hospital consultation.

> ⚠️ **Important Notice**  
> MedicTranslate is for **health education and guidance only**. It is **not a replacement for licensed medical professionals**, emergency care, or formal diagnosis.

---


## Contibutors
1. Fisayo Obadina (Frontend Developer) [LinkedIn](https://linkedin.com/in/fisayobadina) 
2. Divine Aghulor (Backend Developer) [LinkedIn](https://www.linkedin.com/in/divine-aghulor-680544299/)

## 🌍 Problem

Many people receive lab reports that are difficult to interpret without medical training.  
For users in low-access or low-resource settings, this creates anxiety and delays in care decisions.

MedicTranslate addresses this by:
- extracting content from lab result images,
- translating medical terminology into clearer language,
- giving users understandable health insights,
- offering guidance on when to seek professional care.

---

## 💡 Solution Overview

MedicTranslate provides a simple workflow:

1. User uploads an image of a lab result.
2. The system processes and extracts relevant text/data.
3. The extracted information is interpreted in plain language.
4. The app returns easy-to-understand explanations and potential health implications.

---

## ✨ Key Features (Planned / In Progress)

- 📷 Upload lab test result images
- 🧠 Extract and parse medical values from reports
- 🗣️ Translate medical terms into user-friendly explanations
- 📊 Provide context around likely significance of values
- 🧭 Suggest next steps and when to seek hospital care
- 🌐 Accessible UI for broad user demographics

---

## 🧱 Project Structure

```medictranslate-enyata/README.md#L1-10
medictranslate-enyata/
├── api/          # Backend/API services (currently scaffolded)
└── web/          # Frontend web application (Next.js)
```

---

## 🛠️ Tech Stack

### Frontend (`web`)
- [Next.js](https://nextjs.org/) `16.x`
- [React](https://react.dev/) `19.x`
- TypeScript
- Tailwind CSS

### Backend (`api`)
- Directory exists and is ready for implementation of OCR/analysis/API logic.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm

### Run the Frontend

```medictranslate-enyata/README.md#L1-4
cd web
npm install
npm run dev
```

Then open: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Current Status

This repository is currently in early-stage hackathon development:
- Frontend is scaffolded and ready for feature implementation.
- API folder is prepared for backend services.
- Core product direction and use case are defined.

---

## 🔐 Ethics, Safety & Responsible Use

Because this project touches health information:

- Do not present outputs as guaranteed diagnoses.
- Always include a medical disclaimer in the UI.
- Encourage users to consult professionals for critical decisions.
- Treat user data as sensitive and apply privacy/security best practices.
- Avoid storing personal health data unless absolutely necessary.

---

## 🏁 Hackathon Context

This project is being built as a submission for:

**Buildathon by Enyata**  
🔗 https://buildathon.enyata.com/

---

## 🗺️ Roadmap

- [ ] Implement image upload and validation flow
- [ ] Add OCR pipeline for lab report text extraction
- [ ] Build interpretation engine for common lab markers
- [ ] Add multilingual/plain-language output options
- [ ] Add confidence scoring and “seek care now” escalation logic
- [ ] Improve accessibility and mobile responsiveness
- [ ] Add tests and monitoring

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before submitting changes.

---

## 📄 License

This project is currently unlicensed.  
For open-source collaboration, add a license file (for example, MIT) before public distribution.

---

## 👥 Team

Obsidian Team (Fisayo Obadina & Divine Aghulor) — Buildathon 2026 submission.
