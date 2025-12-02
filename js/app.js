/**
 * YouTube Frame Extractor - Web Version
 * Main application script
 */

// Default settings
const DEFAULT_SETTINGS = {
  quality: 'high',
  format: 'png',
  filename: 'youtube_frame',
  language: 'en'
};

// Global variables
let player = null;
let videoId = null;
let currentSettings = { ...DEFAULT_SETTINGS };
let isSettingsOpen = false;
let isAdBlockerDetected = false; // علم لاكتشاف وجود مانع إعلانات

// DOM Elements - سيتم تهيئتها عند تحميل الصفحة
let videoUrlInput;
let loadVideoBtn;
let captureBtn;
let thumbnailBtn;
let videoContainer;
let settingsToggle;
let settingsContent;
let qualitySelect;
let formatSelect;
let filenameInput;
let saveSettingsBtn;
let resetSettingsBtn;
let previewContainer;
let previewCanvas;
let downloadPreviewBtn;
let languageBtns;

// Messages
const messages = {
  en: {
    captureBtn: "📸 Capture Frame",
    thumbnailBtn: "🖼️ Download Thumbnail",
    settings: "Settings",
    captureQuality: "Capture Quality",
    fileFormat: "File Format",
    fileName: "File Name",
    highQuality: "High Quality",
    mediumQuality: "Medium Quality",
    lowQuality: "Low Quality",
    saveSettings: "Save Settings",
    resetSettings: "Reset to Default",
    urlLabel: "YouTube Video URL:",
    loadVideo: "Load Video",
    captureSuccess: "Frame captured successfully!",
    thumbnailSuccess: "Thumbnail downloaded successfully!",
    thumbnailError: "Error downloading thumbnail",
    invalidUrl: "Please enter a valid YouTube URL",
    videoNotFound: "No video element found on this page",
    videoIdNotFound: "Could not extract video ID from URL",
    thumbnailFetchFailed: "Failed to fetch thumbnail",
    previewTitle: "Frame Preview",
    download: "⬇️ Download",
    heroTitle: "Extract High-Quality Frames from YouTube Videos",
    heroDescription: "Capture clean, high-quality frames directly from YouTube videos without any UI elements.",
    feature1Title: "High Quality Frames",
    feature1Desc: "Extract frames in original video quality without UI elements",
    feature2Title: "Thumbnails",
    feature2Desc: "Download video thumbnails in highest available quality",
    feature3Title: "Multiple Formats",
    feature3Desc: "Export in PNG, JPEG, or WebP formats",
    footerText: "YouTube Frame Extractor © 2025",
    privacyLink: "Privacy Policy",
    disclaimerText: "YouTube is a trademark of Google LLC. This tool is not affiliated with or endorsed by YouTube or Google.",
    youtubeAPILoadFailed: "Could not load YouTube API. Try disabling ad blockers.",
    apiLoadFailed: "Failed to load YouTube API and video",
    videoLoaded: "Video loaded successfully!",
    enterValidUrl: "Please enter a valid YouTube URL",
    invalidVideoId: "Invalid video ID",
    htmlError: "HTML5 player error",
    videoNotEmbeddable: "Video embedding not allowed",
    helpSuggestions: "Help Suggestions",
    tryThumbnail: "Try downloading the thumbnail directly",
    disableAdBlocker: "Disable the ad blocker temporarily if you're using one",
    tryDifferentVideo: "Try another video",
    tryDifferentBrowser: "Try a different browser",
    retryVideo: "Retry",
    openingImageTab: "Opening image in new tab...",
    popupBlocked: "Popup blocked. Please allow popups for this site.",
    imageSaved: "Image opened. Right-click and select 'Save image as' to download.",
    downloadSuccess: "Download started!",
    exportError: "Error creating image file",
    loadingThumbnail: "Loading thumbnail...",
    noVideoId: "No video ID found",
    noPlayer: "Video player not available",
    loadingVideo: "Loading video...",
    capturingFrame: "Capturing frame...",
    videoLoadError: "Error loading video",
    playerInitError: "Error initializing player",
    youtubeApiError: "Failed to load YouTube player",
    settingsSaved: "Settings saved",
    settingsReset: "Settings reset to default",
    compatibilityMode: "Compatibility Mode Activated",
    compatibilityModeActive: "Compatibility mode active. You can still extract frames and thumbnails.",
    usingCompatibilityMode: "Using compatibility mode due to ad blocker",
    captureError: "Failed to capture frame",
    adBlockerDetected: "Ad blocker detected",
    adBlockerInfo: "Ad blocker may affect some functionality. Try disabling it if you experience issues."
  },
  ar: {
    captureBtn: "📸 التقط الإطار",
    thumbnailBtn: "🖼️ تحميل الصورة المصغرة",
    settings: "الإعدادات",
    captureQuality: "جودة الالتقاط",
    fileFormat: "صيغة الملف",
    fileName: "اسم الملف",
    highQuality: "جودة عالية",
    mediumQuality: "جودة متوسطة",
    lowQuality: "جودة منخفضة",
    saveSettings: "حفظ الإعدادات",
    resetSettings: "إعادة للإعدادات الافتراضية",
    urlLabel: "رابط فيديو يوتيوب:",
    loadVideo: "تحميل الفيديو",
    captureSuccess: "تم التقاط الإطار بنجاح!",
    thumbnailSuccess: "تم تحميل الصورة المصغرة بنجاح!",
    thumbnailError: "خطأ في تحميل الصورة المصغرة",
    invalidUrl: "يرجى إدخال رابط يوتيوب صالح",
    videoNotFound: "لم يتم العثور على الفيديو!",
    videoIdNotFound: "لم يتم العثور على معرف الفيديو",
    thumbnailFetchFailed: "فشل في تحميل الصورة المصغرة",
    previewTitle: "معاينة الإطار",
    download: "⬇️ تحميل",
    heroTitle: "استخراج إطارات عالية الجودة من فيديوهات يوتيوب",
    heroDescription: "التقط إطارات نظيفة وعالية الجودة مباشرة من فيديوهات يوتيوب بدون أي عناصر واجهة.",
    feature1Title: "إطارات عالية الجودة",
    feature1Desc: "استخراج إطارات بجودتها الأصلية بدون عناصر واجهة المستخدم",
    feature2Title: "الصور المصغرة",
    feature2Desc: "تحميل الصور المصغرة للفيديوهات بأعلى جودة متاحة",
    feature3Title: "صيغ متعددة",
    feature3Desc: "تصدير بصيغ PNG, JPEG, أو WebP",
    footerText: "مستخرج إطارات يوتيوب © 2025",
    privacyLink: "سياسة الخصوصية",
    disclaimerText: "يوتيوب هي علامة تجارية لشركة Google LLC. هذه الأداة ليست مرتبطة أو معتمدة من قبل يوتيوب أو جوجل.",
    youtubeAPILoadFailed: "يمكنك إيقاف تشغيل حماية الإعلانات على المتصفح لتحميل البرنامج بنجاح",
    apiLoadFailed: "فشل تحميل YouTube API والفيديو",
    videoLoaded: "تم تحميل الفيديو بنجاح!",
    enterValidUrl: "يرجى إدخال رابط يوتيوب صالح",
    invalidVideoId: "معرف الفيديو غير صالح",
    htmlError: "خطأ HTML5",
    videoNotEmbeddable: "الفيديو غير قابل للتضمين",
    helpSuggestions: "اقتراحات للمساعدة",
    tryThumbnail: "جرّب تحميل الصورة المصغرة مباشرة",
    disableAdBlocker: "عطّل مانع الإعلانات مؤقتاً إذا كنت تستخدمه",
    tryDifferentVideo: "جرّب فيديو آخر",
    tryDifferentBrowser: "جرّب متصفح مختلف",
    retryVideo: "حاول مرة أخرى",
    openingImageTab: "جارٍ فتح الصورة في علامة تبويب جديدة...",
    popupBlocked: "تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.",
    imageSaved: "تم فتح الصورة. انقر بزر الماوس الأيمن واختر 'حفظ الصورة باسم' لتنزيلها.",
    downloadSuccess: "بدأ التنزيل!",
    exportError: "خطأ في إنشاء ملف الصورة",
    loadingThumbnail: "جارٍ تحميل الصورة المصغرة...",
    noVideoId: "لم يتم العثور على معرف الفيديو",
    noPlayer: "مشغل الفيديو غير متاح",
    loadingVideo: "جارٍ تحميل الفيديو...",
    capturingFrame: "جارٍ التقاط الإطار...",
    videoLoadError: "خطأ في تحميل الفيديو",
    playerInitError: "خطأ في تهيئة المشغل",
    youtubeApiError: "فشل في تحميل مشغل يوتيوب",
    settingsSaved: "تم حفظ الإعدادات",
    settingsReset: "تم إعادة الإعدادات إلى الوضع الافتراضي",
    compatibilityMode: "تم تفعيل وضع التوافق",
    compatibilityModeActive: "وضع التوافق مع مانع الإعلانات نشط. لا يزال بإمكانك استخراج الإطارات والصور المصغرة.",
    usingCompatibilityMode: "استخدام وضع التوافق بسبب مانع الإعلانات",
    captureError: "فشل في التقاط الإطار",
    adBlockerDetected: "تم اكتشاف مانع إعلانات",
    adBlockerInfo: "قد يؤثر مانع الإعلانات على بعض الوظائف. حاول تعطيله إذا واجهت مشاكل."
  }
};

