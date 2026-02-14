import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import de from './locales/de.json';

// Get stored language preference
const storedLanguage = localStorage.getItem('selected_language');
const lng = storedLanguage && storedLanguage !== 'browser' ? storedLanguage : undefined;

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            de: { translation: de }
        },
        lng, // Use stored language if available, otherwise LanguageDetector will determine it
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React already escapes values
        }
    });

export default i18n;
