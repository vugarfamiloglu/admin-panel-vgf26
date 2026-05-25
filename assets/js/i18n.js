/* ----------------------------------------------------------------------
 * i18n — AZ / EN / RU
 *
 * Keys are scoped by area (sidebar.*, topbar.*, page.* etc.).
 * Locale is persisted to localStorage('vgf26-lang').
 *
 *   I18n.t('topbar.search')
 *   I18n.setLang('az')
 *   I18n.onChange(cb)            -> unsubscribe()
 * ---------------------------------------------------------------------- */
(function (global) {
  'use strict';

  const STR = {
    en: {
      'app.tagline':         'Iridescent Admin Studio',
      'app.pro_plan':        'Pro Plan',

      'topbar.search':       'Search anything…',
      'topbar.search_hint':  'Search docs, pages, components',
      'topbar.notifications':'Notifications',
      'topbar.messages':     'Messages',
      'topbar.fullscreen':   'Fullscreen',
      'topbar.theme.light':  'Switch to light mode',
      'topbar.theme.dark':   'Switch to dark mode',
      'topbar.lang':         'Language',
      'topbar.profile':      'Profile',
      'topbar.command':      'Command palette',

      'common.dashboard':    'Dashboard',
      'common.cancel':       'Cancel',
      'common.save':         'Save',
      'common.delete':       'Delete',
      'common.confirm':      'Confirm',
      'common.create':       'Create',
      'common.apply':        'Apply',
      'common.export':       'Export',
      'common.filter':       'Filter',
      'common.search':       'Search',
      'common.signin':       'Sign in',
      'common.signup':       'Sign up',
      'common.signout':      'Sign out',
      'common.copy':         'Copy',
      'common.copied':       'Copied to clipboard',
      'common.edit':         'Edit',
      'common.preview':      'Preview',
      'common.code':         'Code',
      'common.usage':        'Usage',
      'common.example':      'Example',
      'common.variants':     'Variants',

      'sidebar.section.overview':   'Overview',
      'sidebar.section.layout':     'Layout & Containers',
      'sidebar.section.data':       'Data Display',
      'sidebar.section.media':      'Media & Gallery',
      'sidebar.section.forms':      'Forms & Input',
      'sidebar.section.nav':        'Navigation',
      'sidebar.section.overlays':   'Overlays & Feedback',
      'sidebar.section.effects':    'Effects & Motion',
      'sidebar.section.charts':     'Charts & Data Viz',
      'sidebar.section.dashboards': 'Dashboards',
      'sidebar.section.commerce':   'Commerce & SaaS',
      'sidebar.section.pages':      'Landing & Marketing',
      'sidebar.section.auth':       'Auth & Errors',
      'sidebar.section.inspired':   'Inspired UIs',
      'sidebar.section.specialty':  'Specialty Widgets',
      'sidebar.section.system':     'System',
      'sidebar.search_placeholder': 'Search menu…',

      'footer.copy':         '© 2026 VGF26 — Iridescent Admin Studio',
      'footer.version':      'v1.0.0 · MIT License',

      'home.hero.title':     'Welcome back, Vugar',
      'home.hero.sub':       'Here\'s your studio overview. Pick a component category from the sidebar to start exploring.',
      'home.stats.users':    'Active Users',
      'home.stats.revenue':  'Monthly Revenue',
      'home.stats.orders':   'New Orders',
      'home.stats.uptime':   'Uptime',

      'msg.toast.demo':      'This is a sample toast notification',
      'msg.modal.demo_title':'Sample dialog',
      'msg.modal.demo_body': 'Modals open via React-style portal logic and lock the underlying scroll. Press ESC or click outside to dismiss.',
    },

    az: {
      'app.tagline':         'İridessent Admin Studio',
      'app.pro_plan':        'Pro Plan',

      'topbar.search':       'Hər şey üçün axtarış…',
      'topbar.search_hint':  'Sənədlər, səhifələr, komponentlər',
      'topbar.notifications':'Bildirişlər',
      'topbar.messages':     'Mesajlar',
      'topbar.fullscreen':   'Tam ekran',
      'topbar.theme.light':  'İşıqlı rejimə keç',
      'topbar.theme.dark':   'Qaranlıq rejimə keç',
      'topbar.lang':         'Dil',
      'topbar.profile':      'Profil',
      'topbar.command':      'Komanda paneli',

      'common.dashboard':    'İdarə paneli',
      'common.cancel':       'Ləğv et',
      'common.save':         'Yadda saxla',
      'common.delete':       'Sil',
      'common.confirm':      'Təsdiqlə',
      'common.create':       'Yarat',
      'common.apply':        'Tətbiq et',
      'common.export':       'İxrac et',
      'common.filter':       'Filtr',
      'common.search':       'Axtar',
      'common.signin':       'Daxil ol',
      'common.signup':       'Qeydiyyat',
      'common.signout':      'Çıxış',
      'common.copy':         'Köçür',
      'common.copied':       'Lövhəyə köçürüldü',
      'common.edit':         'Redaktə et',
      'common.preview':      'Önbaxış',
      'common.code':         'Kod',
      'common.usage':        'İstifadə',
      'common.example':      'Nümunə',
      'common.variants':     'Variantlar',

      'sidebar.section.overview':   'İcmal',
      'sidebar.section.layout':     'Layout və Konteynerlər',
      'sidebar.section.data':       'Məlumat Təqdimatı',
      'sidebar.section.media':      'Media və Qalereya',
      'sidebar.section.forms':      'Formalar və Giriş',
      'sidebar.section.nav':        'Naviqasiya',
      'sidebar.section.overlays':   'Pəncərələr və Bildirişlər',
      'sidebar.section.effects':    'Effektlər və Animasiyalar',
      'sidebar.section.charts':     'Qrafiklər və Vizualizasiya',
      'sidebar.section.dashboards': 'Dashboard-lar',
      'sidebar.section.commerce':   'Ticarət və SaaS',
      'sidebar.section.pages':      'Landing və Marketinq',
      'sidebar.section.auth':       'Giriş və Xəta',
      'sidebar.section.inspired':   'İlhamlanmış UI-lar',
      'sidebar.section.specialty':  'Xüsusi Vidcetlər',
      'sidebar.section.system':     'Sistem',
      'sidebar.search_placeholder': 'Menyuda axtarış…',

      'footer.copy':         '© 2026 VGF26 — İridessent Admin Studio',
      'footer.version':      'v1.0.0 · MIT Lisenziyası',

      'home.hero.title':     'Xoş gəldin, Vugar',
      'home.hero.sub':       'Studio icmalı buradadır. Komponent kateqoriyasını sol menyudan seç.',
      'home.stats.users':    'Aktiv İstifadəçi',
      'home.stats.revenue':  'Aylıq Gəlir',
      'home.stats.orders':   'Yeni Sifariş',
      'home.stats.uptime':   'İş Müddəti',

      'msg.toast.demo':      'Bu nümunə toast bildirişidir',
      'msg.modal.demo_title':'Nümunə dialoq',
      'msg.modal.demo_body': 'Modal pəncərələr portal məntiqi ilə açılır və alt scroll-u dayandırır. ESC basın və ya kənara klikləyin.',
    },

    ru: {
      'app.tagline':         'Радужная админ-студия',
      'app.pro_plan':        'Pro План',

      'topbar.search':       'Найти что угодно…',
      'topbar.search_hint':  'Документация, страницы, компоненты',
      'topbar.notifications':'Уведомления',
      'topbar.messages':     'Сообщения',
      'topbar.fullscreen':   'Полный экран',
      'topbar.theme.light':  'Светлая тема',
      'topbar.theme.dark':   'Тёмная тема',
      'topbar.lang':         'Язык',
      'topbar.profile':      'Профиль',
      'topbar.command':      'Командная палитра',

      'common.dashboard':    'Панель',
      'common.cancel':       'Отмена',
      'common.save':         'Сохранить',
      'common.delete':       'Удалить',
      'common.confirm':      'Подтвердить',
      'common.create':       'Создать',
      'common.apply':        'Применить',
      'common.export':       'Экспорт',
      'common.filter':       'Фильтр',
      'common.search':       'Поиск',
      'common.signin':       'Войти',
      'common.signup':       'Регистрация',
      'common.signout':      'Выйти',
      'common.copy':         'Копировать',
      'common.copied':       'Скопировано в буфер',
      'common.edit':         'Редактировать',
      'common.preview':      'Превью',
      'common.code':         'Код',
      'common.usage':        'Использование',
      'common.example':      'Пример',
      'common.variants':     'Варианты',

      'sidebar.section.overview':   'Обзор',
      'sidebar.section.layout':     'Макет и Контейнеры',
      'sidebar.section.data':       'Отображение данных',
      'sidebar.section.media':      'Медиа и Галерея',
      'sidebar.section.forms':      'Формы и Ввод',
      'sidebar.section.nav':        'Навигация',
      'sidebar.section.overlays':   'Окна и Уведомления',
      'sidebar.section.effects':    'Эффекты и Анимации',
      'sidebar.section.charts':     'Графики и Виз.',
      'sidebar.section.dashboards': 'Панели',
      'sidebar.section.commerce':   'Коммерция и SaaS',
      'sidebar.section.pages':      'Лендинги и Маркетинг',
      'sidebar.section.auth':       'Авторизация и Ошибки',
      'sidebar.section.inspired':   'Вдохновлённые UI',
      'sidebar.section.specialty':  'Спец. виджеты',
      'sidebar.section.system':     'Система',
      'sidebar.search_placeholder': 'Поиск в меню…',

      'footer.copy':         '© 2026 VGF26 — Радужная админ-студия',
      'footer.version':      'v1.0.0 · MIT Лицензия',

      'home.hero.title':     'С возвращением, Вугар',
      'home.hero.sub':       'Обзор студии. Выберите категорию компонентов в боковом меню.',
      'home.stats.users':    'Активные пользователи',
      'home.stats.revenue':  'Месячный доход',
      'home.stats.orders':   'Новые заказы',
      'home.stats.uptime':   'Время работы',

      'msg.toast.demo':      'Это образец toast-уведомления',
      'msg.modal.demo_title':'Пример диалога',
      'msg.modal.demo_body': 'Модальные окна открываются через портал и блокируют прокрутку. ESC или клик вне окна закрывает.',
    },
  };

  let currentLang = 'en';
  const listeners = new Set();

  function setLang(lang) {
    if (!STR[lang]) return;
    currentLang = lang;
    try { localStorage.setItem('vgf26-lang', lang); } catch (_) {}
    document.documentElement.setAttribute('lang', lang);
    listeners.forEach((fn) => { try { fn(lang); } catch (_) {} });
  }

  function getLang() { return currentLang; }

  function t(key, fallback) {
    return (STR[currentLang] && STR[currentLang][key])
        || (STR.en && STR.en[key])
        || fallback
        || key;
  }

  function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

  /* Init from storage. */
  try {
    const stored = localStorage.getItem('vgf26-lang');
    if (stored && STR[stored]) currentLang = stored;
  } catch (_) {}
  document.documentElement.setAttribute('lang', currentLang);

  global.I18n = { t, setLang, getLang, onChange, supported: Object.keys(STR) };
})(window);