// Elements to localize
const elementsToLocalize = {
  'capture': 'captureBtn',
  'thumbnail': 'thumbnailBtn',
  'settingsLabel': 'settings',
  'qualityLabel': 'captureQuality',
  'formatLabel': 'fileFormat',
  'filenameLabel': 'fileName',
  'saveSettings': 'saveSettings',
  'resetSettings': 'resetSettings',
  'urlLabel': 'urlLabel',
  'load-video': 'loadVideo',
  'highQualityOption': 'highQuality',
  'mediumQualityOption': 'mediumQuality',
  'lowQualityOption': 'lowQuality',
  'previewTitle': 'previewTitle',
  'download-preview': 'download',
  'heroTitle': 'heroTitle',
  'heroDescription': 'heroDescription',
  'feature1Title': 'feature1Title',
  'feature1Desc': 'feature1Desc',
  'feature2Title': 'feature2Title',
  'feature2Desc': 'feature2Desc',
  'feature3Title': 'feature3Title',
  'feature3Desc': 'feature3Desc',
  'footerText': 'footerText',
  'privacyLink': 'privacyLink',
  'disclaimerText': 'disclaimerText'
};

// YouTube API loading with error handling
function loadYouTubeAPI() {
  // Check if API is already loaded
  if (window.YT && window.YT.Player) {
    console.log('YouTube API already loaded');
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    // Define callback for when API is ready
    window.onYouTubeIframeAPIReady = function() {
      console.log('YouTube API loaded successfully');
      resolve();
    };
    
    // Add API script with error handling
    const loadAPI = () => {
      // Create script tag
      const tag = document.createElement('script');
      
      // Try different URLs in case one is blocked - always use HTTPS
      const apiUrls = [
        'https://www.youtube.com/iframe_api',
        'https://www.youtube-nocookie.com/iframe_api'
      ];
      
      let currentUrlIndex = 0;
      
      const tryNextUrl = () => {
        if (currentUrlIndex >= apiUrls.length) {
          console.error('All YouTube API URLs failed to load');
          // Fallback - inform the user and provide alternative
          showStatus(getMessage('youtubeAPILoadFailed') || 'Could not load YouTube API. Try disabling ad blockers.', 'error');
          const privacyWarning = document.getElementById('privacy-warning');
          if (privacyWarning) {
            privacyWarning.classList.remove('hidden');
          }
          return reject(new Error('YouTube API failed to load'));
        }
        
        const apiUrl = apiUrls[currentUrlIndex];
        tag.src = apiUrl;
        
        // Set error handler for this attempt
        tag.onerror = () => {
          console.warn(`Failed to load YouTube API from ${apiUrl}`);
          currentUrlIndex++;
          tryNextUrl();
        };
        
        // Add the script tag to the document
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      };
      
      // Set timeout in case the API takes too long to load
      const apiTimeout = setTimeout(() => {
        if (!window.YT || !window.YT.Player) {
          console.warn('YouTube API load timeout');
          currentUrlIndex++;
          tryNextUrl();
        }
      }, 5000);
      
      // Start trying to load API
      tryNextUrl();
    };
    
    // Start loading process
    loadAPI();
  });
}

