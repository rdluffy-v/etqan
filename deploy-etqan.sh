#!/usr/bin/env bash
cd /home/rdluffy/Desktop/etqan

echo "================================================================="
echo "   🔥 تسجيل الدخول ونشر منصة إتقان على Firebase (etqan-1ez88)    "
echo "================================================================="
echo ""
echo "1️⃣ تسجيل حساب Google المالك لمنصة إتقان (دون التأثير على أي مشاريع أخرى)..."
echo "   - اضغط Y ثم Enter عند السؤال"
echo "   - سيفتح متصفح Firefox تلقائياً، اختر حساب إتقان واضغط Allow/سماح"
echo ""

npx -y firebase-tools@latest login:add

echo ""
echo "2️⃣ ربط المشروع النشط بـ etqan-1ez88 وتفعيل Web Frameworks..."
npx -y firebase-tools@latest experiments:enable webframeworks
npx -y firebase-tools@latest use etqan-1ez88

echo ""
echo "3️⃣ بدء نشر منصة إتقان على Firebase Hosting..."
npx -y firebase-tools@latest deploy --only hosting

STATUS=$?
echo ""
if [ $STATUS -eq 0 ]; then
  echo "================================================================="
  echo "🎉 مبروك! تم نشر موقع إتقان بنجاح وهو شغال 100% الآن عبر الرابط:"
  echo "👉 https://etqan-1ez88.web.app"
  echo "👉 https://etqan-1ez88.firebaseapp.com"
  echo "================================================================="
else
  echo "================================================================="
  echo "⚠️ إذا ظهر خطأ يتعلق بالـ Cloud Functions أو الخطة:"
  echo "يرجى العلم أن Firebase Web Frameworks يتطلب خطة Blaze أو نشر ثابت."
  echo "================================================================="
fi

echo ""
read -p "اضغط Enter لإغلاق النافذة..." dummy
