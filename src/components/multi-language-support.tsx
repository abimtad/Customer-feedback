"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
};

const supportedLanguages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
];

// Sample translations for demonstration
const translations: Record<string, Record<string, string>> = {
  "feedback.title": {
    en: "Share Your Feedback",
    am: "ግብረመልስዎን ያጋሩ",
    ar: "شارك ملاحظاتك",
    zh: "分享您的反馈",
    fr: "Partagez vos commentaires",
    es: "Comparta sus comentarios",
    hi: "अपनी प्रतिक्रिया साझा करें",
    ru: "Поделитесь своим мнением",
  },
  "feedback.description": {
    en: "Your feedback helps us improve our service",
    am: "ግብረመልስዎ አገልግሎታችንን እንድናሻሽል ይረዳናል",
    ar: "تساعدنا ملاحظاتك على تحسين خدمتنا",
    zh: "您的反馈帮助我们改进服务",
    fr: "Vos commentaires nous aident à améliorer notre service",
    es: "Sus comentarios nos ayudan a mejorar nuestro servicio",
    hi: "आपकी प्रतिक्रिया हमें अपनी सेवा में सुधार करने में मदद करती है",
    ru: "Ваш отзыв помогает нам улучшить наш сервис",
  },
  "feedback.placeholder": {
    en: "Type your feedback here...",
    am: "ግብረመልስዎን እዚህ ይጻፉ...",
    ar: "اكتب ملاحظاتك هنا...",
    zh: "在此处输入您的反馈...",
    fr: "Tapez vos commentaires ici...",
    es: "Escriba sus comentarios aquí...",
    hi: "अपनी प्रतिक्रिया यहां लिखें...",
    ru: "Введите свой отзыв здесь...",
  },
  "feedback.submit": {
    en: "Submit Feedback",
    am: "ግብረመልስ ያስገቡ",
    ar: "إرسال التعليقات",
    zh: "提交反馈",
    fr: "Soumettre des commentaires",
    es: "Enviar comentarios",
    hi: "प्रतिक्रिया दें",
    ru: "Отправить отзыв",
  },
  "feedback.rating": {
    en: "Rate your experience",
    am: "ልምድዎን ይመዝኑ",
    ar: "قيم تجربتك",
    zh: "评价您的体验",
    fr: "Évaluez votre expérience",
    es: "Califique su experiencia",
    hi: "अपने अनुभव का मूल्यांकन करें",
    ru: "Оцените свой опыт",
  },
};

export function MultiLanguageSupport() {
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Function to get translated text
  const t = (key: string): string => {
    return (
      translations[key]?.[currentLanguage] || translations[key]?.["en"] || key
    );
  };

  // Get the current language object
  const getCurrentLanguage = (): Language => {
    return (
      supportedLanguages.find((lang) => lang.code === currentLanguage) ||
      supportedLanguages[0]
    );
  };

  // Set direction based on language
  useEffect(() => {
    const lang = getCurrentLanguage();
    document.documentElement.dir = lang.rtl ? "rtl" : "ltr";

    return () => {
      document.documentElement.dir = "ltr";
    };
  }, [currentLanguage]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            {t("feedback.title")}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            className="flex items-center"
          >
            <span className="mr-2">{getCurrentLanguage().flag}</span>
            <span>{getCurrentLanguage().name}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showLanguageSelector ? (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-3">
              Select Language / اختر اللغة / भाषा चुनें
            </h3>
            <RadioGroup
              value={currentLanguage}
              onValueChange={setCurrentLanguage}
              className="space-y-2"
            >
              {supportedLanguages.map((language) => (
                <div
                  key={language.code}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={language.code}
                    id={`lang-${language.code}`}
                  />
                  <Label
                    htmlFor={`lang-${language.code}`}
                    className="flex items-center"
                  >
                    <span className="mr-2">{language.flag}</span>
                    <span className="mr-2">{language.name}</span>
                    <span className="text-sm text-gray-500">
                      {language.nativeName}
                    </span>
                    {currentLanguage === language.code && (
                      <Check className="h-4 w-4 ml-2 text-green-500" />
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                onClick={() => setShowLanguageSelector(false)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {t("feedback.submit")}
              </Button>
            </div>
          </div>
        ) : (
          <div className={getCurrentLanguage().rtl ? "text-right" : ""}>
            <p className="text-gray-600 mb-4">{t("feedback.description")}</p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  {t("feedback.rating")}
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="text-2xl text-yellow-400 hover:text-yellow-500"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className={`w-full p-3 border rounded-md ${
                  getCurrentLanguage().rtl ? "text-right" : ""
                }`}
                rows={4}
                placeholder={t("feedback.placeholder")}
              ></textarea>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                {t("feedback.submit")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