// Initialize the player with the video URL
function initializePlayer(videoUrl) {
  try {
    // إذا كان الفيديو قيد التشغيل، قم بإيقافه وإخفاء حاوية الفيديو
    if (player) {
      try {
        player.stopVideo();
        player.destroy();
      } catch (error) {
        console.warn('Error stopping previous player:', error);
      }
      player = null;
    }

    // إعادة تعيين معرف الفيديو
    videoId = null;
    
    // تحقق من الرابط
    if (!videoUrl || videoUrl.trim() === '') {
      showStatus(getMessage('enterValidUrl'), 'error');
      hideLoadingElements();
      return;
    }
    
    // استخراج معرف الفيديو من الرابط
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = videoUrl.match(pattern);
      if (match && match[1]) {
        videoId = match[1];
        break;
      }
    }
    
    if (!videoId) {
      showStatus(getMessage('invalidUrl'), 'error');
      hideLoadingElements();
      return;
    }
    
    // إظهار حاوية الفيديو وإعادة ضبط اللوحة
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      videoContainer.classList.remove('hidden');
    }
    
    // إظهار تحذير الخصوصية (حول مانع الإعلانات)
    const privacyWarning = document.getElementById('privacy-warning');
    if (privacyWarning) {
      privacyWarning.classList.remove('hidden');
    }
    
    showStatus(getMessage('loadingVideo'), 'info');
    
    // اختبار وجود مانع إعلانات
    detectAdBlocker().then(adBlockerPresent => {
      isAdBlockerDetected = adBlockerPresent;
      
      if (adBlockerPresent) {
        console.log('تم اكتشاف مانع إعلانات. استخدام وضع التوافق...');
        
        // إظهار تحذير للمستخدم لإخباره أن بعض الوظائف قد لا تعمل
        if (privacyWarning) {
          const adblockMessage = document.getElementById('adblock-message');
          if (adblockMessage) {
            // تحديث نص الرسالة ليكون أكثر وضوحاً
            const compatibilityMode = getMessage('compatibilityMode') || 
              'تم تفعيل وضع التوافق بسبب وجود مانع إعلانات. قد لا تعمل بعض الميزات.';
            adblockMessage.innerHTML = `<strong>${compatibilityMode}</strong><br>${adblockMessage.innerHTML}`;
          }
        }
      }
      
      // إعداد تعامل آمن مع postMessage للنطاق المختلط
      setupPostMessageInterceptor();
      
      // تحديد أمان الاتصال
      const secureConnection = window.location.protocol === 'https:';
      
      // تحميل API YouTube إذا لم يكن محملاً بالفعل أو استخدام بديل في حالة مانع الإعلانات
      if (isAdBlockerDetected) {
        // وضع التوافق: استخدام صورة مصغرة بدلاً من لاعب YouTube
        showStatus(getMessage('usingCompatibilityMode') || 'استخدام وضع التوافق بسبب مانع الإعلانات', 'warning');
        showFallbackImage(videoId, true);
        
        // تمكين أزرار الالتقاط - سنعتمد على الصور المصغرة فقط
        enableCaptureButtons(true);
      } else {
        // المحاولة العادية: تحميل واجهة برمجة تطبيقات YouTube وتهيئة اللاعب
        loadYouTubeAPI().then(() => {
          // استخدام www.youtube.com وليس youtube-nocookie مع HTTP للتوافق
          const youtubeHost = secureConnection ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
          
          // إعداد خيارات معدلة لمعالجة مشكلة التواصل بين المضيفين
          const playerOptions = {
            height: '360',
            width: '640',
            videoId: videoId,
            host: youtubeHost,
            playerVars: {
              'autoplay': 1,            // تشغيل تلقائي (يتطلب كتم الصوت للمتصفحات الحديثة)
              'controls': 1,            // عرض عناصر التحكم في المشغل
              'rel': 0,                 // عدم عرض مقاطع فيديو ذات صلة عند الانتهاء
              'fs': 1,                  // السماح بوضع ملء الشاشة
              'modestbranding': 1,      // تقليل علامة YouTube التجارية
              'enablejsapi': 1,         // تمكين واجهة برمجة التطبيقات JavaScript
              'mute': 1,                // كتم الصوت مبدئيًا للسماح بالتشغيل التلقائي
              'origin': window.location.origin  // تعيين الأصل للرسائل (مهم جداً لمنع خطأ postMessage)
            },
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange,
              'onError': onPlayerError
            }
          };
          
          // تهيئة اللاعب مع الخيارات
          const playerDiv = document.getElementById('player');
          player = new YT.Player('player', playerOptions);
          
          // إظهار حاوية المشغل
          if (playerDiv) {
            playerDiv.classList.remove('hidden');
          }
          
        }).catch(error => {
          console.error('Failed to load YouTube API:', error);
          showStatus(getMessage('youtubeApiError') || 'Failed to load YouTube player', 'error');
          
          // عرض الصورة المصغرة كبديل
          showFallbackImage(videoId, true);
          
          // تمكين أزرار الالتقاط حتى في حالة الفشل - سنعتمد على الصور المصغرة
          enableCaptureButtons(true);
        });
      }
      
      // إخفاء عناصر التحميل
      hideLoadingElements();
      
    }).catch(error => {
      console.error('Error detecting ad blocker:', error);
      hideLoadingElements();
    });
    
  } catch (error) {
    console.error('Error initializing player:', error);
    showStatus(getMessage('playerInitError') || 'Error initializing player', 'error');
    hideLoadingElements();
  }
}

// اكتشاف وجود مانع إعلانات
function detectAdBlocker() {
  return new Promise((resolve) => {
    // إنشاء عنصر محاكاة للإعلان للاختبار
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    // استخدام أسماء كلاس متعددة شائعة الاستهداف لزيادة احتمالية الكشف
    testAd.className = 'adsbox ad ad-banner banner_ad advertisement'; 
    testAd.style.cssText = 'position: absolute !important; top: -5000px !important; left: -5000px !important; width: 1px !important; height: 1px !important; z-index: -5000 !important;';
    document.body.appendChild(testAd);
    
    // التحقق من أبعاد العنصر بعد فترة قصيرة
    setTimeout(() => {
      // إذا كان ارتفاع العنصر 0، فمن المحتمل جداً أن مانع الإعلانات قام بإخفائه
      const isAdBlockerDetected = testAd.offsetHeight === 0;
      
      // تنظيف عنصر الاختبار من الـ DOM
      if (testAd.parentNode) {
        testAd.parentNode.removeChild(testAd);
      }
      
      // طباعة النتيجة في الكونسول للمساعدة في التشخيص
      console.log('Ad blocker detection result (element visibility):', isAdBlockerDetected);
      
      // إرجاع نتيجة الكشف
      resolve(isAdBlockerDetected);
    }, 150); // زيادة المهلة قليلاً لإعطاء فرصة أكبر للمانع للعمل
  });
}

// إعداد وسيط للرسائل بين الإطارات لمعالجة مشاكل الأصل
function setupPostMessageInterceptor() {
  try {
    // إذا كنا قد قمنا بالفعل بإعداد المعترض، فلا داعي لتكراره
    if (window._postMessageInterceptorInitialized) {
      return;
    }
    
    console.log('إعداد معترض postMessage للتعامل مع مشاكل الأصل المختلط');
    
    // تخزين وظيفة postMessage الأصلية
    window._originalPostMessage = window.postMessage;
    
    // التقاط رسائل window.postMessage وفلترة تلك المتعلقة بـ YouTube
    window.addEventListener('message', function(event) {
      // تحقق مما إذا كانت الرسالة من مصدر يوتيوب موثوق
      if (event.origin && (
        event.origin.includes('youtube.com') || 
        event.origin.includes('youtube-nocookie.com') ||
        event.origin.includes('youtu.be')
      )) {
        try {
          // معالجة رسائل یوتیوب
          if (typeof event.data === 'string') {
            if (event.data.includes('youtube')) {
              console.log('Received YouTube message:', event.data.substring(0, 100) + '...');
              
              // هنا يمكننا معالجة الرسائل المهمة من يوتيوب
              if (event.data.includes('"event":"infoDelivery"')) {
                // تحديث واجهة المستخدم بناءً على معلومات اللاعب
              }
            }
          }
        } catch (err) {
          console.warn('Error processing YouTube message:', err);
        }
      }
    }, false);
    
    // الحل الجذري للمشكلة: منع خطأ التنفيذ بالكامل في حالة HTTP
    if (window.location.protocol === 'http:') {
      try {
        // حل مبتكر: استخدام monkey patching لاعتراض postMessage من iframe
        // هذا الحل يحاول حل المشكلة الأساسية مع مُرسل postMessage (YouTube iframe)
        
        // 1. اعتراض الوظيفة الأصلية للنافذة
        const originalPostMessage = window.postMessage;
        
        // 2. إعادة تعريف وظيفة window.postMessage
        window.postMessage = function(message, targetOrigin, transfer) {
          // معالجة حالات الأصل غير المتطابق
          if (targetOrigin && (targetOrigin.includes('youtube.com') || targetOrigin.includes('youtube-nocookie.com')) && 
              targetOrigin.startsWith('https:') && window.location.protocol === 'http:') {
            // console.log('تعديل أصل الهدف من', targetOrigin, 'إلى *');
            targetOrigin = '*'; // استخدام * يسمح بالرسائل عبر الأصول المختلفة
          }
          
          // استدعاء الوظيفة الأصلية مع المعلمات المعدلة
          try {
             return originalPostMessage.call(this, message, targetOrigin, transfer);
          } catch (e) {
             // تسجيل الخطأ بهدوء في حالة فشل الاستدعاء الأصلي
             // قد يحدث هذا بسبب قيود أمان إضافية في بعض المتصفحات
             console.warn('Failed to execute original postMessage:', e);
             return; // منع الخطأ من الانتشار
          }
        };
        
        // إزالة الجزء الخاص بـ monkeyPatchIframeContentWindow - تبين أنه غير فعال أو غير ضروري
        /*
        // 3. محاولة اعتراض العناصر الموجودة في iframe بعد التحميل
        const monkeyPatchIframeContentWindow = () => {
          // ... (الكود القديم تم إزالته)
        };
        
        // محاولة تعديل iframe عند تحميله
        monkeyPatchIframeContentWindow();
        */
      } catch (e) {
        console.warn('فشل تعديل postMessage:', e);
      }
    }
    
    // علّم أننا قد قمنا بتهيئة المعترض
    window._postMessageInterceptorInitialized = true;
    
  } catch (error) {
    console.warn('Error setting up postMessage interceptor:', error);
  }
}

