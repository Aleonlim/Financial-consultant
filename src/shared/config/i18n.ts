import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ru from './locales/ru.json'
import zh from './locales/zh.json'

i18n.use(initReactI18next).init({
  resources: {
    ru: {
      translation: ru,
    },
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
  },
  lng: localStorage.getItem('lang') || 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
