

import { useLanguage } from "../context/LanguageContext";

export default function LanguageSettings() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div>
      <h3>Language Preferences</h3>
      <p style={{ color: "#666", marginBottom: "16px" }}>
        Choose your preferred language
      </p>

      {[
        ["en", "English"],
        ["te", "తెలుగు"],
        ["hi", "हिंदी"],
        ["ta", "தமிழ்"],
        ["kn", "ಕನ್ನಡ"],
        ["ml", "മലയാളം"],
      ].map(([code, label]) => (
        <label key={code} style={{ display: "block", marginBottom: 8 }}>
          <input
            type="radio"
            checked={language === code}
            onChange={() => changeLanguage(code)}
          />
          {" "}{label}
        </label>
      ))}
    </div>
  );
}