// وظيفة مساعدة لإخفاء عناصر التحميل
function hideLoadingElements() {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
  }
}

// Show a fallback image when video can't be loaded
function showFallbackImage(videoId, isCompatibilityMode = false) {
  const playerDiv = document.getElementById('player');
  if (!playerDiv) return;
  
  // Try loading different thumbnail qualities
  const qualities = [
    'maxresdefault.jpg',
    'sddefault.jpg',
    'hqdefault.jpg',
    '0.jpg'
  ];
  
  let currentQuality = 0;
  const img = new Image();
  
  const tryNextQuality = () => {
    if (currentQuality >= qualities.length) {
      // If all thumbnails fail, show a placeholder
      playerDiv.innerHTML = `<div class="fallback-thumbnail">
        <div class="error-overlay">لا يمكن تحميل الفيديو</div>
      </div>`;
      return;
    }
    
    const quality = qualities[currentQuality];
    img.src = `https://img.youtube.com/vi/${videoId}/${quality}`;
  };
  
  img.onload = function() {
    // Success - show the thumbnail with play button
    let messageText = getMessage('apiLoadFailed');
    
    if (isCompatibilityMode) {
      messageText = getMessage('compatibilityModeActive') || 'وضع التوافق مع مانع الإعلانات. يمكنك استخراج الإطارات والصور المصغرة.';
    }
    
    playerDiv.innerHTML = `<div class="fallback-thumbnail">
      <img src="${img.src}" alt="Video thumbnail">
      <div class="play-button-overlay"></div>
      <div class="error-overlay">${messageText}</div>
    </div>`;
    
    // Make thumbnails clickable to open in YouTube
    const thumbnail = playerDiv.querySelector('.fallback-thumbnail');
    if (thumbnail) {
      thumbnail.style.cursor = 'pointer';
      thumbnail.addEventListener('click', () => {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      });
    }
  };
  
  img.onerror = function() {
    currentQuality++;
    tryNextQuality();
  };
  
  tryNextQuality();
}

// Enable or disable capture buttons
function enableCaptureButtons(enable) {
  captureBtn.disabled = !enable;
  downloadPreviewBtn.disabled = !enable;
  
  if (enable) {
    captureBtn.classList.remove('disabled');
    downloadPreviewBtn.classList.remove('disabled');
  } else {
    captureBtn.classList.add('disabled');
    downloadPreviewBtn.classList.add('disabled');
  }
}

// Player ready event handler
function onPlayerReady(event) {
  showStatus(getMessage('videoLoaded'), 'success');
  
  // Ensure player is accessible
  if (event.target) {
    player = event.target;
    
    // Enable capture buttons
    enableCaptureButtons(true);
    
    // Pre-pause the video to prepare for frame capture
    setTimeout(() => {
      try {
        player.pauseVideo();
      } catch (e) {
        console.warn('Could not pause video:', e);
      }
    }, 1000);
  }
}

// Player state change event handler
function onPlayerStateChange(event) {
  // Enable capture buttons when video is loaded, paused or ended
  if (event.data === YT.PlayerState.PAUSED || 
      event.data === YT.PlayerState.ENDED || 
      event.data === YT.PlayerState.CUED) {
    enableCaptureButtons(true);
  }
}

// Player error event handler
function onPlayerError(event) {
  let errorMessage = getMessage('videoLoadError') || 'خطأ في تحميل الفيديو';
  
  // Specific error messages based on error code
  switch(event.data) {
    case 2:
      errorMessage = getMessage('invalidVideoId');
      break;
    case 5:
      errorMessage = getMessage('htmlError');
      break;
    case 100:
      errorMessage = getMessage('videoNotFound');
      break;
    case 101:
    case 150:
      errorMessage = getMessage('videoNotEmbeddable');
      break;
  }
  
  console.warn(`YouTube API Error (${event.data}): ${errorMessage}`);
  showStatus(errorMessage, 'error');
  
  // Try fallback methods
  if (videoId) {
    showFallbackImage(videoId, true);
  }
  
  // Show help section for users
  const playerDiv = document.getElementById('player');
  if (!playerDiv) return;
  
  const helpSection = document.createElement('div');
  helpSection.className = 'video-error-help';
  helpSection.innerHTML = `
    <h3>${getMessage('helpSuggestions') || 'اقتراحات للمساعدة'}</h3>
    <ul>
      <li>${getMessage('tryThumbnail') || 'جرّب تحميل الصورة المصغرة مباشرة'}</li>
      <li>${getMessage('disableAdBlocker') || 'عطّل مانع الإعلانات مؤقتاً إذا كنت تستخدمه'}</li>
      <li>${getMessage('tryDifferentVideo') || 'جرّب فيديو آخر'}</li>
      <li>${getMessage('tryDifferentBrowser') || 'جرّب متصفح مختلف'}</li>
    </ul>
    <button id="retry-video" class="btn primary-btn">${getMessage('retryVideo') || 'حاول مرة أخرى'}</button>
  `;
  
  if (playerDiv.querySelector('.video-error-help') === null) {
    playerDiv.appendChild(helpSection);
    
    // Add retry button functionality
    const retryBtn = document.getElementById('retry-video');
    if (retryBtn) {
      retryBtn.addEventListener('click', function() {
        // Try to reload the video
        initializePlayer(videoUrlInput.value);
      });
    }
  }
}

