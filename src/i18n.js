import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
en: {
  translation: {
    settings: {
      title: "Settings",
      description: "Manage your TaskFlow account and preferences.",

      account: {
        title: "Account Settings",
        email: "Email address",
        emailHint: "Your login email for TaskFlow",
        status: "Account status",
        statusHint: "Your account is active and verified",
        password: "Password",
        passwordHint: "Update your account password",
        changePassword: "Change password",
      },

      appearance: {
        title: "Appearance",
        darkMode: "Dark mode",
        darkModeHint: "Use dark theme across the app",
      },

      language: "Language",
      languageHint: "Choose your preferred language",

      notifications: {
        title: "Notifications",
        email: "Email notifications",
        emailHint: "Receive updates about your account",
        reminders: "Task reminders",
        remindersHint: "Get reminded about upcoming tasks",
      },

      danger: {
        title: "Danger Zone",
        delete: "Delete account",
        deleteHint: "Permanently remove your account and all task data",
        confirmTitle: "Delete your account?",
        confirmMessage:
          "This action is permanent. Your TaskFlow account will be deleted.",
        enterPassword: "Enter your password to continue",
        cancel: "Cancel",
        deleting: "Deleting...",
        hidePassword: "Hide password",
        showPassword: "Show password",
      },
    },
  },
},

nl: {
  translation: {
    settings: {
      title: "Instellingen",
      description: "Beheer je TaskFlow-account en voorkeuren.",

      account: {
        title: "Accountinstellingen",
        email: "E-mailadres",
        emailHint: "Je inlog-e-mailadres voor TaskFlow",
        status: "Accountstatus",
        statusHint: "Je account is actief en geverifieerd",
        password: "Wachtwoord",
        passwordHint: "Werk je accountwachtwoord bij",
        changePassword: "Wachtwoord wijzigen",
      },

      appearance: {
        title: "Uiterlijk",
        darkMode: "Donkere modus",
        darkModeHint: "Gebruik een donker thema in de hele app",
      },

      language: "Taal",
      languageHint: "Kies je voorkeurstaal",

      notifications: {
        title: "Meldingen",
        email: "E-mailmeldingen",
        emailHint: "Ontvang updates over je account",
        reminders: "Taakherinneringen",
        remindersHint: "Ontvang herinneringen voor aankomende taken",
      },

      danger: {
        title: "Gevarenzone",
        delete: "Account verwijderen",
        deleteHint:
          "Verwijder je account en alle taakgegevens permanent",
        confirmTitle: "Je account verwijderen?",
        confirmMessage:
          "Deze actie is permanent. Je TaskFlow-account wordt verwijderd.",
        enterPassword: "Voer je wachtwoord in om door te gaan",
        cancel: "Annuleren",
        deleting: "Verwijderen...",
        hidePassword: "Wachtwoord verbergen",
        showPassword: "Wachtwoord tonen",
      },
    },
  },
},

ar: {
  translation: {
    settings: {
      title: "الإعدادات",
      description: "إدارة حسابك وتفضيلاتك في TaskFlow.",

      account: {
        title: "إعدادات الحساب",
        email: "عنوان البريد الإلكتروني",
        emailHint: "البريد الإلكتروني المستخدم لتسجيل الدخول إلى TaskFlow",
        status: "حالة الحساب",
        statusHint: "حسابك نشط وتم التحقق منه",
        password: "كلمة المرور",
        passwordHint: "تحديث كلمة مرور حسابك",
        changePassword: "تغيير كلمة المرور",
      },

      appearance: {
        title: "المظهر",
        darkMode: "الوضع الداكن",
        darkModeHint: "استخدام المظهر الداكن في جميع أنحاء التطبيق",
      },

      language: "اللغة",
      languageHint: "اختر لغتك المفضلة",

      notifications: {
        title: "الإشعارات",
        email: "إشعارات البريد الإلكتروني",
        emailHint: "تلقي تحديثات حول حسابك",
        reminders: "تذكيرات المهام",
        remindersHint: "الحصول على تذكيرات بالمهام القادمة",
      },

      danger: {
        title: "منطقة الخطر",
        delete: "حذف الحساب",
        deleteHint: "حذف حسابك وجميع بيانات المهام نهائيًا",
        confirmTitle: "هل تريد حذف حسابك؟",
        confirmMessage:
          "هذا الإجراء نهائي. سيتم حذف حسابك في TaskFlow.",
        enterPassword: "أدخل كلمة المرور للمتابعة",
        cancel: "إلغاء",
        deleting: "جارٍ الحذف...",
        hidePassword: "إخفاء كلمة المرور",
        showPassword: "إظهار كلمة المرور",
      },
    },
  },
},
};

i18n
  .use(initReactI18next)
  .init({
    resources,

    // Default language
    lng: "en",

    // Prevent showing the translation key if a translation is missing
    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;