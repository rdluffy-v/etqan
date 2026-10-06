#!/usr/bin/env bash
cd "$(dirname "$0")"

echo "=========================================================="
echo "    🚀 إطلاق ونشر منصة إتقان على Firebase Hosting         "
echo "=========================================================="
echo ""
echo "1️⃣ تسجيل الدخول لحساب Google المالك لمشروع etqan-1ez88..."
echo "👉 سيتم فتح المتصفح (Firefox) لاختيار حسابك والموافقة:"
echo ""

npx -y firebase-tools@latest login --reauth

echo ""
echo "2️⃣ تفعيل بيئة Web Frameworks واختيار المشروع..."
npx -y firebase-tools@latest experiments:enable webframeworks
npx -y firebase-tools@latest use etqan-1ez88

echo ""
echo "3️⃣ بدء البناء والنشر المباشر على Firebase..."
npx -y firebase-tools@latest deploy --only hosting

STATUS=$?
echo ""
if [ $STATUS -eq 0 ]; then
  echo "=========================================================="
  echo "🎉 تم النشر بنجاح! الرابط شغال الآن:"
  echo "👉 https://etqan-1ez88.web.app"
  echo "👉 https://etqan-1ez88.firebaseapp.com"
  echo "=========================================================="
else
  echo "=========================================================="
  echo "⚠️ حدث خطأ أثناء النشر (كود: $STATUS)"
  echo "إذا كان السبب يتطلب خطة Blaze للـ Cloud Functions،"
  echo "يرجى التحقق من إعدادات الفوترة أو مراجعة الرسالة أعلاه."
  echo "=========================================================="
fi

echo ""
read -p "اضغط Enter للإغلاق..." dummy