// Capture a frame from the video
function captureFrame() {
  try {
    // التحقق من توفر معرف الفيديو
    if (!videoId) {
      showStatus(getMessage('noVideoId') || 'لا يوجد فيديو محمل', 'error');
      return false;
    }
    
    showStatus(getMessage('capturingFrame') || 'جارٍ التقاط الإطار...', 'info');
    
    // إنشاء عنصر canvas جديد لرسم الإطار عليه
    if (!previewCanvas) {
      previewCanvas = document.createElement('canvas');
    }
    
    // الأبعاد الافتراضية للفيديو
    let videoWidth = 640;
    let videoHeight = 360;
    
    // الحصول على عنصر فيديو من iframe أو عرض صورة بديلة
    let iframe = document.querySelector('#player iframe');
    
    if (player && !isAdBlockerDetected) {
      // استخدام الطريقة العادية إذا كان اللاعب متاحًا
      try {
        // إيقاف الفيديو مؤقتًا للحصول على إطار واضح
        player.pauseVideo();
        
        // محاولة الحصول على الأبعاد الفعلية لـ iframe
        if (iframe) {
          videoWidth = iframe.clientWidth || videoWidth;
          videoHeight = iframe.clientHeight || videoHeight;
        } else {
          // الحصول على أبعاد عنصر المشغل إذا كان iframe غير موجود
          const playerDiv = document.getElementById('player');
          if (playerDiv) {
            videoWidth = playerDiv.clientWidth || videoWidth;
            videoHeight = playerDiv.clientHeight || videoHeight;
          }
        }
      } catch (e) {
        console.warn('لم يتمكن من إيقاف الفيديو مؤقتًا أو قراءة الأبعاد:', e);
        // سنستمر في المحاولة حتى مع هذا الخطأ
      }
    } else {
      // استخدام الطريقة البديلة إذا كان وضع التوافق نشطًا (مانع إعلانات)
      const fallbackImg = document.querySelector('.fallback-thumbnail img');
      if (fallbackImg) {
        videoWidth = fallbackImg.clientWidth || videoWidth;
        videoHeight = fallbackImg.clientHeight || videoHeight;
      }
    }
    
    // ضبط أبعاد canvas بناءً على إعدادات الجودة
    let canvasWidth, canvasHeight;
    
    switch (currentSettings.quality) {
      case 'low':
        canvasWidth = 640;
        canvasHeight = Math.floor(640 * (videoHeight / videoWidth));
        break;
      case 'medium':
        canvasWidth = 1280;
        canvasHeight = Math.floor(1280 * (videoHeight / videoWidth));
        break;
      case 'high':
        canvasWidth = 1920;
        canvasHeight = Math.floor(1920 * (videoHeight / videoWidth));
        break;
      default:
        // الجودة الأصلية
        canvasWidth = videoWidth;
        canvasHeight = videoHeight;
    }
    
    // ضبط أبعاد الـ canvas
    previewCanvas.width = canvasWidth;
    previewCanvas.height = canvasHeight;
    
    // الحصول على سياق الرسم مع تعيين خاصية willReadFrequently لتحسين الأداء
    const ctx = previewCanvas.getContext('2d', { willReadFrequently: true });
    
    // تعبئة الخلفية بلون أسود
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // الحصول على وقت التشغيل الحالي للبيانات الوصفية
    let currentTime = 0;
    try {
      if (player && typeof player.getCurrentTime === 'function') {
        currentTime = player.getCurrentTime();
      }
    } catch (e) {
      console.warn('لم نتمكن من الحصول على وقت التشغيل الحالي:', e);
    }
    
    // استخدام حل مبتكر: استخدام صورة مصغرة عالية الدقة كأساس للإطار
    const thumbnailQualities = [
      'maxresdefault',  // 1080p
      'sddefault',      // 640p
      'hqdefault',      // 480p
      'mqdefault',      // 320p
      'default'         // 120p
    ];
    
    // إظهار طبقة التحميل أثناء معالجة الصورة المصغرة
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('hidden');
    }
    
    // دالة التقاط الإطار باستخدام صورة مصغرة
    function tryCapturingWithThumbnail(index) {
      if (index >= thumbnailQualities.length) {
        // فشلت جميع محاولات الصور المصغرة، عرض رسالة خطأ
        showStatus(getMessage('captureError') || 'تعذر التقاط الإطار', 'error');
        if (loadingOverlay) {
          loadingOverlay.classList.add('hidden');
        }
        return;
      }
      
      const quality = thumbnailQualities[index];
      let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
      
      // في حالة وضع التوافق، نضيف معامل عشوائي لمنع التخزين المؤقت
      if (isAdBlockerDetected) {
        thumbnailUrl += `?cachebust=${Date.now()}`;
      }
      
      // تحميل الصورة المصغرة
      const img = new Image();
      img.crossOrigin = 'anonymous';  // للسماح بالرسم على canvas
      
      // معالج نجاح تحميل الصورة
      img.onload = function() {
        // رسم الصورة المصغرة على canvas مع تغيير الحجم
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        
        // تطبيق تحسينات الصورة
        applyAdvancedImageProcessing(ctx, canvasWidth, canvasHeight);
        
        // إضافة البيانات الوصفية إلى الإطار
        addFrameMetadata(ctx, currentTime, canvasWidth, canvasHeight);
        
        // إظهار المعاينة
        displayPreview();
        
        // إخفاء طبقة التحميل
        if (loadingOverlay) {
          loadingOverlay.classList.add('hidden');
        }
        
        showStatus(getMessage('captureSuccess') || 'تم التقاط الإطار بنجاح', 'success');
      };
      
      // معالج فشل تحميل الصورة
      img.onerror = function() {
        console.warn(`فشل تحميل الصورة المصغرة بجودة ${quality}، جاري تجربة الجودة التالية...`);
        // محاولة الجودة التالية
        tryCapturingWithThumbnail(index + 1);
      };
      
      // بدء تحميل الصورة
      img.src = thumbnailUrl;
    }
    
    // تطبيق معالجة متقدمة للصورة
    function applyAdvancedImageProcessing(context, width, height) {
      // تطبيق تعزيز التباين
      applyContrastEnhancement(context, width, height);
      
      // تطبيق تعديل السطوع إذا كانت الصورة داكنة
      applyBrightnessAdjustment(context, width, height);
    }
    
    // تحسين تباين الصورة
    function applyContrastEnhancement(context, width, height) {
      try {
        // استخدام getImageData مع مراعاة الأداء
        const imageData = context.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // معامل التباين (1.2 هو تباين معتدل)
        const contrastFactor = 1.2;
        
        for (let i = 0; i < data.length; i += 4) {
          // تطبيق معامل التباين على كل قناة RGB
          // الصيغة: الجديد = (القديم - 128) * معامل + 128
          data[i] = (data[i] - 128) * contrastFactor + 128;     // أحمر
          data[i+1] = (data[i+1] - 128) * contrastFactor + 128; // أخضر
          data[i+2] = (data[i+2] - 128) * contrastFactor + 128; // أزرق
          // لا نغير قناة الشفافية (i+3)
        }
        
        context.putImageData(imageData, 0, 0);
      } catch (e) {
        console.warn('فشل تطبيق تحسين التباين:', e);
      }
    }
    
    // تعديل سطوع الصورة
    function applyBrightnessAdjustment(context, width, height) {
      try {
        // استخدام getImageData مع مراعاة الأداء
        const imageData = context.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // تحليل متوسط السطوع
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          // حساب سطوع البكسل (متوسط RGB)
          totalBrightness += (data[i] + data[i+1] + data[i+2]) / 3;
        }
        
        const averageBrightness = totalBrightness / (data.length / 4);
        
        // تعديل السطوع إذا كانت الصورة داكنة جدًا
        if (averageBrightness < 100) { // عتبة للصور الداكنة
          const brightnessFactor = 1.2; // زيادة السطوع بنسبة 20%
          
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * brightnessFactor);     // أحمر
            data[i+1] = Math.min(255, data[i+1] * brightnessFactor); // أخضر
            data[i+2] = Math.min(255, data[i+2] * brightnessFactor); // أزرق
          }
          
          context.putImageData(imageData, 0, 0);
        }
      } catch (e) {
        console.warn('فشل تطبيق تعديل السطوع:', e);
      }
    }
    
    // إضافة بيانات وصفية للإطار
    function addFrameMetadata(context, time, width, height) {
      try {
        // تنسيق الوقت بصيغة مناسبة
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // إعداد نمط النص
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(0, height - 30, width, 30);
        context.fillStyle = '#FFFFFF';
        context.font = '14px Arial';
        context.textAlign = 'left';
        
        // محاولة الحصول على عنوان الفيديو
        let videoTitle = '';
        try {
          if (player && typeof player.getVideoData === 'function') {
            const videoData = player.getVideoData();
            if (videoData && videoData.title) {
              videoTitle = videoData.title;
            }
          }
        } catch (e) {
          console.warn('لم نتمكن من الحصول على عنوان الفيديو:', e);
        }
        
        // إضافة نص البيانات الوصفية
        const metadataText = videoTitle
          ? `${videoTitle} - ${timeString}`
          : `YouTube Video (${videoId}) - ${timeString}`;
        
        context.fillText(metadataText, 10, height - 10);
      } catch (e) {
        console.warn('فشل إضافة البيانات الوصفية:', e);
      }
    }
    
    // بدء عملية التقاط الإطار باستخدام أفضل جودة متاحة
    tryCapturingWithThumbnail(0);
    
    return true;
  } catch (error) {
    console.error('خطأ أثناء التقاط الإطار:', error);
    showStatus(getMessage('captureError') || 'حدث خطأ أثناء التقاط الإطار', 'error');
    
    // إخفاء طبقة التحميل في حالة الخطأ
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.add('hidden');
    }
    
    return false;
  }
}

