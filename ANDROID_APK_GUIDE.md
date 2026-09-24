# UPSC Conquest - Android APK GitHub Actions Guide

इस गाइड की मदद से आप अपने प्रोजेक्ट को GitHub पर पुश करके सीधे **Android APK** जनरेट और डाउनलोड कर सकते हैं।

---

## 🚀 GitHub Actions से APK कैसे बनाएं और डाउनलोड करें:

### स्टेप 1: कोड को GitHub पर पुश करें (Push to GitHub)
```bash
git add .
git commit -m "Optimize for Android & Add APK GitHub Workflow"
git push origin main
```

---

### स्टेप 2: GitHub Actions में बिल्ड शुरू होगा
1. अपने GitHub रिपॉजिटरी में जाएं।
2. ऊपर दिए गए **Actions** टैब पर क्लिक करें।
3. आपको **"Build Android APK"** वर्कफ़्लो चलता हुआ दिखेगा (हरा चेकमार्क आने तक 2-3 मिनट प्रतीक्षा करें)।

---

### स्टेप 3: APK डाउनलोड करें
1. पूर्ण हुए वर्कफ़्लो रन पर क्लिक करें।
2. नीचे **Artifacts** सेक्शन में जाएं।
3. **`UPSC-Conquest-Android-App-Debug`** पर क्लिक करके ज़िप डाउनलोड करें।
4. ज़िप अनपैक करें और अपने एंड्रॉइड फोन में APK इनस्टॉल करें।

---

## 📱 मोबाइल एवं एंड्रॉइड ऑप्टिमाइजेशन (Key Mobile Fixes Applied):
- **Word Wrapping & Alignment**: सभी बटन्स, पिल्स, टैब्स, बैज और टेबल हेडर में `whitespace-nowrap` और `break-word` फिक्स किया गया है ताकि मोबाइल स्क्रीन पर टेक्स्ट ऊपर-नीचे न टूटे।
- **Smooth Horizontal Scroll**: सब-टैब्स (`Toppers`, `Preparation`, `Analytics`) के लिए नो-स्क्रोलबार और स्मूथ टच स्क्रोलिंग सक्षम की गई है।
- **Safe Area Insets**: एंड्रॉइड नॉच एवं स्टेटस बार के लिए पैडिंग सुरक्षित की गई है।