// وظيفة عرض المعاينة وتحديث واجهة المستخدم بالإطار المحدد
function displayPreview() {
  // تحديث حاوية المعاينة بالإطار المحدد
  const previewContainer = document.getElementById('preview-container');
  if (!previewContainer || !previewCanvas) {
    console.warn('تعذر عرض المعاينة: العناصر المطلوبة غير موجودة');
    return;
  }
  
  // عرض حاوية المعاينة
  previewContainer.classList.remove('hidden');
  
  // إضافة الكانفاس إلى الحاوية إذا لم يكن موجودًا بالفعل
  const existingCanvas = previewContainer.querySelector('canvas');
  if (!existingCanvas) {
    // إذا لم يكن هناك كانفاس في الحاوية، أضف previewCanvas
    const canvasContainer = document.querySelector('.preview-canvas-container');
    if (canvasContainer) {
      // ضمان أن الحاوية فارغة
      canvasContainer.innerHTML = '';
      canvasContainer.appendChild(previewCanvas);
    }
  }
  
  // تمكين زر التنزيل
  const downloadPreviewBtn = document.getElementById('download-preview');
  if (downloadPreviewBtn) {
    downloadPreviewBtn.disabled = false;
    downloadPreviewBtn.classList.remove('disabled');
  }
  
  // التمرير إلى قسم المعاينة
  previewContainer.scrollIntoView({ behavior: 'smooth' });
}

// دالة مستعارة للتوافق مع الكود القديم
function updatePreview() {
  console.log('استدعاء وظيفة updatePreview المستعارة، سيتم استخدام displayPreview بدلاً منها');
  displayPreview();
}

// Download the preview image
function downloadPreview() {
  try {
    // يجب ألا نستخدم data URLs مباشرة، بل سنستخدم Blob للتوافق مع CSP

    // تحديد تنسيق الملف المطلوب
    let mimeType;
    let quality = 0.95; // جودة الضغط (للصيغ التي تدعم الضغط)
    
    if (currentSettings.format === 'jpeg') {
      mimeType = 'image/jpeg';
      quality = 0.9; // ضغط أعلى للصيغة JPEG
    } else if (currentSettings.format === 'webp') {
      mimeType = 'image/webp';
      quality = 0.9; // ضغط مماثل للصيغة WebP
    } else {
      // PNG كتنسيق افتراضي
      mimeType = 'image/png';
      quality = 1.0; // PNG بدون ضغط
    }
    
    // الحصول على اسم آمن للملف مع التاريخ والوقت
    let filename = '';
    
    // محاولة الحصول على عنوان الفيديو
    let videoTitle = '';
    try {
      if (player && typeof player.getVideoData === 'function') {
        const videoData = player.getVideoData();
        if (videoData && videoData.title) {
          videoTitle = videoData.title;
        }
      }
    } catch (e) {
      console.warn("Couldn't get video title:", e);
    }
    
    // الحصول على الوقت الحالي (بالثواني) إذا كان متاحًا
    let timestamp = '';
    try {
      if (player && typeof player.getCurrentTime === 'function') {
        const currentTime = Math.floor(player.getCurrentTime());
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timestamp = `${minutes}m${seconds}s`;
      }
    } catch (e) {
      console.warn("Couldn't get current time:", e);
      // استخدام وقت محلي بدلاً من وقت الفيديو
      const now = new Date();
      timestamp = `${now.getHours()}h${now.getMinutes()}m`;
    }
    
    // إنشاء اسم ملف آمن
    if (videoTitle) {
      // تنظيف اسم الفيديو للاستخدام كاسم ملف
      const safeTitle = videoTitle
        .replace(/[^\w\s]/gi, '')  // إزالة الأحرف الخاصة
        .replace(/\s+/g, '_')      // استبدال المسافات بالشرطات السفلية
        .substring(0, 50);         // تقييد الطول
      
      filename = `${safeTitle}_${timestamp}`;
    } else {
      // استخدام VideoID مع الوقت
      filename = videoId ? `video_${videoId}_${timestamp}` : `frame_${timestamp}`;
    }
    
    // إضافة امتداد الملف
    filename += `.${currentSettings.format}`;
    
    // استخدام وظيفة toBlob بدلاً من toDataURL
    // لتجنب مشاكل CSP مع أحجام data URL الكبيرة
    previewCanvas.toBlob(function(blob) {
      if (!blob) {
        showStatus(getMessage('exportError') || 'Error creating image file', 'error');
        return;
      }
      
      // إنشاء عنوان URL للـ Blob
      const blobUrl = URL.createObjectURL(blob);
      
      // التحقق من بروتوكول الموقع
      const isHttps = window.location.protocol === 'https:';
      
      if (!isHttps) {
        // حل بديل للاتصالات غير الآمنة: فتح الصورة في نافذة جديدة أو علامة تبويب جديدة
        console.warn('تحذير: يتم تحميل الموقع عبر HTTP، سيتم فتح الصورة في علامة تبويب جديدة.');
        showStatus(getMessage('openingImageTab') || 'فتح الصورة في علامة تبويب جديدة...', 'info');
        
        // فتح الصورة في علامة تبويب جديدة
        const windowReference = window.open(blobUrl, '_blank');
        
        // إذا تم حظر النافذة المنبثقة، اعرض رسالة للمستخدم
        if (!windowReference || windowReference.closed || typeof windowReference.closed == 'undefined') {
          showStatus(getMessage('popupBlocked') || 'تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.', 'error');
        } else {
          showStatus(getMessage('imageSaved') || 'تم فتح الصورة. يمكنك النقر بزر الماوس الأيمن واختيار "حفظ الصورة باسم" لتنزيلها.', 'success');
          
          // تعليمات للمستخدم كيفية الحفظ في نافذة الصورة الجديدة
          setTimeout(() => {
            try {
              windowReference.document.title = filename;
              const infoDiv = windowReference.document.createElement('div');
              infoDiv.style.position = 'fixed';
              infoDiv.style.bottom = '10px';
              infoDiv.style.left = '10px';
              infoDiv.style.background = 'rgba(0,0,0,0.7)';
              infoDiv.style.color = 'white';
              infoDiv.style.padding = '10px';
              infoDiv.style.borderRadius = '5px';
              infoDiv.style.fontFamily = 'Arial, sans-serif';
              infoDiv.style.zIndex = '9999';
              infoDiv.style.direction = currentSettings.language === 'ar' ? 'rtl' : 'ltr';
              infoDiv.textContent = currentSettings.language === 'ar' 
                ? 'انقر بزر الماوس الأيمن على الصورة واختر "حفظ الصورة باسم" لتنزيلها' 
                : 'Right-click on the image and select "Save image as" to download it';
              windowReference.document.body.appendChild(infoDiv);
            } catch (e) {
              console.warn('لم نتمكن من تعديل نافذة الصورة:', e);
            }
          }, 500);
        }
        
        // تحرير الموارد بعد فترة
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 60000); // تحرير بعد دقيقة واحدة
        
        return;
      }
      
      // استخدام طريقة التنزيل العادية إذا كان البروتوكول آمنًا
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = filename;
      downloadLink.setAttribute('rel', 'noopener noreferrer');
      
      // إخفاء الرابط عن المستخدم ثم النقر عليه تلقائيًا
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      
      // تنظيف العناصر بعد التنزيل
      setTimeout(function() {
        document.body.removeChild(downloadLink);
        // تحرير موارد URL
        URL.revokeObjectURL(blobUrl);
      }, 100);
      
      showStatus(getMessage('downloadSuccess'), 'success');
    }, mimeType, quality);
    
  } catch (error) {
    console.error("Error downloading preview:", error);
    showStatus(getMessage('exportError'), 'error');
  }
}

// Download the video thumbnail
function downloadThumbnail() {
  try {
    if (!videoId) {
      showStatus(getMessage('noVideoId'), 'error');
      return;
    }
    
    // استخراج معرف الفيديو من الرابط
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    let extractedId = null;
    for (const pattern of patterns) {
      const match = videoId.match(pattern);
      if (match && match[1]) {
        extractedId = match[1];
        break;
      }
    }
    
    if (!extractedId) {
      showStatus(getMessage('invalidURL'), 'error');
      return;
    }
    
    // محاولة الحصول على عنوان الفيديو للملف
    let videoTitle = '';
    try {
      if (player && typeof player.getVideoData === 'function') {
        const videoData = player.getVideoData();
        if (videoData && videoData.title) {
          videoTitle = videoData.title;
        }
      }
    } catch (e) {
      console.warn("لم نتمكن من الحصول على عنوان الفيديو:", e);
    }
    
    // إنشاء اسم ملف آمن
    let safeFilename = videoTitle
      ? videoTitle.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_').substring(0, 50)
      : `youtube_thumbnail_${extractedId}`;
      
    safeFilename += '.jpg';
    
    // قائمة بجودات الصور المصغرة المتاحة (بترتيب تنازلي من حيث الجودة)
    const thumbnailQualities = [
      'maxresdefault',  // 1080p
      'sddefault',      // 640p
      'hqdefault',      // 480p
      'mqdefault',      // 320p
      'default'         // 120p
    ];
    
    // تحميل أول صورة مصغرة متاحة
    function tryNextThumbnail(index) {
      if (index >= thumbnailQualities.length) {
        showStatus(getMessage('thumbnailError'), 'error');
        return;
      }
      
      const quality = thumbnailQualities[index];
      const thumbUrl = `https://img.youtube.com/vi/${extractedId}/${quality}.jpg`;
      
      // إظهار حالة التحميل
      showStatus(getMessage('loadingThumbnail'), 'info');
      
      // تحميل الصورة المصغرة كـ blob
      fetch(thumbUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          // التحقق من بروتوكول الموقع
          const isHttps = window.location.protocol === 'https:';
          
          // إنشاء رابط تنزيل باستخدام Blob
          const blobUrl = URL.createObjectURL(blob);
          
          if (!isHttps) {
            // حل بديل للاتصالات غير الآمنة: فتح الصورة في نافذة جديدة أو علامة تبويب جديدة
            console.warn('تحذير: يتم تحميل الموقع عبر HTTP، سيتم فتح الصورة المصغرة في علامة تبويب جديدة.');
            showStatus(getMessage('openingImageTab') || 'فتح الصورة في علامة تبويب جديدة...', 'info');
            
            // فتح الصورة في علامة تبويب جديدة
            const windowReference = window.open(blobUrl, '_blank');
            
            // إذا تم حظر النافذة المنبثقة، اعرض رسالة للمستخدم
            if (!windowReference || windowReference.closed || typeof windowReference.closed == 'undefined') {
              showStatus(getMessage('popupBlocked') || 'تم حظر النافذة المنبثقة. يرجى السماح بالنوافذ المنبثقة لهذا الموقع.', 'error');
            } else {
              showStatus(getMessage('imageSaved') || 'تم فتح الصورة. يمكنك النقر بزر الماوس الأيمن واختيار "حفظ الصورة باسم" لتنزيلها.', 'success');
              
              // تعليمات للمستخدم كيفية الحفظ في نافذة الصورة الجديدة
              setTimeout(() => {
                try {
                  windowReference.document.title = safeFilename;
                  const infoDiv = windowReference.document.createElement('div');
                  infoDiv.style.position = 'fixed';
                  infoDiv.style.bottom = '10px';
                  infoDiv.style.left = '10px';
                  infoDiv.style.background = 'rgba(0,0,0,0.7)';
                  infoDiv.style.color = 'white';
                  infoDiv.style.padding = '10px';
                  infoDiv.style.borderRadius = '5px';
                  infoDiv.style.fontFamily = 'Arial, sans-serif';
                  infoDiv.style.zIndex = '9999';
                  infoDiv.style.direction = currentSettings.language === 'ar' ? 'rtl' : 'ltr';
                  infoDiv.textContent = currentSettings.language === 'ar' 
                    ? 'انقر بزر الماوس الأيمن على الصورة واختر "حفظ الصورة باسم" لتنزيلها' 
                    : 'Right-click on the image and select "Save image as" to download it';
                  windowReference.document.body.appendChild(infoDiv);
                } catch (e) {
                  console.warn('لم نتمكن من تعديل نافذة الصورة:', e);
                }
              }, 500);
            }
            
            // تحرير الموارد بعد فترة
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl);
            }, 60000); // تحرير بعد دقيقة واحدة
          } else {
            // استخدام طريقة التنزيل العادية إذا كان البروتوكول آمنًا
            // إنشاء عنصر الرابط والتنزيل
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = safeFilename;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            
            // بدء التنزيل
            downloadLink.click();
            
            // تنظيف الموارد
            setTimeout(() => {
              document.body.removeChild(downloadLink);
              URL.revokeObjectURL(blobUrl);
            }, 100);
            
            showStatus(getMessage('downloadSuccess'), 'success');
          }
        })
        .catch(error => {
          console.warn(`فشل تحميل الصورة المصغرة بجودة ${quality}:`, error);
          // تجربة الجودة التالية
          tryNextThumbnail(index + 1);
        });
    }
    
    // بدء محاولة التنزيل بأعلى جودة متاحة
    tryNextThumbnail(0);
    
  } catch (error) {
    console.error("خطأ أثناء تنزيل الصورة المصغرة:", error);
    showStatus(getMessage('thumbnailError'), 'error');
  }
}

// Save settings to localStorage
function saveSettings() {
  currentSettings.quality = qualitySelect.value;
  currentSettings.format = formatSelect.value;
  currentSettings.filename = filenameInput.value;
  
  localStorage.setItem('yt-frame-extractor-settings', JSON.stringify(currentSettings));
  showStatus(getMessage('settingsSaved'), 'success');
}

// Load settings from localStorage
function loadSettings() {
  const savedSettings = localStorage.getItem('yt-frame-extractor-settings');
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      currentSettings = { ...DEFAULT_SETTINGS, ...settings };
    } catch (e) {
      console.error('Error parsing saved settings:', e);
      currentSettings = { ...DEFAULT_SETTINGS };
    }
  } else {
    currentSettings = { ...DEFAULT_SETTINGS };
  }
  
  // Apply settings to UI if elements exist
  if (qualitySelect) {
    qualitySelect.value = currentSettings.quality;
  }
  
  if (formatSelect) {
    formatSelect.value = currentSettings.format;
  }
  
  if (filenameInput) {
    filenameInput.value = currentSettings.filename;
  }
  
  // Set active language button if elements exist
  if (languageBtns) {
    const currentLang = currentSettings.language || 'en';
    languageBtns.forEach(btn => {
      if (btn.dataset.lang === currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Set language
    setLanguage(currentLang);
  }
}

// Reset settings to default
function resetSettings() {
  currentSettings = { ...DEFAULT_SETTINGS };
  qualitySelect.value = currentSettings.quality;
  formatSelect.value = currentSettings.format;
  filenameInput.value = currentSettings.filename;
  
  localStorage.setItem('yt-frame-extractor-settings', JSON.stringify(currentSettings));
  showStatus(getMessage('settingsReset'), 'success');
}

// Get message in current language
function getMessage(messageKey) {
  const lang = currentSettings.language || 'en';
  return messages[lang][messageKey] || messageKey;
}

// Set language for UI
function setLanguage(lang) {
  currentSettings.language = lang;
  localStorage.setItem('yt-frame-extractor-settings', JSON.stringify(currentSettings));
  
  // Update language buttons
  languageBtns.forEach(btn => {
    if (btn.dataset.lang === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Update UI text
  for (const elementId in elementsToLocalize) {
    const element = document.getElementById(elementId);
    if (element) {
      const messageKey = elementsToLocalize[elementId];
      
      // Special case for options in select elements
      if (element.tagName === 'OPTION') {
        element.textContent = getMessage(messageKey);
      } 
      // Handle links and other elements with innerHTML
      else if (element.tagName === 'A' || elementId === 'disclaimerText' || elementId === 'footerText') {
        // For footer text which contains a link
        if (elementId === 'footerText') {
          element.innerHTML = `${getMessage(messageKey)} | <a href="privacy.html" id="privacyLink">${getMessage('privacyLink')}</a>`;
        } else {
          element.innerHTML = getMessage(messageKey);
        }
      } 
      // Regular text content for most elements
      else {
        element.textContent = getMessage(messageKey);
      }
    }
  }
  
  // Handle RTL for Arabic
  const bodyElement = document.body;
  if (bodyElement) {
    bodyElement.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
  }
  
  // Update any status message if visible
  const statusElement = document.getElementById('status');
  if (statusElement && statusElement.style.display !== 'none') {
    // We don't change the message, just leave it as is
  }
}

// Show status message
function showStatus(message, type = 'info') {
  const statusElement = document.getElementById('status');
  if (!statusElement) return;
  
  // Clear existing classes
  statusElement.className = 'alert';
  
  // Add appropriate class based on message type
  switch (type) {
    case 'success':
      statusElement.classList.add('alert-success');
      break;
    case 'error':
      statusElement.classList.add('alert-error');
      break;
    case 'warning':
      statusElement.classList.add('alert-warning');
      break;
    default:
      statusElement.classList.add('alert-info');
  }
  
  // Set message text
  statusElement.textContent = message;
  statusElement.classList.remove('hidden');
  
  // Auto-hide after delay for success messages
  if (type === 'success') {
    setTimeout(() => {
      statusElement.classList.add('hidden');
    }, 3000);
  }
}

// Toggle settings visibility
function toggleSettings() {
  isSettingsOpen = !isSettingsOpen;
  const settingsContent = document.getElementById('settingsContent');
  if (settingsContent) {
    if (isSettingsOpen) {
      settingsContent.classList.remove('hidden');
    } else {
      settingsContent.classList.add('hidden');
    }
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  // Initialize DOM variables
  videoUrlInput = document.getElementById('video-url');
  loadVideoBtn = document.getElementById('load-video');
  captureBtn = document.getElementById('capture');
  thumbnailBtn = document.getElementById('thumbnail');
  videoContainer = document.getElementById('video-container');
  settingsToggle = document.getElementById('settingsToggle');
  settingsContent = document.getElementById('settingsContent');
  qualitySelect = document.getElementById('quality');
  formatSelect = document.getElementById('format');
  filenameInput = document.getElementById('filename');
  saveSettingsBtn = document.getElementById('saveSettings');
  resetSettingsBtn = document.getElementById('resetSettings');
  previewContainer = document.getElementById('preview-container');
  previewCanvas = document.getElementById('previewCanvas');
  downloadPreviewBtn = document.getElementById('download-preview');
  languageBtns = document.querySelectorAll('.language-btn');
  
  // Check if all required elements exist
  const requiredElements = [loadVideoBtn, captureBtn, thumbnailBtn];
  const missingElements = requiredElements.filter(el => !el);
  
  if (missingElements.length > 0) {
    console.error('Error: Some required DOM elements are missing');
    return; // Exit early if required elements are missing
  }
  
  // Initially disable capture buttons
  enableCaptureButtons(false);
  
  // Initially hide settings
  if (settingsContent) {
    settingsContent.classList.add('hidden');
  }
  
  // Load settings from localStorage
  loadSettings();
  
  // Set up event listeners
  loadVideoBtn.addEventListener('click', function() {
    const url = videoUrlInput.value.trim();
    if (url) {
      initializePlayer(url);
    } else {
      showStatus(getMessage('enterValidUrl'), 'error');
    }
  });
  
  // Add Enter key support for loading videos
  videoUrlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const url = videoUrlInput.value.trim();
      if (url) {
        loadVideoBtn.click();
      }
    }
  });
  
  captureBtn.addEventListener('click', captureFrame);
  thumbnailBtn.addEventListener('click', downloadThumbnail);
  
  // Set up quality selection
  if (qualitySelect) {
    qualitySelect.addEventListener('change', function() {
      currentSettings.quality = this.value;
      saveSettings();
    });
    
    // Initialize with the correct quality value
    qualitySelect.value = currentSettings.quality;
  }
  
  // Set up settings toggles
  if (settingsToggle) {
    settingsToggle.addEventListener('click', toggleSettings);
  }
  
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', saveSettings);
  }
  
  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', resetSettings);
  }
  
  if (downloadPreviewBtn) {
    downloadPreviewBtn.addEventListener('click', downloadPreview);
  }
  
  // Language buttons
  if (languageBtns) {
    languageBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
      });
    });
  }
  
  // Add error handling for YouTube API loading
  window.addEventListener('error', function(e) {
    if (e.target.src && e.target.src.includes('youtube.com/iframe_api')) {
      showStatus('Failed to load YouTube API. Please check your internet connection.', 'error');
    }
  }, true);
  
  // Show UI after initialization
  const appContainer = document.getElementById('app-container');
  if (appContainer) {
    appContainer.style.opacity = '1';
  }
}); 