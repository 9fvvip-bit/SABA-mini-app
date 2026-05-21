import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import {
  Trophy,
  Wallet,
  Ticket,
  Gift,
  Users,
  Search,
  Bitcoin,
  Zap,
  History,
  Send,
  Copy,
  UploadCloud,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Download,
  ArrowRight,
  Medal,
  Coins,
  Flame,
  X,
} from "lucide-react";
import "./index.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://api.c158129.com").replace(/\/$/, "");
const DEPOSIT_ADDRESS = "TVk3UDQnBrT8vgUbR3dy9Eb1ogBwvNx4G";

const LANGUAGES = [
  { code: "en", label: "English", short: "EN", dir: "ltr" },
  { code: "zh", label: "中文", short: "中", dir: "ltr" },
  { code: "es", label: "Español", short: "ES", dir: "ltr" },
  { code: "hi", label: "हिन्दी", short: "HI", dir: "ltr" },
  { code: "ar", label: "العربية", short: "AR", dir: "rtl" },
  { code: "fr", label: "Français", short: "FR", dir: "ltr" },
  { code: "ja", label: "日本語", short: "JP", dir: "ltr" },
  { code: "ko", label: "한국어", short: "KO", dir: "ltr" },
  { code: "ru", label: "Русский", short: "RU", dir: "ltr" },
  { code: "tr", label: "Türkçe", short: "TR", dir: "ltr" },
];

const I18N = {
  en: { pool:"Pool", deposit:"Deposit", myBets:"My Bets", rewards:"Rewards", language:"Language", depositCrypto:"Deposit Crypto", selectAmount:"Select amount in USDT value", customAmount:"Custom amount (USDT value)", selectPayment:"Select payment coin / network", youEnter:"You enter", needToPay:"Need to pay", createOrder:"Create Deposit Order", creatingOrder:"Creating Order...", oneActive:"One player can only keep one active deposit order. Order expires in 30 minutes.", activeOrder:"Active Deposit Order", left:"left", youDeposit:"You deposit", youPay:"You pay", network:"Network", rate:"Rate", send:"Send", onlyThrough:"only through", wrongNetwork:"Wrong coin or wrong network may cause permanent loss. Upload receipt after sending.", cancelOrder:"Cancel Order", cancelling:"Cancelling...", uploadScreenshot:"Upload Payment Screenshot", uploadDesc:"After sending, upload your payment screenshot for admin verification.", pendingAdmin:"Pending Admin Confirmation", chooseScreenshot:"Upload Screenshot", fileLimit:"JPG, PNG up to 5MB", submitScreenshot:"Submit Screenshot", uploading:"Uploading...", orderExpired:"Order Expired", walletHistory:"Wallet History", viewAll:"View All", depositHistory:"Deposit History", withdrawHistory:"Withdraw History", betHistory:"Bet History", winHistory:"Win History", noRecords:"No records yet.", promo:"Rewards / Promotion", depositBonus:"Deposit 100 USDT, Get 20 USDT Bonus", progress:"Progress", depositMore:"Deposit {amount} USDT more to unlock 20 USDT reward.", alreadyActive:"You already have an active deposit order. Please upload receipt, cancel it, or wait until it expires.", createFirst:"Please create a deposit order first.", expiredCreateNew:"This deposit order has expired. Please create a new order.", chooseFileFirst:"Please choose a payment screenshot first.", uploadedWait:"Screenshot uploaded. Please wait for admin confirmation.", cancelConfirm:"Cancel this deposit order? You can create a new one after cancellation.", betSuccess:"Bet success: {tickets} tickets / {shares} shares" },
  zh: { pool:"奖池", deposit:"充值", myBets:"我的下注", rewards:"奖励", language:"语言", depositCrypto:"加密货币充值", selectAmount:"选择充值金额（USDT价值）", customAmount:"自定义金额（USDT价值）", selectPayment:"选择支付币种 / 网络", youEnter:"你输入", needToPay:"需要支付", createOrder:"创建充值订单", creatingOrder:"正在创建订单...", oneActive:"每个玩家同时只能保留一张进行中的充值订单，订单30分钟后过期。", activeOrder:"进行中的充值订单", left:"剩余", youDeposit:"充值价值", youPay:"你需要支付", network:"网络", rate:"汇率", send:"请发送", onlyThrough:"仅通过", wrongNetwork:"发送错误币种或错误网络可能造成永久损失。付款后请上传收据截图。", cancelOrder:"取消订单", cancelling:"正在取消...", uploadScreenshot:"上传付款截图", uploadDesc:"付款后上传截图，等待管理员审核。", pendingAdmin:"等待管理员确认", chooseScreenshot:"上传截图", fileLimit:"JPG、PNG，最大5MB", submitScreenshot:"提交截图", uploading:"上传中...", orderExpired:"订单已过期", walletHistory:"钱包记录", viewAll:"查看全部", depositHistory:"充值记录", withdrawHistory:"提现记录", betHistory:"下注记录", winHistory:"中奖记录", noRecords:"暂无记录。", promo:"奖励 / 活动", depositBonus:"充值100 USDT，赠送20 USDT奖励", progress:"进度", depositMore:"再充值 {amount} USDT 即可解锁20 USDT奖励。", alreadyActive:"你已经有一张进行中的充值订单，请上传收据、取消订单，或等待订单过期。", createFirst:"请先创建充值订单。", expiredCreateNew:"该充值订单已过期，请重新创建订单。", chooseFileFirst:"请先选择付款截图。", uploadedWait:"截图已上传，请等待管理员确认。", cancelConfirm:"确定取消这张充值订单吗？取消后可以重新创建新订单。", betSuccess:"下注成功：{tickets} 注 / {shares} 分成" },
  es: { pool:"Pool", deposit:"Depósito", myBets:"Mis Apuestas", rewards:"Recompensas", language:"Idioma", depositCrypto:"Depósito Cripto", selectAmount:"Selecciona valor en USDT", customAmount:"Monto personalizado (USDT)", selectPayment:"Selecciona moneda / red", youEnter:"Ingresas", needToPay:"Debes pagar", createOrder:"Crear Orden", creatingOrder:"Creando...", oneActive:"Solo puedes tener una orden activa. Expira en 30 minutos.", activeOrder:"Orden Activa", left:"restante", youDeposit:"Depositas", youPay:"Pagas", network:"Red", rate:"Tasa", send:"Envía", onlyThrough:"solo por", wrongNetwork:"Moneda o red incorrecta puede causar pérdida permanente. Sube recibo después de pagar.", cancelOrder:"Cancelar Orden", cancelling:"Cancelando...", uploadScreenshot:"Subir Recibo", uploadDesc:"Después de pagar, sube tu captura para verificación.", pendingAdmin:"Pendiente de Confirmación", chooseScreenshot:"Subir Captura", fileLimit:"JPG, PNG hasta 5MB", submitScreenshot:"Enviar Captura", uploading:"Subiendo...", orderExpired:"Orden Expirada", walletHistory:"Historial", viewAll:"Ver Todo", depositHistory:"Depósitos", withdrawHistory:"Retiros", betHistory:"Apuestas", winHistory:"Ganancias", noRecords:"Sin registros.", promo:"Recompensas / Promoción", depositBonus:"Deposita 100 USDT y recibe 20 USDT", progress:"Progreso", depositMore:"Deposita {amount} USDT más para desbloquear 20 USDT.", alreadyActive:"Ya tienes una orden activa. Sube recibo, cancélala o espera.", createFirst:"Primero crea una orden.", expiredCreateNew:"Esta orden expiró. Crea una nueva.", chooseFileFirst:"Selecciona una captura primero.", uploadedWait:"Captura subida. Espera confirmación.", cancelConfirm:"¿Cancelar esta orden?", betSuccess:"Apuesta exitosa: {tickets} tickets / {shares} shares" },
  hi: { pool:"पूल", deposit:"डिपॉजिट", myBets:"मेरी बेट्स", rewards:"रिवॉर्ड्स", language:"भाषा", depositCrypto:"क्रिप्टो डिपॉजिट", selectAmount:"USDT वैल्यू चुनें", customAmount:"कस्टम राशि (USDT)", selectPayment:"कॉइन / नेटवर्क चुनें", youEnter:"आप दर्ज करते हैं", needToPay:"भुगतान करें", createOrder:"डिपॉजिट ऑर्डर बनाएं", creatingOrder:"ऑर्डर बन रहा है...", oneActive:"केवल एक सक्रिय ऑर्डर हो सकता है। 30 मिनट में एक्सपायर होगा।", activeOrder:"सक्रिय डिपॉजिट ऑर्डर", left:"बाकी", youDeposit:"डिपॉजिट", youPay:"भुगतान", network:"नेटवर्क", rate:"रेट", send:"भेजें", onlyThrough:"केवल", wrongNetwork:"गलत कॉइन या नेटवर्क से नुकसान हो सकता है। भुगतान के बाद रसीद अपलोड करें।", cancelOrder:"ऑर्डर कैंसल", cancelling:"कैंसल हो रहा है...", uploadScreenshot:"पेमेंट स्क्रीनशॉट", uploadDesc:"पेमेंट के बाद स्क्रीनशॉट अपलोड करें।", pendingAdmin:"एडमिन पुष्टि लंबित", chooseScreenshot:"स्क्रीनशॉट अपलोड", fileLimit:"JPG, PNG 5MB तक", submitScreenshot:"सबमिट", uploading:"अपलोड हो रहा है...", orderExpired:"ऑर्डर एक्सपायर", walletHistory:"वॉलेट हिस्ट्री", viewAll:"सभी देखें", depositHistory:"डिपॉजिट", withdrawHistory:"विड्रॉ", betHistory:"बेट", winHistory:"विन", noRecords:"कोई रिकॉर्ड नहीं।", promo:"रिवॉर्ड / प्रमोशन", depositBonus:"100 USDT डिपॉजिट करें, 20 USDT बोनस पाएं", progress:"प्रगति", depositMore:"20 USDT पाने के लिए {amount} USDT और जमा करें।", alreadyActive:"आपके पास सक्रिय ऑर्डर है। रसीद अपलोड करें, कैंसल करें या इंतजार करें।", createFirst:"पहले डिपॉजिट ऑर्डर बनाएं।", expiredCreateNew:"ऑर्डर एक्सपायर हो गया। नया बनाएं।", chooseFileFirst:"पहले स्क्रीनशॉट चुनें।", uploadedWait:"स्क्रीनशॉट अपलोड हो गया।", cancelConfirm:"क्या ऑर्डर कैंसल करना है?", betSuccess:"बेट सफल: {tickets} / {shares}" },
  ar: { pool:"المجمع", deposit:"إيداع", myBets:"رهاناتي", rewards:"المكافآت", language:"اللغة", depositCrypto:"إيداع العملات الرقمية", selectAmount:"اختر قيمة USDT", customAmount:"مبلغ مخصص (USDT)", selectPayment:"اختر العملة / الشبكة", youEnter:"أنت تدخل", needToPay:"يجب الدفع", createOrder:"إنشاء طلب إيداع", creatingOrder:"جارٍ الإنشاء...", oneActive:"يمكن الاحتفاظ بطلب نشط واحد فقط. ينتهي خلال 30 دقيقة.", activeOrder:"طلب إيداع نشط", left:"متبقي", youDeposit:"قيمة الإيداع", youPay:"تدفع", network:"الشبكة", rate:"السعر", send:"أرسل", onlyThrough:"فقط عبر", wrongNetwork:"عملة أو شبكة خاطئة قد تسبب فقدانًا دائمًا. ارفع الإيصال بعد الدفع.", cancelOrder:"إلغاء الطلب", cancelling:"جارٍ الإلغاء...", uploadScreenshot:"رفع إثبات الدفع", uploadDesc:"بعد الدفع، ارفع لقطة الشاشة للمراجعة.", pendingAdmin:"بانتظار التأكيد", chooseScreenshot:"رفع لقطة", fileLimit:"JPG, PNG حتى 5MB", submitScreenshot:"إرسال", uploading:"جارٍ الرفع...", orderExpired:"انتهى الطلب", walletHistory:"سجل المحفظة", viewAll:"عرض الكل", depositHistory:"الإيداعات", withdrawHistory:"السحوبات", betHistory:"الرهانات", winHistory:"الأرباح", noRecords:"لا توجد سجلات.", promo:"المكافآت / العروض", depositBonus:"أودع 100 USDT واحصل على 20 USDT", progress:"التقدم", depositMore:"أودع {amount} USDT إضافية لفتح 20 USDT.", alreadyActive:"لديك طلب نشط. ارفع الإيصال أو ألغِه أو انتظر.", createFirst:"أنشئ طلب إيداع أولاً.", expiredCreateNew:"انتهى الطلب. أنشئ طلبًا جديدًا.", chooseFileFirst:"اختر لقطة الدفع أولاً.", uploadedWait:"تم رفع اللقطة. انتظر التأكيد.", cancelConfirm:"هل تريد إلغاء هذا الطلب؟", betSuccess:"تم الرهان: {tickets} / {shares}" },
  fr: { pool:"Pool", deposit:"Dépôt", myBets:"Mes Paris", rewards:"Récompenses", language:"Langue", depositCrypto:"Dépôt Crypto", selectAmount:"Sélectionnez le montant USDT", customAmount:"Montant personnalisé (USDT)", selectPayment:"Choisissez monnaie / réseau", youEnter:"Vous entrez", needToPay:"À payer", createOrder:"Créer l’ordre", creatingOrder:"Création...", oneActive:"Un seul ordre actif est autorisé. Expire en 30 minutes.", activeOrder:"Ordre Actif", left:"restant", youDeposit:"Vous déposez", youPay:"Vous payez", network:"Réseau", rate:"Taux", send:"Envoyez", onlyThrough:"uniquement via", wrongNetwork:"Mauvaise monnaie ou réseau peut causer une perte permanente. Téléversez le reçu.", cancelOrder:"Annuler", cancelling:"Annulation...", uploadScreenshot:"Téléverser le reçu", uploadDesc:"Après paiement, téléversez la capture pour vérification.", pendingAdmin:"En attente de confirmation", chooseScreenshot:"Téléverser", fileLimit:"JPG, PNG jusqu’à 5MB", submitScreenshot:"Envoyer", uploading:"Téléversement...", orderExpired:"Ordre expiré", walletHistory:"Historique", viewAll:"Voir Tout", depositHistory:"Dépôts", withdrawHistory:"Retraits", betHistory:"Paris", winHistory:"Gains", noRecords:"Aucun enregistrement.", promo:"Récompenses / Promotion", depositBonus:"Déposez 100 USDT, recevez 20 USDT", progress:"Progression", depositMore:"Déposez encore {amount} USDT pour débloquer 20 USDT.", alreadyActive:"Vous avez déjà un ordre actif. Téléversez, annulez ou attendez.", createFirst:"Créez d’abord un ordre.", expiredCreateNew:"Ordre expiré. Créez-en un nouveau.", chooseFileFirst:"Choisissez une capture.", uploadedWait:"Capture envoyée. Attendez confirmation.", cancelConfirm:"Annuler cet ordre ?", betSuccess:"Pari réussi : {tickets} / {shares}" },
  ja: { pool:"プール", deposit:"入金", myBets:"マイベット", rewards:"報酬", language:"言語", depositCrypto:"暗号資産入金", selectAmount:"USDT相当額を選択", customAmount:"カスタム金額（USDT）", selectPayment:"通貨 / ネットワークを選択", youEnter:"入力額", needToPay:"支払額", createOrder:"入金注文を作成", creatingOrder:"作成中...", oneActive:"有効な入金注文は1つだけです。30分で期限切れになります。", activeOrder:"有効な入金注文", left:"残り", youDeposit:"入金価値", youPay:"支払い", network:"ネットワーク", rate:"レート", send:"送金", onlyThrough:"のみ", wrongNetwork:"通貨またはネットワークを間違えると失われる可能性があります。送金後に領収書をアップロードしてください。", cancelOrder:"注文をキャンセル", cancelling:"キャンセル中...", uploadScreenshot:"支払いスクリーンショット", uploadDesc:"送金後、確認用スクリーンショットをアップロードしてください。", pendingAdmin:"管理者確認待ち", chooseScreenshot:"アップロード", fileLimit:"JPG、PNG 最大5MB", submitScreenshot:"送信", uploading:"アップロード中...", orderExpired:"注文期限切れ", walletHistory:"ウォレット履歴", viewAll:"すべて表示", depositHistory:"入金履歴", withdrawHistory:"出金履歴", betHistory:"ベット履歴", winHistory:"勝利履歴", noRecords:"記録がありません。", promo:"報酬 / プロモーション", depositBonus:"100 USDT入金で20 USDTボーナス", progress:"進捗", depositMore:"あと {amount} USDT 入金で20 USDTを解除。", alreadyActive:"有効な注文があります。領収書をアップロード、キャンセル、または期限切れを待ってください。", createFirst:"先に入金注文を作成してください。", expiredCreateNew:"期限切れです。新しい注文を作成してください。", chooseFileFirst:"先にスクリーンショットを選択してください。", uploadedWait:"アップロード完了。確認をお待ちください。", cancelConfirm:"この入金注文をキャンセルしますか？", betSuccess:"ベット成功：{tickets} / {shares}" },
  ko: { pool:"풀", deposit:"입금", myBets:"내 베팅", rewards:"보상", language:"언어", depositCrypto:"암호화폐 입금", selectAmount:"USDT 가치 금액 선택", customAmount:"직접 입력 (USDT)", selectPayment:"결제 코인 / 네트워크 선택", youEnter:"입력 금액", needToPay:"결제 금액", createOrder:"입금 주문 생성", creatingOrder:"생성 중...", oneActive:"활성 입금 주문은 1개만 가능합니다. 30분 후 만료됩니다.", activeOrder:"활성 입금 주문", left:"남음", youDeposit:"입금 가치", youPay:"결제", network:"네트워크", rate:"환율", send:"전송", onlyThrough:"전용", wrongNetwork:"잘못된 코인 또는 네트워크는 손실을 초래할 수 있습니다. 결제 후 영수증을 업로드하세요.", cancelOrder:"주문 취소", cancelling:"취소 중...", uploadScreenshot:"결제 스크린샷", uploadDesc:"결제 후 관리자 확인을 위해 스크린샷을 업로드하세요.", pendingAdmin:"관리자 확인 대기", chooseScreenshot:"업로드", fileLimit:"JPG, PNG 최대 5MB", submitScreenshot:"제출", uploading:"업로드 중...", orderExpired:"주문 만료", walletHistory:"지갑 내역", viewAll:"전체 보기", depositHistory:"입금 내역", withdrawHistory:"출금 내역", betHistory:"베팅 내역", winHistory:"당첨 내역", noRecords:"기록 없음.", promo:"보상 / 프로모션", depositBonus:"100 USDT 입금 시 20 USDT 보너스", progress:"진행률", depositMore:"20 USDT 보상을 받으려면 {amount} USDT 더 입금하세요.", alreadyActive:"활성 주문이 있습니다. 영수증 업로드, 취소 또는 만료를 기다리세요.", createFirst:"먼저 입금 주문을 생성하세요.", expiredCreateNew:"만료되었습니다. 새 주문을 생성하세요.", chooseFileFirst:"먼저 스크린샷을 선택하세요.", uploadedWait:"업로드 완료. 확인을 기다리세요.", cancelConfirm:"이 주문을 취소하시겠습니까?", betSuccess:"베팅 성공: {tickets} / {shares}" },
  ru: { pool:"Пул", deposit:"Депозит", myBets:"Мои ставки", rewards:"Награды", language:"Язык", depositCrypto:"Крипто депозит", selectAmount:"Выберите сумму в USDT", customAmount:"Своя сумма (USDT)", selectPayment:"Выберите монету / сеть", youEnter:"Вы вводите", needToPay:"К оплате", createOrder:"Создать депозит", creatingOrder:"Создание...", oneActive:"У игрока может быть только один активный депозит. Истекает через 30 минут.", activeOrder:"Активный депозит", left:"осталось", youDeposit:"Вы вносите", youPay:"Вы платите", network:"Сеть", rate:"Курс", send:"Отправьте", onlyThrough:"только через", wrongNetwork:"Неверная монета или сеть может привести к потере средств. После оплаты загрузите чек.", cancelOrder:"Отменить", cancelling:"Отмена...", uploadScreenshot:"Загрузить чек", uploadDesc:"После оплаты загрузите скриншот для проверки.", pendingAdmin:"Ожидает подтверждения", chooseScreenshot:"Загрузить", fileLimit:"JPG, PNG до 5MB", submitScreenshot:"Отправить", uploading:"Загрузка...", orderExpired:"Заказ истек", walletHistory:"История", viewAll:"Показать все", depositHistory:"Депозиты", withdrawHistory:"Выводы", betHistory:"Ставки", winHistory:"Выигрыши", noRecords:"Записей нет.", promo:"Награды / Акции", depositBonus:"Пополните 100 USDT и получите 20 USDT", progress:"Прогресс", depositMore:"Пополните еще {amount} USDT, чтобы открыть 20 USDT.", alreadyActive:"У вас уже есть активный депозит. Загрузите чек, отмените или дождитесь истечения.", createFirst:"Сначала создайте депозит.", expiredCreateNew:"Заказ истек. Создайте новый.", chooseFileFirst:"Сначала выберите скриншот.", uploadedWait:"Скриншот загружен. Ожидайте подтверждения.", cancelConfirm:"Отменить этот депозит?", betSuccess:"Ставка успешна: {tickets} / {shares}" },
  tr: { pool:"Havuz", deposit:"Yatır", myBets:"Bahislerim", rewards:"Ödüller", language:"Dil", depositCrypto:"Kripto Yatır", selectAmount:"USDT değerinde tutar seç", customAmount:"Özel tutar (USDT değeri)", selectPayment:"Ödeme coin / ağ seç", youEnter:"Girdiğiniz", needToPay:"Ödenecek", createOrder:"Yatırma Emri Oluştur", creatingOrder:"Oluşturuluyor...", oneActive:"Her oyuncu aynı anda yalnızca bir aktif yatırma emri tutabilir. Emir 30 dakika sonra sona erer.", activeOrder:"Aktif Yatırma Emri", left:"kaldı", youDeposit:"Yatırdığınız", youPay:"Ödeyeceğiniz", network:"Ağ", rate:"Kur", send:"Gönder", onlyThrough:"sadece", wrongNetwork:"Yanlış coin veya ağ kalıcı kayba neden olabilir. Gönderdikten sonra dekont yükleyin.", cancelOrder:"Emri İptal Et", cancelling:"İptal ediliyor...", uploadScreenshot:"Ödeme Dekontu Yükle", uploadDesc:"Gönderdikten sonra yönetici onayı için ödeme ekran görüntüsünü yükleyin.", pendingAdmin:"Yönetici onayı bekleniyor", chooseScreenshot:"Dekont Yükle", fileLimit:"JPG, PNG en fazla 5MB", submitScreenshot:"Dekontu Gönder", uploading:"Yükleniyor...", orderExpired:"Emir süresi doldu", walletHistory:"Cüzdan Geçmişi", viewAll:"Tümünü Gör", depositHistory:"Yatırma Geçmişi", withdrawHistory:"Çekim Geçmişi", betHistory:"Bahis Geçmişi", winHistory:"Kazanç Geçmişi", noRecords:"Kayıt yok.", promo:"Ödüller / Promosyon", depositBonus:"100 USDT yatır, 20 USDT bonus al", progress:"İlerleme", depositMore:"20 USDT bonusu açmak için {amount} USDT daha yatır.", alreadyActive:"Zaten aktif bir yatırma emriniz var. Dekont yükleyin, iptal edin veya süresinin dolmasını bekleyin.", createFirst:"Önce yatırma emri oluşturun.", expiredCreateNew:"Emir süresi doldu. Yeni emir oluşturun.", chooseFileFirst:"Önce ekran görüntüsü seçin.", uploadedWait:"Dekont yüklendi. Yönetici onayı bekleniyor.", cancelConfirm:"Bu yatırma emrini iptal etmek istiyor musunuz?", betSuccess:"Bahis başarılı: {tickets} bilet / {shares} pay" },
};


const EXTRA_I18N = {
  en: {
    poolPrizeTitle: "Saba World Cup Pool Prize",
    basePool: "Base Pool",
    liveTeamBetPool: "Live Team Bet Pool",
    btcLuckyDraw: "+ 3 BTC Lucky Draw",
    totalPrizeFormula: "Total Prize Formula",
    formulaBase: "Base Pool 500,000 USD × Share",
    formulaLive: "Live Team Bet Pool × Share",
    formulaBtc: "BTC Draw",
    yourPoolShare: "Your Pool Share",
    drawShare: "Draw Share",
    extraShare: "Extra Share",
    balance: "Balance",
    usdtAvailable: "USDT Available",
    tickets: "Tickets",
    ticket: "Ticket",
    share: "Share",
    bet: "Bet",
    closed: "Closed",
    loadingRealData: "Loading real data...",
    apiError: "API Error",
    searchTeam: "Search team",
    championMarket: "Champion Market",
    earlyBetMoreShare: "Early Bet = More Share",
  },
  zh: {
    poolPrizeTitle: "Saba 世界杯奖池",
    basePool: "基础奖池",
    liveTeamBetPool: "实时球队下注池",
    btcLuckyDraw: "+ 3 BTC 幸运抽奖",
    totalPrizeFormula: "总奖金计算公式",
    formulaBase: "基础奖池 500,000 USD × 分成",
    formulaLive: "实时球队下注池 × 分成",
    formulaBtc: "BTC 抽奖",
    yourPoolShare: "你的奖池分成",
    drawShare: "抽奖分成",
    extraShare: "额外分成",
    balance: "余额",
    usdtAvailable: "可用 USDT",
    tickets: "注数",
    ticket: "注数",
    share: "分成",
    bet: "下注",
    closed: "已关闭",
    loadingRealData: "正在加载真实数据...",
    apiError: "接口错误",
    searchTeam: "搜索球队",
    championMarket: "冠军市场",
    earlyBetMoreShare: "越早下注，分成越多",
  },
  es: {
    poolPrizeTitle: "Premio del Pool Mundial Saba",
    basePool: "Pool Base",
    liveTeamBetPool: "Pool de Apuestas en Vivo",
    btcLuckyDraw: "+ Sorteo de 3 BTC",
    totalPrizeFormula: "Fórmula del Premio Total",
    formulaBase: "Pool Base 500,000 USD × Share",
    formulaLive: "Pool de Apuestas × Share",
    formulaBtc: "Sorteo BTC",
    yourPoolShare: "Tu Share del Pool",
    drawShare: "Share del Sorteo",
    extraShare: "Share Extra",
    balance: "Balance",
    usdtAvailable: "USDT Disponible",
    tickets: "Tickets",
    ticket: "Ticket",
    share: "Share",
    bet: "Apostar",
    closed: "Cerrado",
    loadingRealData: "Cargando datos reales...",
    apiError: "Error API",
    searchTeam: "Buscar equipo",
    championMarket: "Mercado del Campeón",
    earlyBetMoreShare: "Apuesta temprano = Más Share",
  },
  hi: {
    poolPrizeTitle: "Saba वर्ल्ड कप पूल प्राइज़",
    basePool: "बेस पूल",
    liveTeamBetPool: "लाइव टीम बेट पूल",
    btcLuckyDraw: "+ 3 BTC लकी ड्रॉ",
    totalPrizeFormula: "कुल पुरस्कार फॉर्मूला",
    formulaBase: "बेस पूल 500,000 USD × शेयर",
    formulaLive: "लाइव टीम बेट पूल × शेयर",
    formulaBtc: "BTC ड्रॉ",
    yourPoolShare: "आपका पूल शेयर",
    drawShare: "ड्रॉ शेयर",
    extraShare: "एक्स्ट्रा शेयर",
    balance: "बैलेंस",
    usdtAvailable: "उपलब्ध USDT",
    tickets: "टिकट",
    ticket: "टिकट",
    share: "शेयर",
    bet: "बेट",
    closed: "बंद",
    loadingRealData: "रीयल डेटा लोड हो रहा है...",
    apiError: "API त्रुटि",
    searchTeam: "टीम खोजें",
    championMarket: "चैंपियन मार्केट",
    earlyBetMoreShare: "जल्दी बेट = ज्यादा शेयर",
  },
  ar: {
    poolPrizeTitle: "جائزة مجمع كأس العالم Saba",
    basePool: "المجمع الأساسي",
    liveTeamBetPool: "مجمع رهانات الفرق المباشر",
    btcLuckyDraw: "+ سحب حظ 3 BTC",
    totalPrizeFormula: "معادلة الجائزة الإجمالية",
    formulaBase: "المجمع الأساسي 500,000 USD × الحصة",
    formulaLive: "مجمع الفرق المباشر × الحصة",
    formulaBtc: "سحب BTC",
    yourPoolShare: "حصتك في المجمع",
    drawShare: "حصة السحب",
    extraShare: "حصة إضافية",
    balance: "الرصيد",
    usdtAvailable: "USDT متاح",
    tickets: "تذاكر",
    ticket: "تذكرة",
    share: "حصة",
    bet: "راهن",
    closed: "مغلق",
    loadingRealData: "جارٍ تحميل البيانات...",
    apiError: "خطأ API",
    searchTeam: "ابحث عن فريق",
    championMarket: "سوق البطل",
    earlyBetMoreShare: "راهن مبكرًا = حصة أكثر",
  },
  fr: {
    poolPrizeTitle: "Prix du Pool Coupe du Monde Saba",
    basePool: "Pool de Base",
    liveTeamBetPool: "Pool de Paris Équipe Live",
    btcLuckyDraw: "+ Tirage au Sort 3 BTC",
    totalPrizeFormula: "Formule du Prix Total",
    formulaBase: "Pool de Base 500,000 USD × Part",
    formulaLive: "Pool de Paris Live × Part",
    formulaBtc: "Tirage BTC",
    yourPoolShare: "Votre Part du Pool",
    drawShare: "Part du Tirage",
    extraShare: "Part Extra",
    balance: "Solde",
    usdtAvailable: "USDT Disponible",
    tickets: "Tickets",
    ticket: "Ticket",
    share: "Part",
    bet: "Parier",
    closed: "Fermé",
    loadingRealData: "Chargement des données...",
    apiError: "Erreur API",
    searchTeam: "Rechercher une équipe",
    championMarket: "Marché Champion",
    earlyBetMoreShare: "Pari tôt = Plus de parts",
  },
  ja: {
    poolPrizeTitle: "Saba ワールドカッププール賞金",
    basePool: "基本プール",
    liveTeamBetPool: "ライブチームベットプール",
    btcLuckyDraw: "+ 3 BTC ラッキードロー",
    totalPrizeFormula: "総賞金計算式",
    formulaBase: "基本プール 500,000 USD × シェア",
    formulaLive: "ライブチームベットプール × シェア",
    formulaBtc: "BTC ドロー",
    yourPoolShare: "あなたのプールシェア",
    drawShare: "抽選シェア",
    extraShare: "追加シェア",
    balance: "残高",
    usdtAvailable: "利用可能 USDT",
    tickets: "チケット",
    ticket: "チケット",
    share: "シェア",
    bet: "ベット",
    closed: "終了",
    loadingRealData: "実データを読み込み中...",
    apiError: "APIエラー",
    searchTeam: "チーム検索",
    championMarket: "優勝マーケット",
    earlyBetMoreShare: "早期ベット = シェア増加",
  },
  ko: {
    poolPrizeTitle: "Saba 월드컵 풀 상금",
    basePool: "기본 풀",
    liveTeamBetPool: "라이브 팀 베팅 풀",
    btcLuckyDraw: "+ 3 BTC 럭키 드로우",
    totalPrizeFormula: "총상금 계산식",
    formulaBase: "기본 풀 500,000 USD × 쉐어",
    formulaLive: "라이브 팀 베팅 풀 × 쉐어",
    formulaBtc: "BTC 추첨",
    yourPoolShare: "내 풀 쉐어",
    drawShare: "추첨 쉐어",
    extraShare: "추가 쉐어",
    balance: "잔액",
    usdtAvailable: "사용 가능 USDT",
    tickets: "티켓",
    ticket: "티켓",
    share: "쉐어",
    bet: "베팅",
    closed: "마감",
    loadingRealData: "실시간 데이터 로딩 중...",
    apiError: "API 오류",
    searchTeam: "팀 검색",
    championMarket: "우승 시장",
    earlyBetMoreShare: "빠른 베팅 = 더 많은 쉐어",
  },
  ru: {
    poolPrizeTitle: "Призовой пул Saba World Cup",
    basePool: "Базовый пул",
    liveTeamBetPool: "Пул ставок команд",
    btcLuckyDraw: "+ Розыгрыш 3 BTC",
    totalPrizeFormula: "Формула общего приза",
    formulaBase: "Базовый пул 500,000 USD × Доля",
    formulaLive: "Пул ставок команд × Доля",
    formulaBtc: "Розыгрыш BTC",
    yourPoolShare: "Ваша доля пула",
    drawShare: "Доля розыгрыша",
    extraShare: "Доп. доля",
    balance: "Баланс",
    usdtAvailable: "Доступно USDT",
    tickets: "Билеты",
    ticket: "Билет",
    share: "Доля",
    bet: "Ставка",
    closed: "Закрыто",
    loadingRealData: "Загрузка данных...",
    apiError: "Ошибка API",
    searchTeam: "Поиск команды",
    championMarket: "Рынок чемпиона",
    earlyBetMoreShare: "Ранняя ставка = больше долей",
  },
};

Object.keys(EXTRA_I18N).forEach((code) => {
  I18N[code] = { ...(I18N[code] || I18N.en), ...EXTRA_I18N[code] };
});



const FINAL_EXTRA_I18N = {
  en: {
    myTickets:"My Tickets", noBetsYet:"No bets yet.", est:"Est.", platformPromotion:"Platform Promotion",
    missionCenter:"Mission Center", lockedTurnover:"Locked turnover before withdraw", depositMission:"Deposit Mission",
    betMission:"Bet Mission", inviteMission:"Invite Mission", dailyLoginMission:"Daily Login Mission",
    depositTarget:"Deposit {amount} USDT", betTarget:"Bet {amount} USDT", needMore:"Need {amount} USDT more",
    turnoverRequired:"1x turnover required", claimed:"Claimed", claimBonus:"Claim Bonus", notReady:"Not Ready",
    claimBtcShare:"Claim BTC Share", invitePlayer:"Invite player deposit 100 USDT", validInvites:"Valid invites",
    inviteRewardDesc:"Reward includes 10 USDT and 5% player winner pool share reward.",
    sevenDayLogin:"7-Day Login", totalFive:"Total 5 USDT", nextDay:"Next Day {day}",
    claimedToday:"Claimed Today", claimDailyLogin:"Claim Daily Login", rewardsCenter:"Rewards Center",
    firstDepositPack:"First Deposit Pack", referralPartner:"Referral Partner", invited:"Invited", copyInviteLink:"Copy Invite Link",
    inviteLink:"Invite Link", withdraw:"Withdraw", amountUsdt:"Amount USDT", trc20Address:"USDT-TRC20 address",
    createWithdraw:"Create Withdraw", noWalletRecords:"No wallet records.", championBet:"Champion Bet",
    amountMultiple:"Amount, multiple of 10", estimatedWin:"Estimated Win", teamSharePercent:"Team Share %",
    formula:"Formula", ticketRule:"1 Ticket = 10 USDT. Team Share Rate", confirmBet:"Confirm Bet",
    betAmount:"Bet", status:"Status",
  },
  zh: {
    myTickets:"我的票券", noBetsYet:"暂无下注。", est:"预计", platformPromotion:"平台活动",
    missionCenter:"任务中心", lockedTurnover:"提现前未完成流水", depositMission:"充值任务",
    betMission:"下注任务", inviteMission:"邀请任务", dailyLoginMission:"每日登录任务",
    depositTarget:"充值 {amount} USDT", betTarget:"下注 {amount} USDT", needMore:"还需要 {amount} USDT",
    turnoverRequired:"需要 1 倍流水", claimed:"已领取", claimBonus:"领取奖励", notReady:"未完成",
    claimBtcShare:"领取 BTC 分成", invitePlayer:"邀请玩家充值 100 USDT", validInvites:"有效邀请",
    inviteRewardDesc:"奖励包含 10 USDT 和玩家中奖池 5% 分成奖励。",
    sevenDayLogin:"7天登录", totalFive:"总计 5 USDT", nextDay:"第 {day} 天",
    claimedToday:"今日已领取", claimDailyLogin:"领取每日登录奖励", rewardsCenter:"奖励中心",
    firstDepositPack:"首充礼包", referralPartner:"邀请伙伴", invited:"已邀请", copyInviteLink:"复制邀请链接",
    inviteLink:"邀请链接", withdraw:"提现", amountUsdt:"USDT 金额", trc20Address:"USDT-TRC20 地址",
    createWithdraw:"创建提现", noWalletRecords:"暂无钱包记录。", championBet:"冠军下注",
    amountMultiple:"金额，10 的倍数", estimatedWin:"预计可赢", teamSharePercent:"球队分成占比",
    formula:"公式", ticketRule:"1 注 = 10 USDT。球队分成倍率", confirmBet:"确认下注",
    betAmount:"下注", status:"状态",
  },
  es: {
    myTickets:"Mis Tickets", noBetsYet:"Sin apuestas.", est:"Est.", platformPromotion:"Promoción",
    missionCenter:"Centro de Misiones", lockedTurnover:"Turnover bloqueado antes de retirar", depositMission:"Misión de Depósito",
    betMission:"Misión de Apuesta", inviteMission:"Misión de Invitación", dailyLoginMission:"Login Diario",
    depositTarget:"Deposita {amount} USDT", betTarget:"Apuesta {amount} USDT", needMore:"Faltan {amount} USDT",
    turnoverRequired:"1x turnover requerido", claimed:"Reclamado", claimBonus:"Reclamar Bono", notReady:"No Listo",
    claimBtcShare:"Reclamar BTC Share", invitePlayer:"Invita jugador con depósito 100 USDT", validInvites:"Invitaciones válidas",
    inviteRewardDesc:"Incluye 10 USDT y 5% de recompensa del pool del ganador.",
    sevenDayLogin:"Login 7 días", totalFive:"Total 5 USDT", nextDay:"Día {day}",
    claimedToday:"Reclamado Hoy", claimDailyLogin:"Reclamar Login", rewardsCenter:"Centro de Recompensas",
    firstDepositPack:"Pack Primer Depósito", referralPartner:"Socio Referido", invited:"Invitados", copyInviteLink:"Copiar Link",
    inviteLink:"Link de Invitación", withdraw:"Retiro", amountUsdt:"Monto USDT", trc20Address:"Dirección USDT-TRC20",
    createWithdraw:"Crear Retiro", noWalletRecords:"Sin registros.", championBet:"Apuesta Campeón",
    amountMultiple:"Monto, múltiplo de 10", estimatedWin:"Ganancia Estimada", teamSharePercent:"% Share del Equipo",
    formula:"Fórmula", ticketRule:"1 Ticket = 10 USDT. Multiplicador de Share", confirmBet:"Confirmar Apuesta",
    betAmount:"Apuesta", status:"Estado",
  },
  hi: {
    myTickets:"मेरे टिकट", noBetsYet:"कोई बेट नहीं।", est:"अनुमान", platformPromotion:"प्लेटफॉर्म प्रमोशन",
    missionCenter:"मिशन सेंटर", lockedTurnover:"विड्रॉ से पहले लॉक टर्नओवर", depositMission:"डिपॉजिट मिशन",
    betMission:"बेट मिशन", inviteMission:"इनवाइट मिशन", dailyLoginMission:"डेली लॉगिन मिशन",
    depositTarget:"{amount} USDT डिपॉजिट", betTarget:"{amount} USDT बेट", needMore:"{amount} USDT और चाहिए",
    turnoverRequired:"1x टर्नओवर जरूरी", claimed:"क्लेम हो गया", claimBonus:"बोनस क्लेम", notReady:"तैयार नहीं",
    claimBtcShare:"BTC शेयर क्लेम", invitePlayer:"प्लेयर को 100 USDT डिपॉजिट करवाएं", validInvites:"वैलिड इनवाइट",
    inviteRewardDesc:"इनाम में 10 USDT और विजेता पूल शेयर का 5% शामिल है।",
    sevenDayLogin:"7-दिन लॉगिन", totalFive:"कुल 5 USDT", nextDay:"दिन {day}",
    claimedToday:"आज क्लेम हो गया", claimDailyLogin:"डेली लॉगिन क्लेम", rewardsCenter:"रिवॉर्ड सेंटर",
    firstDepositPack:"पहला डिपॉजिट पैक", referralPartner:"रेफरल पार्टनर", invited:"इनवाइट", copyInviteLink:"इनवाइट लिंक कॉपी",
    inviteLink:"इनवाइट लिंक", withdraw:"विड्रॉ", amountUsdt:"USDT राशि", trc20Address:"USDT-TRC20 पता",
    createWithdraw:"विड्रॉ बनाएं", noWalletRecords:"कोई वॉलेट रिकॉर्ड नहीं।", championBet:"चैंपियन बेट",
    amountMultiple:"राशि, 10 का गुणक", estimatedWin:"अनुमानित जीत", teamSharePercent:"टीम शेयर %",
    formula:"फॉर्मूला", ticketRule:"1 टिकट = 10 USDT. टीम शेयर रेट", confirmBet:"बेट कन्फर्म",
    betAmount:"बेट", status:"स्थिति",
  },
  ar: {
    myTickets:"تذاكري", noBetsYet:"لا توجد رهانات.", est:"تقديري", platformPromotion:"عرض المنصة",
    missionCenter:"مركز المهام", lockedTurnover:"الدوران المقفل قبل السحب", depositMission:"مهمة الإيداع",
    betMission:"مهمة الرهان", inviteMission:"مهمة الدعوة", dailyLoginMission:"مهمة تسجيل الدخول",
    depositTarget:"إيداع {amount} USDT", betTarget:"راهن {amount} USDT", needMore:"تحتاج {amount} USDT إضافية",
    turnoverRequired:"مطلوب دوران 1x", claimed:"تم الاستلام", claimBonus:"استلام المكافأة", notReady:"غير جاهز",
    claimBtcShare:"استلام حصة BTC", invitePlayer:"ادعُ لاعبًا لإيداع 100 USDT", validInvites:"دعوات صالحة",
    inviteRewardDesc:"المكافأة تشمل 10 USDT و5% من حصة مجمع الفائز.",
    sevenDayLogin:"تسجيل 7 أيام", totalFive:"المجموع 5 USDT", nextDay:"اليوم {day}",
    claimedToday:"تم اليوم", claimDailyLogin:"استلام تسجيل الدخول", rewardsCenter:"مركز المكافآت",
    firstDepositPack:"حزمة أول إيداع", referralPartner:"شريك الإحالة", invited:"تمت الدعوة", copyInviteLink:"نسخ رابط الدعوة",
    inviteLink:"رابط الدعوة", withdraw:"سحب", amountUsdt:"مبلغ USDT", trc20Address:"عنوان USDT-TRC20",
    createWithdraw:"إنشاء سحب", noWalletRecords:"لا توجد سجلات محفظة.", championBet:"رهان البطل",
    amountMultiple:"المبلغ، مضاعف 10", estimatedWin:"الربح المتوقع", teamSharePercent:"نسبة حصة الفريق",
    formula:"المعادلة", ticketRule:"1 تذكرة = 10 USDT. معدل حصة الفريق", confirmBet:"تأكيد الرهان",
    betAmount:"رهان", status:"الحالة",
  },
  fr: {
    myTickets:"Mes Tickets", noBetsYet:"Aucun pari.", est:"Est.", platformPromotion:"Promotion",
    missionCenter:"Centre des Missions", lockedTurnover:"Turnover bloqué avant retrait", depositMission:"Mission Dépôt",
    betMission:"Mission Pari", inviteMission:"Mission Invitation", dailyLoginMission:"Connexion Quotidienne",
    depositTarget:"Déposer {amount} USDT", betTarget:"Parier {amount} USDT", needMore:"Encore {amount} USDT",
    turnoverRequired:"Turnover 1x requis", claimed:"Réclamé", claimBonus:"Réclamer Bonus", notReady:"Pas Prêt",
    claimBtcShare:"Réclamer Part BTC", invitePlayer:"Inviter joueur dépôt 100 USDT", validInvites:"Invitations valides",
    inviteRewardDesc:"Récompense de 10 USDT et 5% de part du pool gagnant.",
    sevenDayLogin:"Connexion 7 jours", totalFive:"Total 5 USDT", nextDay:"Jour {day}",
    claimedToday:"Réclamé Aujourd’hui", claimDailyLogin:"Réclamer Connexion", rewardsCenter:"Centre Récompenses",
    firstDepositPack:"Pack Premier Dépôt", referralPartner:"Partenaire Référence", invited:"Invités", copyInviteLink:"Copier Lien",
    inviteLink:"Lien d’invitation", withdraw:"Retrait", amountUsdt:"Montant USDT", trc20Address:"Adresse USDT-TRC20",
    createWithdraw:"Créer Retrait", noWalletRecords:"Aucun historique.", championBet:"Pari Champion",
    amountMultiple:"Montant, multiple de 10", estimatedWin:"Gain Estimé", teamSharePercent:"% Part Équipe",
    formula:"Formule", ticketRule:"1 Ticket = 10 USDT. Taux de part équipe", confirmBet:"Confirmer Pari",
    betAmount:"Pari", status:"Statut",
  },
  ja: {
    myTickets:"マイチケット", noBetsYet:"ベットはありません。", est:"予想", platformPromotion:"プロモーション",
    missionCenter:"ミッションセンター", lockedTurnover:"出金前の未達成流水", depositMission:"入金ミッション",
    betMission:"ベットミッション", inviteMission:"招待ミッション", dailyLoginMission:"デイリーログイン",
    depositTarget:"{amount} USDT入金", betTarget:"{amount} USDTベット", needMore:"あと {amount} USDT",
    turnoverRequired:"1x流水が必要", claimed:"受取済み", claimBonus:"ボーナス受取", notReady:"未達成",
    claimBtcShare:"BTCシェア受取", invitePlayer:"100 USDT入金プレイヤーを招待", validInvites:"有効招待",
    inviteRewardDesc:"10 USDTと勝者プールシェア5%報酬を含みます。",
    sevenDayLogin:"7日ログイン", totalFive:"合計5 USDT", nextDay:"{day}日目",
    claimedToday:"本日受取済み", claimDailyLogin:"ログイン報酬受取", rewardsCenter:"報酬センター",
    firstDepositPack:"初回入金パック", referralPartner:"紹介パートナー", invited:"招待済み", copyInviteLink:"招待リンクコピー",
    inviteLink:"招待リンク", withdraw:"出金", amountUsdt:"USDT金額", trc20Address:"USDT-TRC20アドレス",
    createWithdraw:"出金作成", noWalletRecords:"記録なし。", championBet:"優勝ベット",
    amountMultiple:"金額、10の倍数", estimatedWin:"予想勝利額", teamSharePercent:"チームシェア%",
    formula:"計算式", ticketRule:"1チケット = 10 USDT。チームシェア倍率", confirmBet:"ベット確認",
    betAmount:"ベット", status:"状態",
  },
  ko: {
    myTickets:"내 티켓", noBetsYet:"베팅 없음.", est:"예상", platformPromotion:"플랫폼 프로모션",
    missionCenter:"미션 센터", lockedTurnover:"출금 전 잠긴 롤링", depositMission:"입금 미션",
    betMission:"베팅 미션", inviteMission:"초대 미션", dailyLoginMission:"데일리 로그인",
    depositTarget:"{amount} USDT 입금", betTarget:"{amount} USDT 베팅", needMore:"{amount} USDT 더 필요",
    turnoverRequired:"1x 롤링 필요", claimed:"수령 완료", claimBonus:"보너스 수령", notReady:"미완료",
    claimBtcShare:"BTC 쉐어 수령", invitePlayer:"100 USDT 입금 유저 초대", validInvites:"유효 초대",
    inviteRewardDesc:"10 USDT와 당첨 풀 쉐어 5% 보상이 포함됩니다.",
    sevenDayLogin:"7일 로그인", totalFive:"총 5 USDT", nextDay:"{day}일차",
    claimedToday:"오늘 수령 완료", claimDailyLogin:"로그인 보상 수령", rewardsCenter:"보상 센터",
    firstDepositPack:"첫 입금 팩", referralPartner:"추천 파트너", invited:"초대", copyInviteLink:"초대 링크 복사",
    inviteLink:"초대 링크", withdraw:"출금", amountUsdt:"USDT 금액", trc20Address:"USDT-TRC20 주소",
    createWithdraw:"출금 생성", noWalletRecords:"지갑 기록 없음.", championBet:"우승 베팅",
    amountMultiple:"금액, 10의 배수", estimatedWin:"예상 승리금", teamSharePercent:"팀 쉐어 %",
    formula:"공식", ticketRule:"1 티켓 = 10 USDT. 팀 쉐어 배율", confirmBet:"베팅 확인",
    betAmount:"베팅", status:"상태",
  },
  ru: {
    myTickets:"Мои билеты", noBetsYet:"Ставок нет.", est:"Оценка", platformPromotion:"Акция платформы",
    missionCenter:"Центр миссий", lockedTurnover:"Заблокированный оборот до вывода", depositMission:"Миссия депозита",
    betMission:"Миссия ставок", inviteMission:"Миссия приглашения", dailyLoginMission:"Ежедневный вход",
    depositTarget:"Депозит {amount} USDT", betTarget:"Ставка {amount} USDT", needMore:"Нужно еще {amount} USDT",
    turnoverRequired:"Требуется оборот 1x", claimed:"Получено", claimBonus:"Получить бонус", notReady:"Не готово",
    claimBtcShare:"Получить BTC долю", invitePlayer:"Пригласить игрока с депозитом 100 USDT", validInvites:"Действительные приглашения",
    inviteRewardDesc:"Награда включает 10 USDT и 5% доли пула победителя.",
    sevenDayLogin:"7-дневный вход", totalFive:"Всего 5 USDT", nextDay:"День {day}",
    claimedToday:"Получено сегодня", claimDailyLogin:"Получить вход", rewardsCenter:"Центр наград",
    firstDepositPack:"Пакет первого депозита", referralPartner:"Реферальный партнер", invited:"Приглашено", copyInviteLink:"Копировать ссылку",
    inviteLink:"Ссылка приглашения", withdraw:"Вывод", amountUsdt:"Сумма USDT", trc20Address:"Адрес USDT-TRC20",
    createWithdraw:"Создать вывод", noWalletRecords:"Нет записей кошелька.", championBet:"Ставка на чемпиона",
    amountMultiple:"Сумма, кратная 10", estimatedWin:"Ожидаемый выигрыш", teamSharePercent:"% доли команды",
    formula:"Формула", ticketRule:"1 билет = 10 USDT. Коэффициент доли команды", confirmBet:"Подтвердить ставку",
    betAmount:"Ставка", status:"Статус",
  },
};

Object.keys(FINAL_EXTRA_I18N).forEach((code) => {
  I18N[code] = { ...(I18N[code] || I18N.en), ...FINAL_EXTRA_I18N[code] };
});

const STRICT_FINAL_I18N = {
  en: { share:"Profit Unit", shares:"Profit Units", yourPoolShare:"Your Prize Unit", drawShare:"Draw Unit", extraShare:"Extra Bonus", formulaBase:"Base Pool 500,000 USD × Prize Unit", formulaLive:"Live Team Bet Pool × Prize Unit", teamSharePercent:"Team Unit %", betSuccess:"Bet success: {tickets} tickets / {shares} profit units", active:"Active", completed:"Completed", pending:"Pending", cancelled:"Cancelled", canceled:"Cancelled", rejected:"Rejected", estimatedWin:"Estimated Win", confirmBet:"Confirm Bet", betAmount:"Bet", championBet:"Champion Bet", amountMultiple:"Amount, multiple of 10", rateRealtime:"Binance realtime", rateLoading:"Binance realtime loading...", rateFailed:"Rate load failed", shareRateLabel:"Team unit multiplier", totalPrizeFormula:"Total Prize Formula", liveTeamBetPool:"Live Team Bet Pool", depositTarget:"Deposit {amount} USDT", needMore:"Need {amount} USDT more" },
  zh: { share:"分成", shares:"分成", yourPoolShare:"你的奖池分成", drawShare:"抽奖分成", extraShare:"额外加成", formulaBase:"基础奖池 500,000 USD × 分成", formulaLive:"实时球队下注池 × 分成", teamSharePercent:"球队分成占比", betSuccess:"下注成功：{tickets} 注 / {shares} 分成", active:"进行中", completed:"已完成", pending:"待处理", cancelled:"已取消", canceled:"已取消", rejected:"已拒绝", estimatedWin:"预计可赢", confirmBet:"确认下注", betAmount:"下注", championBet:"冠军下注", amountMultiple:"金额，10 的倍数", rateRealtime:"Binance 实时汇率", rateLoading:"Binance 实时汇率加载中...", rateFailed:"汇率加载失败", shareRateLabel:"球队分成倍率", totalPrizeFormula:"总奖金计算公式", liveTeamBetPool:"实时球队下注池", depositTarget:"充值 {amount} USDT", needMore:"还需要 {amount} USDT" },
  es: { share:"Unidad", shares:"Unidades", active:"Activo", completed:"Completado", pending:"Pendiente", cancelled:"Cancelado", canceled:"Cancelado", rejected:"Rechazado", rateRealtime:"Binance en tiempo real", rateLoading:"Cargando tasa Binance...", rateFailed:"Error de tasa" },
  hi: { share:"प्रॉफिट यूनिट", shares:"प्रॉफिट यूनिट", active:"सक्रिय", completed:"पूरा", pending:"लंबित", cancelled:"रद्द", canceled:"रद्द", rejected:"अस्वीकृत", rateRealtime:"Binance लाइव रेट", rateLoading:"Binance रेट लोड हो रहा है...", rateFailed:"रेट लोड विफल" },
  ar: { share:"وحدة ربح", shares:"وحدات ربح", active:"نشط", completed:"مكتمل", pending:"قيد الانتظار", cancelled:"ملغي", canceled:"ملغي", rejected:"مرفوض", rateRealtime:"سعر Binance مباشر", rateLoading:"جارٍ تحميل سعر Binance...", rateFailed:"فشل تحميل السعر" },
  fr: { share:"Unité", shares:"Unités", active:"Actif", completed:"Terminé", pending:"En attente", cancelled:"Annulé", canceled:"Annulé", rejected:"Rejeté", rateRealtime:"Taux Binance en direct", rateLoading:"Chargement du taux Binance...", rateFailed:"Échec du taux" },
  ja: { share:"分配ユニット", shares:"分配ユニット", active:"進行中", completed:"完了", pending:"保留中", cancelled:"キャンセル", canceled:"キャンセル", rejected:"拒否", rateRealtime:"Binanceリアルタイム", rateLoading:"Binanceレート読み込み中...", rateFailed:"レート取得失敗" },
  ko: { share:"분배 유닛", shares:"분배 유닛", active:"진행 중", completed:"완료", pending:"대기 중", cancelled:"취소됨", canceled:"취소됨", rejected:"거절됨", rateRealtime:"Binance 실시간", rateLoading:"Binance 시세 로딩 중...", rateFailed:"시세 로드 실패" },
  ru: { share:"Доля", shares:"Доли", active:"Активно", completed:"Завершено", pending:"Ожидает", cancelled:"Отменено", canceled:"Отменено", rejected:"Отклонено", rateRealtime:"Binance realtime", rateLoading:"Загрузка курса Binance...", rateFailed:"Ошибка курса" },
  tr: { share:"Pay", shares:"Paylar", yourPoolShare:"Havuz Payınız", drawShare:"Çekiliş Payı", extraShare:"Ek Pay", basePool:"Temel Havuz", liveTeamBetPool:"Canlı Takım Bahis Havuzu", poolPrizeTitle:"Saba Dünya Kupası Ödül Havuzu", btcLuckyDraw:"+ 3 BTC Şans Çekilişi", active:"Aktif", completed:"Tamamlandı", pending:"Beklemede", cancelled:"İptal edildi", canceled:"İptal edildi", rejected:"Reddedildi", estimatedWin:"Tahmini Kazanç", confirmBet:"Bahsi Onayla", betAmount:"Bahis", championBet:"Şampiyon Bahsi", amountMultiple:"Tutar, 10'un katı", rateRealtime:"Binance canlı kur", rateLoading:"Binance kuru yükleniyor...", rateFailed:"Kur yüklenemedi", shareRateLabel:"Takım pay çarpanı", totalPrizeFormula:"Toplam Ödül Formülü", depositTarget:"{amount} USDT yatır", needMore:"{amount} USDT daha gerekli" },
};
Object.keys(STRICT_FINAL_I18N).forEach((code) => { I18N[code] = { ...(I18N[code] || I18N.en), ...STRICT_FINAL_I18N[code] }; });
function statusLabel(t, status) { const key = String(status || "active").toLowerCase(); return t(key) || status || ""; }

const V4_COMPLETE_I18N = {
  "en": {
    "activeOrder": "Active Deposit Order",
    "alreadyActive": "You already have an active order. Upload receipt, cancel it, or wait for expiry.",
    "amountMultiple": "Amount, multiple of 10",
    "amountUsdt": "USDT Amount",
    "apiError": "API Error",
    "balance": "Balance",
    "basePool": "Base Pool",
    "bet": "Bet",
    "betAmount": "Bet Amount",
    "betHistory": "Bet History",
    "betMission": "Bet Mission",
    "betSuccess": "Bet successful: {tickets} tickets / {shares} shares",
    "betTarget": "Bet {amount} USDT",
    "btcLuckyDraw": "+ 3 BTC Lucky Draw",
    "cancelConfirm": "Cancel this deposit order?",
    "cancelOrder": "Cancel Order",
    "cancelling": "Cancelling...",
    "championBet": "Champion Bet",
    "championMarket": "Champion Market",
    "chooseFileFirst": "Choose a screenshot first.",
    "chooseScreenshot": "Choose Screenshot",
    "claimBonus": "Claim Bonus",
    "claimBtcShare": "Claim BTC Share",
    "claimDailyLogin": "Claim Daily Login",
    "claimed": "Claimed",
    "claimedToday": "Claimed Today",
    "closed": "Closed",
    "confirmBet": "Confirm Bet",
    "copyInviteLink": "Copy Invite Link",
    "createFirst": "Create a deposit order first.",
    "createOrder": "Create Deposit Order",
    "createWithdraw": "Create Withdraw",
    "creatingOrder": "Creating Order...",
    "customAmount": "Custom amount (USDT value)",
    "dailyLoginMission": "Daily Login Mission",
    "deposit": "Deposit",
    "depositBonus": "Deposit 100 USDT, get 20 USDT bonus",
    "depositHistory": "Deposit History",
    "depositMission": "Deposit Mission",
    "depositMore": "Deposit {amount} USDT more to unlock 20 USDT.",
    "depositTarget": "Deposit {amount} USDT",
    "drawShare": "Draw Share",
    "earlyBetMoreShare": "Early Bet = More Share",
    "est": "Est.",
    "estimatedWin": "Estimated Win",
    "expiredCreateNew": "Order expired. Create a new one.",
    "extraShare": "Extra Share",
    "fileLimit": "JPG, PNG up to 5MB",
    "firstDepositPack": "First Deposit Pack",
    "formula": "Formula",
    "formulaBase": "Base Pool 500,000 USD × Share",
    "formulaBtc": "BTC Draw",
    "formulaLive": "Live Team Bet Pool × Share",
    "inviteLink": "Invite Link",
    "inviteMission": "Invite Mission",
    "invitePlayer": "Invite player with 100 USDT deposit",
    "inviteRewardDesc": "Reward includes 10 USDT and 5% of winner pool share.",
    "invited": "Invited",
    "language": "Language",
    "left": "left",
    "liveTeamBetPool": "Live Team Bet Pool",
    "loadingRealData": "Loading real data...",
    "lockedTurnover": "Locked turnover before withdraw",
    "missionCenter": "Mission Center",
    "myBets": "My Bets",
    "myTickets": "My Tickets",
    "needMore": "Need {amount} USDT more",
    "needToPay": "Need to pay",
    "network": "Network",
    "nextDay": "Day {day}",
    "noBetsYet": "No bets yet.",
    "noRecords": "No records.",
    "noWalletRecords": "No wallet records.",
    "notReady": "Not Ready",
    "oneActive": "One player can only keep one active deposit order. Order expires in 30 minutes.",
    "onlyThrough": "only through",
    "orderExpired": "Order Expired",
    "pendingAdmin": "Pending admin confirmation",
    "platformPromotion": "Platform Promotion",
    "pool": "Pool",
    "poolPrizeTitle": "Saba World Cup Pool Prize",
    "progress": "Progress",
    "promo": "Rewards / Promotion",
    "rate": "Rate",
    "rateFailed": "Rate load failed",
    "rateLoading": "Binance realtime loading...",
    "rateRealtime": "Binance realtime",
    "referralPartner": "Referral Partner",
    "rewards": "Rewards",
    "rewardsCenter": "Rewards Center",
    "searchTeam": "Search team",
    "selectAmount": "Select amount in USDT value",
    "selectPayment": "Select payment coin / network",
    "send": "Send",
    "sevenDayLogin": "7-Day Login",
    "share": "Share",
    "shares": "Shares",
    "submitScreenshot": "Submit Screenshot",
    "teamSharePercent": "Team Share Percent",
    "telegram_id": "Telegram ID",
    "ticket": "Ticket",
    "ticketRule": "1 Ticket = 10 USDT. Team share multiplier",
    "tickets": "Tickets",
    "totalFive": "Total 5 USDT",
    "totalPrizeFormula": "Total Prize Formula",
    "trc20Address": "USDT-TRC20 Address",
    "turnoverRequired": "1x turnover required",
    "uploadDesc": "After payment, upload your screenshot for admin review.",
    "uploadScreenshot": "Upload Payment Screenshot",
    "uploadedWait": "Screenshot uploaded. Please wait for confirmation.",
    "uploading": "Uploading...",
    "usdtAvailable": "USDT Available",
    "validInvites": "Valid Invites",
    "viewAll": "View All",
    "walletHistory": "Wallet History",
    "winHistory": "Win History",
    "withdraw": "Withdraw",
    "withdrawHistory": "Withdraw History",
    "wrongNetwork": "Wrong coin or wrong network may cause permanent loss. Upload receipt after sending.",
    "youDeposit": "You deposit",
    "youEnter": "You enter",
    "youPay": "You pay",
    "yourPoolShare": "Your Pool Share"
  },
  "zh": {
    "activeOrder": "进行中的充值订单",
    "alreadyActive": "你已有进行中的充值订单，请上传截图、取消订单或等待过期。",
    "amountMultiple": "金额，10 的倍数",
    "amountUsdt": "USDT 金额",
    "apiError": "接口错误",
    "balance": "余额",
    "basePool": "基础奖池",
    "bet": "下注",
    "betAmount": "下注金额",
    "betHistory": "下注记录",
    "betMission": "下注任务",
    "betSuccess": "下注成功：{tickets} 注 / {shares} 分成",
    "betTarget": "下注 {amount} USDT",
    "btcLuckyDraw": "+ 3 BTC 幸运抽奖",
    "cancelConfirm": "确定取消这个充值订单吗？",
    "cancelOrder": "取消订单",
    "cancelling": "正在取消...",
    "championBet": "冠军下注",
    "championMarket": "冠军市场",
    "chooseFileFirst": "请先选择付款截图。",
    "chooseScreenshot": "选择截图",
    "claimBonus": "领取奖金",
    "claimBtcShare": "领取 BTC 抽奖分成",
    "claimDailyLogin": "领取每日登录奖励",
    "claimed": "已领取",
    "claimedToday": "今日已领取",
    "closed": "已关闭",
    "confirmBet": "确认下注",
    "copyInviteLink": "复制邀请链接",
    "createFirst": "请先创建充值订单。",
    "createOrder": "创建充值订单",
    "createWithdraw": "创建提现",
    "creatingOrder": "正在创建...",
    "customAmount": "自定义金额（USDT）",
    "dailyLoginMission": "每日登录任务",
    "deposit": "充值",
    "depositBonus": "充值 100 USDT，领取 20 USDT 奖励",
    "depositHistory": "充值记录",
    "depositMission": "充值任务",
    "depositMore": "再充值 {amount} USDT 可解锁 20 USDT。",
    "depositTarget": "充值 {amount} USDT",
    "drawShare": "抽奖分成",
    "earlyBetMoreShare": "越早下注，分成越多",
    "est": "预计",
    "estimatedWin": "预计可赢",
    "expiredCreateNew": "订单已过期，请创建新订单。",
    "extraShare": "额外分成",
    "fileLimit": "JPG、PNG，最大 5MB",
    "firstDepositPack": "首充礼包",
    "formula": "公式",
    "formulaBase": "基础奖池 500,000 USD × 分成",
    "formulaBtc": "BTC 抽奖",
    "formulaLive": "实时球队下注池 × 分成",
    "inviteLink": "邀请链接",
    "inviteMission": "邀请任务",
    "invitePlayer": "邀请玩家充值 100 USDT",
    "inviteRewardDesc": "奖励包含 10 USDT 以及冠军池 5% 分成。",
    "invited": "已邀请",
    "language": "语言",
    "left": "剩余",
    "liveTeamBetPool": "实时球队下注池",
    "loadingRealData": "正在加载真实数据...",
    "lockedTurnover": "提现前锁定流水",
    "missionCenter": "任务中心",
    "myBets": "我的下注",
    "myTickets": "我的票券",
    "needMore": "还需要 {amount} USDT",
    "needToPay": "需要支付",
    "network": "网络",
    "nextDay": "第 {day} 天",
    "noBetsYet": "暂无下注。",
    "noRecords": "暂无记录。",
    "noWalletRecords": "暂无钱包记录。",
    "notReady": "未达成",
    "oneActive": "每个玩家同一时间只能保留一个进行中的充值订单，30 分钟后过期。",
    "onlyThrough": "仅通过",
    "orderExpired": "订单已过期",
    "pendingAdmin": "等待后台确认",
    "platformPromotion": "平台活动",
    "pool": "奖池",
    "poolPrizeTitle": "Saba 世界杯奖池",
    "progress": "进度",
    "promo": "奖励 / 活动",
    "rate": "汇率",
    "rateFailed": "汇率加载失败",
    "rateLoading": "Binance 实时汇率加载中...",
    "rateRealtime": "Binance 实时汇率",
    "referralPartner": "邀请伙伴",
    "rewards": "奖励",
    "rewardsCenter": "奖励中心",
    "searchTeam": "搜索球队",
    "selectAmount": "选择 USDT 金额",
    "selectPayment": "选择付款币种 / 网络",
    "send": "发送",
    "sevenDayLogin": "7 天登录",
    "share": "分成",
    "shares": "分成",
    "submitScreenshot": "提交截图",
    "teamSharePercent": "球队分成占比",
    "telegram_id": "Telegram ID",
    "ticket": "注",
    "ticketRule": "1 注 = 10 USDT。球队分成倍率",
    "tickets": "注数",
    "totalFive": "总计 5 USDT",
    "totalPrizeFormula": "总奖金计算公式",
    "trc20Address": "USDT-TRC20 地址",
    "turnoverRequired": "需要 1 倍流水",
    "uploadDesc": "付款后请上传截图，等待后台人工审核。",
    "uploadScreenshot": "上传付款截图",
    "uploadedWait": "截图已上传，请等待确认。",
    "uploading": "上传中...",
    "usdtAvailable": "可用 USDT",
    "validInvites": "有效邀请",
    "viewAll": "查看全部",
    "walletHistory": "钱包记录",
    "winHistory": "中奖记录",
    "withdraw": "提现",
    "withdrawHistory": "提现记录",
    "wrongNetwork": "错误币种或错误网络可能造成永久损失。付款后请上传截图。",
    "youDeposit": "你充值",
    "youEnter": "你输入",
    "youPay": "你支付",
    "yourPoolShare": "你的奖池分成"
  },
  "es": {
    "activeOrder": "Active Deposit Order",
    "alreadyActive": "You already have an active order. Upload receipt, cancel it, or wait for expiry.",
    "amountMultiple": "Monto, múltiplo de 10",
    "amountUsdt": "USDT Amount",
    "apiError": "Error API",
    "balance": "Saldo",
    "basePool": "Base Pool",
    "bet": "Apostar",
    "betAmount": "Bet Amount",
    "betHistory": "Bet History",
    "betMission": "Bet Mission",
    "betSuccess": "Bet successful: {tickets} tickets / {shares} shares",
    "betTarget": "Bet {amount} USDT",
    "btcLuckyDraw": "+ 3 BTC Lucky Draw",
    "cancelConfirm": "Cancel this deposit order?",
    "cancelOrder": "Cancel Order",
    "cancelling": "Cancelling...",
    "championBet": "Apuesta campeón",
    "championMarket": "Champion Market",
    "chooseFileFirst": "Choose a screenshot first.",
    "chooseScreenshot": "Choose Screenshot",
    "claimBonus": "Claim Bonus",
    "claimBtcShare": "Claim BTC Share",
    "claimDailyLogin": "Claim Daily Login",
    "claimed": "Claimed",
    "claimedToday": "Claimed Today",
    "closed": "Cerrado",
    "confirmBet": "Confirmar apuesta",
    "copyInviteLink": "Copy Invite Link",
    "createFirst": "Create a deposit order first.",
    "createOrder": "Create Deposit Order",
    "createWithdraw": "Crear retiro",
    "creatingOrder": "Creating Order...",
    "customAmount": "Custom amount (USDT value)",
    "dailyLoginMission": "Daily Login Mission",
    "deposit": "Depósito",
    "depositBonus": "Deposit 100 USDT, get 20 USDT bonus",
    "depositHistory": "Deposit History",
    "depositMission": "Deposit Mission",
    "depositMore": "Deposit {amount} USDT more to unlock 20 USDT.",
    "depositTarget": "Deposit {amount} USDT",
    "drawShare": "Draw Share",
    "earlyBetMoreShare": "Early Bet = More Share",
    "est": "Est.",
    "estimatedWin": "Ganancia estimada",
    "expiredCreateNew": "Order expired. Create a new one.",
    "extraShare": "Extra Share",
    "fileLimit": "JPG, PNG up to 5MB",
    "firstDepositPack": "First Deposit Pack",
    "formula": "Formula",
    "formulaBase": "Base Pool 500,000 USD × Share",
    "formulaBtc": "BTC Draw",
    "formulaLive": "Live Team Bet Pool × Share",
    "inviteLink": "Invite Link",
    "inviteMission": "Invite Mission",
    "invitePlayer": "Invite player with 100 USDT deposit",
    "inviteRewardDesc": "Reward includes 10 USDT and 5% of winner pool share.",
    "invited": "Invited",
    "language": "Idioma",
    "left": "left",
    "liveTeamBetPool": "Live Team Bet Pool",
    "loadingRealData": "Cargando datos reales...",
    "lockedTurnover": "Locked turnover before withdraw",
    "missionCenter": "Mission Center",
    "myBets": "Mis apuestas",
    "myTickets": "My Tickets",
    "needMore": "Need {amount} USDT more",
    "needToPay": "Need to pay",
    "network": "Network",
    "nextDay": "Day {day}",
    "noBetsYet": "No bets yet.",
    "noRecords": "No records.",
    "noWalletRecords": "No wallet records.",
    "notReady": "Not Ready",
    "oneActive": "One player can only keep one active deposit order. Order expires in 30 minutes.",
    "onlyThrough": "only through",
    "orderExpired": "Order Expired",
    "pendingAdmin": "Pending admin confirmation",
    "platformPromotion": "Platform Promotion",
    "pool": "Pool",
    "poolPrizeTitle": "Saba World Cup Pool Prize",
    "progress": "Progress",
    "promo": "Rewards / Promotion",
    "rate": "Rate",
    "rateFailed": "Rate load failed",
    "rateLoading": "Binance realtime loading...",
    "rateRealtime": "Binance realtime",
    "referralPartner": "Referral Partner",
    "rewards": "Recompensas",
    "rewardsCenter": "Rewards Center",
    "searchTeam": "Buscar equipo",
    "selectAmount": "Select amount in USDT value",
    "selectPayment": "Select payment coin / network",
    "send": "Send",
    "sevenDayLogin": "7-Day Login",
    "share": "Share",
    "shares": "Shares",
    "submitScreenshot": "Enviar captura",
    "teamSharePercent": "Team Share Percent",
    "telegram_id": "Telegram ID",
    "ticket": "Ticket",
    "ticketRule": "1 Ticket = 10 USDT. Team share multiplier",
    "tickets": "Tickets",
    "totalFive": "Total 5 USDT",
    "totalPrizeFormula": "Total Prize Formula",
    "trc20Address": "USDT-TRC20 Address",
    "turnoverRequired": "1x turnover required",
    "uploadDesc": "Después del pago, sube la captura para revisión manual.",
    "uploadScreenshot": "Subir captura de pago",
    "uploadedWait": "Screenshot uploaded. Please wait for confirmation.",
    "uploading": "Uploading...",
    "usdtAvailable": "USDT Available",
    "validInvites": "Valid Invites",
    "viewAll": "View All",
    "walletHistory": "Wallet History",
    "winHistory": "Win History",
    "withdraw": "Retiro",
    "withdrawHistory": "Withdraw History",
    "wrongNetwork": "Wrong coin or wrong network may cause permanent loss. Upload receipt after sending.",
    "youDeposit": "You deposit",
    "youEnter": "You enter",
    "youPay": "You pay",
    "yourPoolShare": "Your Pool Share",
    "active": "Activo",
    "completed": "Completado",
    "pending": "Pendiente",
    "cancelled": "Cancelado",
    "canceled": "Cancelado",
    "rejected": "Rechazado"
  },
  "hi": {
    "activeOrder": "Active Deposit Order",
    "alreadyActive": "You already have an active order. Upload receipt, cancel it, or wait for expiry.",
    "amountMultiple": "राशि, 10 का गुणक",
    "amountUsdt": "USDT Amount",
    "apiError": "API त्रुटि",
    "balance": "बैलेंस",
    "basePool": "Base Pool",
    "bet": "बेट",
    "betAmount": "Bet Amount",
    "betHistory": "Bet History",
    "betMission": "Bet Mission",
    "betSuccess": "Bet successful: {tickets} tickets / {shares} shares",
    "betTarget": "Bet {amount} USDT",
    "btcLuckyDraw": "+ 3 BTC Lucky Draw",
    "cancelConfirm": "Cancel this deposit order?",
    "cancelOrder": "Cancel Order",
    "cancelling": "Cancelling...",
    "championBet": "चैंपियन बेट",
    "championMarket": "Champion Market",
    "chooseFileFirst": "Choose a screenshot first.",
    "chooseScreenshot": "Choose Screenshot",
    "claimBonus": "Claim Bonus",
    "claimBtcShare": "Claim BTC Share",
    "claimDailyLogin": "Claim Daily Login",
    "claimed": "Claimed",
    "claimedToday": "Claimed Today",
    "closed": "बंद",
    "confirmBet": "बेट कन्फर्म",
    "copyInviteLink": "Copy Invite Link",
    "createFirst": "Create a deposit order first.",
    "createOrder": "Create Deposit Order",
    "createWithdraw": "विड्रॉ बनाएं",
    "creatingOrder": "Creating Order...",
    "customAmount": "Custom amount (USDT value)",
    "dailyLoginMission": "Daily Login Mission",
    "deposit": "डिपॉजिट",
    "depositBonus": "Deposit 100 USDT, get 20 USDT bonus",
    "depositHistory": "Deposit History",
    "depositMission": "Deposit Mission",
    "depositMore": "Deposit {amount} USDT more to unlock 20 USDT.",
    "depositTarget": "Deposit {amount} USDT",
    "drawShare": "Draw Share",
    "earlyBetMoreShare": "Early Bet = More Share",
    "est": "Est.",
    "estimatedWin": "अनुमानित जीत",
    "expiredCreateNew": "Order expired. Create a new one.",
    "extraShare": "Extra Share",
    "fileLimit": "JPG, PNG up to 5MB",
    "firstDepositPack": "First Deposit Pack",
    "formula": "Formula",
    "formulaBase": "Base Pool 500,000 USD × Share",
    "formulaBtc": "BTC Draw",
    "formulaLive": "Live Team Bet Pool × Share",
    "inviteLink": "Invite Link",
    "inviteMission": "Invite Mission",
    "invitePlayer": "Invite player with 100 USDT deposit",
    "inviteRewardDesc": "Reward includes 10 USDT and 5% of winner pool share.",
    "invited": "Invited",
    "language": "भाषा",
    "left": "left",
    "liveTeamBetPool": "Live Team Bet Pool",
    "loadingRealData": "रीयल डेटा लोड हो रहा है...",
    "lockedTurnover": "Locked turnover before withdraw",
    "missionCenter": "Mission Center",
    "myBets": "मेरी बेट",
    "myTickets": "My Tickets",
    "needMore": "Need {amount} USDT more",
    "needToPay": "Need to pay",
    "network": "Network",
    "nextDay": "Day {day}",
    "noBetsYet": "No bets yet.",
    "noRecords": "No records.",
    "noWalletRecords": "No wallet records.",
    "notReady": "Not Ready",
    "oneActive": "One player can only keep one active deposit order. Order expires in 30 minutes.",
    "onlyThrough": "only through",
    "orderExpired": "Order Expired",
    "pendingAdmin": "Pending admin confirmation",
    "platformPromotion": "Platform Promotion",
    "pool": "पूल",
    "poolPrizeTitle": "Saba World Cup Pool Prize",
    "progress": "Progress",
    "promo": "Rewards / Promotion",
    "rate": "Rate",
    "rateFailed": "Rate load failed",
    "rateLoading": "Binance realtime loading...",
    "rateRealtime": "Binance realtime",
    "referralPartner": "Referral Partner",
    "rewards": "रिवॉर्ड",
    "rewardsCenter": "Rewards Center",
    "searchTeam": "टीम खोजें",
    "selectAmount": "Select amount in USDT value",
    "selectPayment": "Select payment coin / network",
    "send": "Send",
    "sevenDayLogin": "7-Day Login",
    "share": "शेयर",
    "shares": "शेयर",
    "submitScreenshot": "स्क्रीनशॉट सबमिट",
    "teamSharePercent": "Team Share Percent",
    "telegram_id": "Telegram ID",
    "ticket": "टिकट",
    "ticketRule": "1 Ticket = 10 USDT. Team share multiplier",
    "tickets": "टिकट",
    "totalFive": "Total 5 USDT",
    "totalPrizeFormula": "Total Prize Formula",
    "trc20Address": "USDT-TRC20 Address",
    "turnoverRequired": "1x turnover required",
    "uploadDesc": "पेमेंट के बाद एडमिन जांच के लिए स्क्रीनशॉट अपलोड करें।",
    "uploadScreenshot": "पेमेंट स्क्रीनशॉट अपलोड",
    "uploadedWait": "Screenshot uploaded. Please wait for confirmation.",
    "uploading": "Uploading...",
    "usdtAvailable": "USDT Available",
    "validInvites": "Valid Invites",
    "viewAll": "View All",
    "walletHistory": "Wallet History",
    "winHistory": "Win History",
    "withdraw": "विड्रॉ",
    "withdrawHistory": "Withdraw History",
    "wrongNetwork": "Wrong coin or wrong network may cause permanent loss. Upload receipt after sending.",
    "youDeposit": "You deposit",
    "youEnter": "You enter",
    "youPay": "You pay",
    "yourPoolShare": "Your Pool Share",
    "active": "सक्रिय",
    "completed": "पूरा",
    "pending": "लंबित",
    "cancelled": "रद्द",
    "canceled": "रद्द",
    "rejected": "अस्वीकृत"
  },
  "ar": {
    "activeOrder": "Active Deposit Order",
    "alreadyActive": "You already have an active order. Upload receipt, cancel it, or wait for expiry.",
    "amountMultiple": "المبلغ، مضاعف 10",
    "amountUsdt": "USDT Amount",
    "apiError": "خطأ API",
    "balance": "الرصيد",
    "basePool": "Base Pool",
    "bet": "راهن",
    "betAmount": "Bet Amount",
    "betHistory": "Bet History",
    "betMission": "Bet Mission",
    "betSuccess": "Bet successful: {tickets} tickets / {shares} shares",
    "betTarget": "Bet {amount} USDT",
    "btcLuckyDraw": "+ 3 BTC Lucky Draw",
    "cancelConfirm": "Cancel this deposit order?",
    "cancelOrder": "Cancel Order",
    "cancelling": "Cancelling...",
    "championBet": "رهان البطل",
    "championMarket": "Champion Market",
    "chooseFileFirst": "Choose a screenshot first.",
    "chooseScreenshot": "Choose Screenshot",
    "claimBonus": "Claim Bonus",
    "claimBtcShare": "Claim BTC Share",
    "claimDailyLogin": "Claim Daily Login",
    "claimed": "Claimed",
    "claimedToday": "Claimed Today",
    "closed": "مغلق",
    "confirmBet": "تأكيد الرهان",
    "copyInviteLink": "Copy Invite Link",
    "createFirst": "Create a deposit order first.",
    "createOrder": "Create Deposit Order",
    "createWithdraw": "إنشاء سحب",
    "creatingOrder": "Creating Order...",
    "customAmount": "Custom amount (USDT value)",
    "dailyLoginMission": "Daily Login Mission",
    "deposit": "إيداع",
    "depositBonus": "Deposit 100 USDT, get 20 USDT bonus",
    "depositHistory": "Deposit History",
    "depositMission": "Deposit Mission",
    "depositMore": "Deposit {amount} USDT more to unlock 20 USDT.",
    "depositTarget": "Deposit {amount} USDT",
    "drawShare": "Draw Share",
    "earlyBetMoreShare": "Early Bet = More Share",
    "est": "Est.",
    "estimatedWin": "الربح المتوقع",
    "expiredCreateNew": "Order expired. Create a new one.",
    "extraShare": "Extra Share",
    "fileLimit": "JPG, PNG up to 5MB",
    "firstDepositPack": "First Deposit Pack",
    "formula": "Formula",
    "formulaBase": "Base Pool 500,000 USD × Share",
    "formulaBtc": "BTC Draw",
    "formulaLive": "Live Team Bet Pool × Share",
    "inviteLink": "Invite Link",
    "inviteMission": "Invite Mission",
    "invitePlayer": "Invite player with 100 USDT deposit",
    "inviteRewardDesc": "Reward includes 10 USDT and 5% of winner pool share.",
    "invited": "Invited",
    "language": "اللغة",
    "left": "left",
    "liveTeamBetPool": "Live Team Bet Pool",
    "loadingRealData": "جارٍ تحميل البيانات...",
    "lockedTurnover": "Locked turnover before withdraw",
    "missionCenter": "Mission Center",
    "myBets": "رهاناتي",
    "myTickets": "My Tickets",
    "needMore": "Need {amount} USDT more",
    "needToPay": "Need to pay",
    "network": "Network",
    "nextDay": "Day {day}",
    "noBetsYet": "No bets yet.",
    "noRecords": "No records.",
    "noWalletRecords": "No wallet records.",
    "notReady": "Not Ready",
    "oneActive": "One player can only keep one active deposit order. Order expires in 30 minutes.",
    "onlyThrough": "only through",
    "orderExpired": "Order Expired",
    "pendingAdmin": "Pending admin confirmation",
    "platformPromotion": "Platform Promotion",
    "pool": "المجمع",
    "poolPrizeTitle": "Saba World Cup Pool Prize",
    "progress": "Progress",
    "promo": "Rewards / Promotion",
    "rate": "Rate",
    "rateFailed": "Rate load failed",
    "rateLoading": "Binance realtime loading...",
    "rateRealtime": "Binance realtime",
    "referralPartner": "Referral Partner",
    "rewards": "المكافآت",
    "rewardsCenter": "Rewards Center",
    "searchTeam": "بحث عن فريق",
    "selectAmount": "Select amount in USDT value",
    "selectPayment": "Select payment coin / network",
    "send": "Send",
    "sevenDayLogin": "7-Day Login",
    "share": "حصة",
    "shares": "حصص",
    "submitScreenshot": "إرسال الإيصال",
    "teamSharePercent": "Team Share Percent",
    "telegram_id": "Telegram ID",
    "ticket": "تذكرة",
    "ticketRule": "1 Ticket = 10 USDT. Team share multiplier",
    "tickets": "تذاكر",
    "totalFive": "Total 5 USDT",
    "totalPrizeFormula": "Total Prize Formula",
    "trc20Address": "USDT-TRC20 Address",
    "turnoverRequired": "1x turnover required",
    "uploadDesc": "بعد الدفع، ارفع لقطة الشاشة للمراجعة اليدوية.",
    "uploadScreenshot": "تحميل إيصال الدفع",
    "uploadedWait": "Screenshot uploaded. Please wait for confirmation.",
    "uploading": "Uploading...",
    "usdtAvailable": "USDT Available",
    "validInvites": "Valid Invites",
    "viewAll": "View All",
    "walletHistory": "Wallet History",
    "winHistory": "Win History",
    "withdraw": "سحب",
    "withdrawHistory": "Withdraw History",
    "wrongNetwork": "Wrong coin or wrong network may cause permanent loss. Upload receipt after sending.",
    "youDeposit": "You deposit",
    "youEnter": "You enter",
    "youPay": "You pay",
    "yourPoolShare": "Your Pool Share",
    "active": "نشط",
    "completed": "مكتمل",
    "pending": "قيد الانتظار",
    "cancelled": "ملغي",
    "canceled": "ملغي",
    "rejected": "مرفوض"
  },
  "fr": {
    "activeOrder": "Active Deposit Order",
    "alreadyActive": "You already have an active order. Upload receipt, cancel it, or wait for expiry.",
    "amountMultiple": "Montant, multiple de 10",
    "amountUsdt": "USDT Amount",
    "apiError": "Erreur API",
    "balance": "Solde",
    "basePool": "Base Pool",
    "bet": "Parier",
    "betAmount": "Bet Amount",
    "betHistory": "Bet History",
    "betMission": "Bet Mission",
    "betSuccess": "Bet successful: {tickets} tickets / {shares} shares",
    "betTarget": "Bet {amount} USDT",
    "btcLuckyDraw": "+ 3 BTC Lucky Draw",
    "cancelConfirm": "Cancel this deposit order?",
    "cancelOrder": "Cancel Order",
    "cancelling": "Cancelling...",
    "championBet": "Pari champion",
    "championMarket": "Champion Market",
    "chooseFileFirst": "Choose a screenshot first.",
    "chooseScreenshot": "Choose Screenshot",
    "claimBonus": "Claim Bonus",
    "claimBtcShare": "Claim BTC Share",
    "claimDailyLogin": "Claim Daily Login",
    "claimed": "Claimed",
    "claimedToday": "Claimed Today",
    "closed": "Fermé",
    "confirmBet": "Confirmer le pari",
    "copyInviteLink": "Copy Invite Link",
    "createFirst": "Create a deposit order first.",
    "createOrder": "Create Deposit Order",
    "createWithdraw": "Créer retrait",
    "creatingOrder": "Creating Order...",
    "customAmount": "Custom amount (USDT value)",
    "dailyLoginMission": "Daily Login Mission",
    "deposit": "Dépôt",
    "depositBonus": "Deposit 100 USDT, get 20 USDT bonus",
    "depositHistory": "Deposit History",
    "depositMission": "Deposit Mission",
    "depositMore": "Deposit {amount} USDT more to unlock 20 USDT.",
    "depositTarget": "Deposit {amount} USDT",
    "drawShare": "Draw Share",
    "earlyBetMoreShare": "Early Bet = More Share",
    "est": "Est.",
    "estimatedWin": "Gain estimé",
    "expiredCreateNew": "Order expired. Create a new one.",
    "extraShare": "Extra Share",
    "fileLimit": "JPG, PNG up to 5MB",
    "firstDepositPack": "First Deposit Pack",
    "formula": "Formula",
    "formulaBase": "Base Pool 500,000 USD × Share",
    "formulaBtc": "BTC Draw",
    "formulaLive": "Live Team Bet Pool × Share",
    "inviteLink": "Invite Link",
    "inviteMission": "Invite Mission",
    "invitePlayer": "Invite player with 100 USDT deposit",
    "inviteRewardDesc": "Reward includes 10 USDT and 5% of winner pool share.",
    "invited": "Invited",
    "language": "Langue",
    "left": "left",
    "liveTeamBetPool": "Live Team Bet Pool",
    "loadingRealData": "Chargement des données...",
    "lockedTurnover": "Locked turnover before withdraw",
    "missionCenter": "Mission Center",
    "myBets": "Mes paris",
    "myTickets": "My Tickets",
    "needMore": "Need {amount} USDT more",
    "needToPay": "Need to pay",
    "network": "Network",
    "nextDay": "Day {day}",
    "noBetsYet": "No bets yet.",
    "noRecords": "No records.",
    "noWalletRecords": "No wallet records.",
    "notReady": "Not Ready",
    "oneActive": "One player can only keep one active deposit order. Order expires in 30 minutes.",
    "onlyThrough": "only through",
    "orderExpired": "Order Expired",
    "pendingAdmin": "Pending admin confirmation",
    "platformPromotion": "Platform Promotion",
    "pool": "Pool",
    "poolPrizeTitle": "Saba World Cup Pool Prize",
    "progress": "Progress",
    "promo": "Rewards / Promotion",
    "rate": "Rate",
    "rateFailed": "Rate load failed",
    "rateLoading": "Binance realtime loading...",
    "rateRealtime": "Binance realtime",
    "referralPartner": "Referral Partner",
    "rewards": "Récompenses",
    "rewardsCenter": "Rewards Center",
    "searchTeam": "Rechercher une équipe",
    "selectAmount": "Select amount in USDT value",
    "selectPayment": "Select payment coin / network",
    "send": "Send",
    "sevenDayLogin": "7-Day Login",
    "share": "Part",
    "shares": "Parts",
    "submitScreenshot": "Envoyer le reçu",
    "teamSharePercent": "Team Share Percent",
    "telegram_id": "Telegram ID",
    "ticket": "Ticket",
    "ticketRule": "1 Ticket = 10 USDT. Team share multiplier",
    "tickets": "Tickets",
    "totalFive": "Total 5 USDT",
    "totalPrizeFormula": "Total Prize Formula",
    "trc20Address": "USDT-TRC20 Address",
    "turnoverRequired": "1x turnover required",
    "uploadDesc": "Après paiement, téléversez la capture pour vérification manuelle.",
    "uploadScreenshot": "Téléverser le reçu",
    "uploadedWait": "Screenshot uploaded. Please wait for confirmation.",
    "uploading": "Uploading...",
    "usdtAvailable": "USDT Available",
    "validInvites": "Valid Invites",
    "viewAll": "View All",
    "walletHistory": "Wallet History",
    "winHistory": "Win History",
    "withdraw": "Retrait",
    "withdrawHistory": "Withdraw History",
    "wrongNetwork": "Wrong coin or wrong network may cause permanent loss. Upload receipt after sending.",
    "youDeposit": "You deposit",
    "youEnter": "You enter",
    "youPay": "You pay",
    "yourPoolShare": "Your Pool Share",
    "active": "Actif",
    "completed": "Terminé",
    "pending": "En attente",
    "cancelled": "Annulé",
    "canceled": "Annulé",
    "rejected": "Rejeté"
  },
  "ja": {
    "activeOrder": "Active Deposit Order",
    "alreadyActive": "You already have an active order. Upload receipt, cancel it, or wait for expiry.",
    "amountMultiple": "金額、10の倍数",
    "amountUsdt": "USDT Amount",
    "apiError": "APIエラー",
    "balance": "残高",
    "basePool": "Base Pool",
    "bet": "ベット",
    "betAmount": "Bet Amount",
    "betHistory": "Bet History",
    "betMission": "Bet Mission",
    "betSuccess": "Bet successful: {tickets} tickets / {shares} shares",
    "betTarget": "Bet {amount} USDT",
    "btcLuckyDraw": "+ 3 BTC Lucky Draw",
    "cancelConfirm": "Cancel this deposit order?",
    "cancelOrder": "Cancel Order",
    "cancelling": "Cancelling...",
    "championBet": "優勝ベット",
    "championMarket": "Champion Market",
    "chooseFileFirst": "Choose a screenshot first.",
    "chooseScreenshot": "Choose Screenshot",
    "claimBonus": "Claim Bonus",
    "claimBtcShare": "Claim BTC Share",
    "claimDailyLogin": "Claim Daily Login",
    "claimed": "Claimed",
    "claimedToday": "Claimed Today",
    "closed": "終了",
    "confirmBet": "ベット確認",
    "copyInviteLink": "Copy Invite Link",
    "createFirst": "Create a deposit order first.",
    "createOrder": "Create Deposit Order",
    "createWithdraw": "出金作成",
    "creatingOrder": "Creating Order...",
    "customAmount": "Custom amount (USDT value)",
    "dailyLoginMission": "Daily Login Mission",
    "deposit": "入金",
    "depositBonus": "Deposit 100 USDT, get 20 USDT bonus",
    "depositHistory": "Deposit History",
    "depositMission": "Deposit Mission",
    "depositMore": "Deposit {amount} USDT more to unlock 20 USDT.",
    "depositTarget": "Deposit {amount} USDT",
    "drawShare": "Draw Share",
    "earlyBetMoreShare": "Early Bet = More Share",
    "est": "Est.",
    "estimatedWin": "予想獲得額",
    "expiredCreateNew": "Order expired. Create a new one.",
    "extraShare": "Extra Share",
    "fileLimit": "JPG, PNG up to 5MB",
    "firstDepositPack": "First Deposit Pack",
    "formula": "Formula",
    "formulaBase": "Base Pool 500,000 USD × Share",
    "formulaBtc": "BTC Draw",
    "formulaLive": "Live Team Bet Pool × Share",
    "inviteLink": "Invite Link",
    "inviteMission": "Invite Mission",
    "invitePlayer": "Invite player with 100 USDT deposit",
    "inviteRewardDesc": "Reward includes 10 USDT and 5% of winner pool share.",
    "invited": "Invited",
    "language": "言語",
    "left": "left",
    "liveTeamBetPool": "Live Team Bet Pool",
    "loadingRealData": "実データを読み込み中...",
    "lockedTurnover": "Locked turnover before withdraw",
    "missionCenter": "Mission Center",
    "myBets": "マイベット",
    "myTickets": "My Tickets",
    "needMore": "Need {amount} USDT more",
    "needToPay": "Need to pay",
    "network": "Network",
    "nextDay": "Day {day}",
    "noBetsYet": "No bets yet.",
    "noRecords": "No records.",
    "noWalletRecords": "No wallet records.",
    "notReady": "Not Ready",
    "oneActive": "One player can only keep one active deposit order. Order expires in 30 minutes.",
    "onlyThrough": "only through",
    "orderExpired": "Order Expired",
    "pendingAdmin": "Pending admin confirmation",
    "platformPromotion": "Platform Promotion",
    "pool": "プール",
    "poolPrizeTitle": "Saba World Cup Pool Prize",
    "progress": "Progress",
    "promo": "Rewards / Promotion",
    "rate": "Rate",
    "rateFailed": "Rate load failed",
    "rateLoading": "Binance realtime loading...",
    "rateRealtime": "Binance realtime",
    "referralPartner": "Referral Partner",
    "rewards": "報酬",
    "rewardsCenter": "Rewards Center",
    "searchTeam": "チーム検索",
    "selectAmount": "Select amount in USDT value",
    "selectPayment": "Select payment coin / network",
    "send": "Send",
    "sevenDayLogin": "7-Day Login",
    "share": "分配",
    "shares": "分配",
    "submitScreenshot": "スクリーンショット送信",
    "teamSharePercent": "Team Share Percent",
    "telegram_id": "Telegram ID",
    "ticket": "チケット",
    "ticketRule": "1 Ticket = 10 USDT. Team share multiplier",
    "tickets": "チケット",
    "totalFive": "Total 5 USDT",
    "totalPrizeFormula": "Total Prize Formula",
    "trc20Address": "USDT-TRC20 Address",
    "turnoverRequired": "1x turnover required",
    "uploadDesc": "支払い後、手動確認用のスクリーンショットをアップロードしてください。",
    "uploadScreenshot": "支払いスクリーンショット",
    "uploadedWait": "Screenshot uploaded. Please wait for confirmation.",
    "uploading": "Uploading...",
    "usdtAvailable": "USDT Available",
    "validInvites": "Valid Invites",
    "viewAll": "View All",
    "walletHistory": "Wallet History",
    "winHistory": "Win History",
    "withdraw": "出金",
    "withdrawHistory": "Withdraw History",
    "wrongNetwork": "Wrong coin or wrong network may cause permanent loss. Upload receipt after sending.",
    "youDeposit": "You deposit",
    "youEnter": "You enter",
    "youPay": "You pay",
    "yourPoolShare": "Your Pool Share",
    "active": "進行中",
    "completed": "完了",
    "pending": "保留中",
    "cancelled": "キャンセル済み",
    "canceled": "キャンセル済み",
    "rejected": "拒否済み"
  },
  "ko": {
    "activeOrder": "Active Deposit Order",
    "alreadyActive": "You already have an active order. Upload receipt, cancel it, or wait for expiry.",
    "amountMultiple": "금액, 10의 배수",
    "amountUsdt": "USDT Amount",
    "apiError": "API 오류",
    "balance": "잔액",
    "basePool": "Base Pool",
    "bet": "베팅",
    "betAmount": "Bet Amount",
    "betHistory": "Bet History",
    "betMission": "Bet Mission",
    "betSuccess": "Bet successful: {tickets} tickets / {shares} shares",
    "betTarget": "Bet {amount} USDT",
    "btcLuckyDraw": "+ 3 BTC Lucky Draw",
    "cancelConfirm": "Cancel this deposit order?",
    "cancelOrder": "Cancel Order",
    "cancelling": "Cancelling...",
    "championBet": "우승 베팅",
    "championMarket": "Champion Market",
    "chooseFileFirst": "Choose a screenshot first.",
    "chooseScreenshot": "Choose Screenshot",
    "claimBonus": "Claim Bonus",
    "claimBtcShare": "Claim BTC Share",
    "claimDailyLogin": "Claim Daily Login",
    "claimed": "Claimed",
    "claimedToday": "Claimed Today",
    "closed": "종료",
    "confirmBet": "베팅 확인",
    "copyInviteLink": "Copy Invite Link",
    "createFirst": "Create a deposit order first.",
    "createOrder": "Create Deposit Order",
    "createWithdraw": "출금 생성",
    "creatingOrder": "Creating Order...",
    "customAmount": "Custom amount (USDT value)",
    "dailyLoginMission": "Daily Login Mission",
    "deposit": "입금",
    "depositBonus": "Deposit 100 USDT, get 20 USDT bonus",
    "depositHistory": "Deposit History",
    "depositMission": "Deposit Mission",
    "depositMore": "Deposit {amount} USDT more to unlock 20 USDT.",
    "depositTarget": "Deposit {amount} USDT",
    "drawShare": "Draw Share",
    "earlyBetMoreShare": "Early Bet = More Share",
    "est": "Est.",
    "estimatedWin": "예상 당첨금",
    "expiredCreateNew": "Order expired. Create a new one.",
    "extraShare": "Extra Share",
    "fileLimit": "JPG, PNG up to 5MB",
    "firstDepositPack": "First Deposit Pack",
    "formula": "Formula",
    "formulaBase": "Base Pool 500,000 USD × Share",
    "formulaBtc": "BTC Draw",
    "formulaLive": "Live Team Bet Pool × Share",
    "inviteLink": "Invite Link",
    "inviteMission": "Invite Mission",
    "invitePlayer": "Invite player with 100 USDT deposit",
    "inviteRewardDesc": "Reward includes 10 USDT and 5% of winner pool share.",
    "invited": "Invited",
    "language": "언어",
    "left": "left",
    "liveTeamBetPool": "Live Team Bet Pool",
    "loadingRealData": "실제 데이터 로딩 중...",
    "lockedTurnover": "Locked turnover before withdraw",
    "missionCenter": "Mission Center",
    "myBets": "내 베팅",
    "myTickets": "My Tickets",
    "needMore": "Need {amount} USDT more",
    "needToPay": "Need to pay",
    "network": "Network",
    "nextDay": "Day {day}",
    "noBetsYet": "No bets yet.",
    "noRecords": "No records.",
    "noWalletRecords": "No wallet records.",
    "notReady": "Not Ready",
    "oneActive": "One player can only keep one active deposit order. Order expires in 30 minutes.",
    "onlyThrough": "only through",
    "orderExpired": "Order Expired",
    "pendingAdmin": "Pending admin confirmation",
    "platformPromotion": "Platform Promotion",
    "pool": "풀",
    "poolPrizeTitle": "Saba World Cup Pool Prize",
    "progress": "Progress",
    "promo": "Rewards / Promotion",
    "rate": "Rate",
    "rateFailed": "Rate load failed",
    "rateLoading": "Binance realtime loading...",
    "rateRealtime": "Binance realtime",
    "referralPartner": "Referral Partner",
    "rewards": "보상",
    "rewardsCenter": "Rewards Center",
    "searchTeam": "팀 검색",
    "selectAmount": "Select amount in USDT value",
    "selectPayment": "Select payment coin / network",
    "send": "Send",
    "sevenDayLogin": "7-Day Login",
    "share": "분배",
    "shares": "분배",
    "submitScreenshot": "스크린샷 제출",
    "teamSharePercent": "Team Share Percent",
    "telegram_id": "Telegram ID",
    "ticket": "티켓",
    "ticketRule": "1 Ticket = 10 USDT. Team share multiplier",
    "tickets": "티켓",
    "totalFive": "Total 5 USDT",
    "totalPrizeFormula": "Total Prize Formula",
    "trc20Address": "USDT-TRC20 Address",
    "turnoverRequired": "1x turnover required",
    "uploadDesc": "결제 후 수동 확인을 위해 스크린샷을 업로드하세요.",
    "uploadScreenshot": "결제 스크린샷 업로드",
    "uploadedWait": "Screenshot uploaded. Please wait for confirmation.",
    "uploading": "Uploading...",
    "usdtAvailable": "USDT Available",
    "validInvites": "Valid Invites",
    "viewAll": "View All",
    "walletHistory": "Wallet History",
    "winHistory": "Win History",
    "withdraw": "출금",
    "withdrawHistory": "Withdraw History",
    "wrongNetwork": "Wrong coin or wrong network may cause permanent loss. Upload receipt after sending.",
    "youDeposit": "You deposit",
    "youEnter": "You enter",
    "youPay": "You pay",
    "yourPoolShare": "Your Pool Share",
    "active": "진행 중",
    "completed": "완료",
    "pending": "대기 중",
    "cancelled": "취소됨",
    "canceled": "취소됨",
    "rejected": "거절됨"
  },
  "ru": {
    "activeOrder": "Active Deposit Order",
    "alreadyActive": "You already have an active order. Upload receipt, cancel it, or wait for expiry.",
    "amountMultiple": "Сумма, кратная 10",
    "amountUsdt": "USDT Amount",
    "apiError": "Ошибка API",
    "balance": "Баланс",
    "basePool": "Base Pool",
    "bet": "Ставка",
    "betAmount": "Bet Amount",
    "betHistory": "Bet History",
    "betMission": "Bet Mission",
    "betSuccess": "Bet successful: {tickets} tickets / {shares} shares",
    "betTarget": "Bet {amount} USDT",
    "btcLuckyDraw": "+ 3 BTC Lucky Draw",
    "cancelConfirm": "Cancel this deposit order?",
    "cancelOrder": "Cancel Order",
    "cancelling": "Cancelling...",
    "championBet": "Ставка на чемпиона",
    "championMarket": "Champion Market",
    "chooseFileFirst": "Choose a screenshot first.",
    "chooseScreenshot": "Choose Screenshot",
    "claimBonus": "Claim Bonus",
    "claimBtcShare": "Claim BTC Share",
    "claimDailyLogin": "Claim Daily Login",
    "claimed": "Claimed",
    "claimedToday": "Claimed Today",
    "closed": "Закрыто",
    "confirmBet": "Подтвердить ставку",
    "copyInviteLink": "Copy Invite Link",
    "createFirst": "Create a deposit order first.",
    "createOrder": "Create Deposit Order",
    "createWithdraw": "Создать вывод",
    "creatingOrder": "Creating Order...",
    "customAmount": "Custom amount (USDT value)",
    "dailyLoginMission": "Daily Login Mission",
    "deposit": "Депозит",
    "depositBonus": "Deposit 100 USDT, get 20 USDT bonus",
    "depositHistory": "Deposit History",
    "depositMission": "Deposit Mission",
    "depositMore": "Deposit {amount} USDT more to unlock 20 USDT.",
    "depositTarget": "Deposit {amount} USDT",
    "drawShare": "Draw Share",
    "earlyBetMoreShare": "Early Bet = More Share",
    "est": "Est.",
    "estimatedWin": "Ожидаемый выигрыш",
    "expiredCreateNew": "Order expired. Create a new one.",
    "extraShare": "Extra Share",
    "fileLimit": "JPG, PNG up to 5MB",
    "firstDepositPack": "First Deposit Pack",
    "formula": "Formula",
    "formulaBase": "Base Pool 500,000 USD × Share",
    "formulaBtc": "BTC Draw",
    "formulaLive": "Live Team Bet Pool × Share",
    "inviteLink": "Invite Link",
    "inviteMission": "Invite Mission",
    "invitePlayer": "Invite player with 100 USDT deposit",
    "inviteRewardDesc": "Reward includes 10 USDT and 5% of winner pool share.",
    "invited": "Invited",
    "language": "Язык",
    "left": "left",
    "liveTeamBetPool": "Live Team Bet Pool",
    "loadingRealData": "Загрузка реальных данных...",
    "lockedTurnover": "Locked turnover before withdraw",
    "missionCenter": "Mission Center",
    "myBets": "Мои ставки",
    "myTickets": "My Tickets",
    "needMore": "Need {amount} USDT more",
    "needToPay": "Need to pay",
    "network": "Network",
    "nextDay": "Day {day}",
    "noBetsYet": "No bets yet.",
    "noRecords": "No records.",
    "noWalletRecords": "No wallet records.",
    "notReady": "Not Ready",
    "oneActive": "One player can only keep one active deposit order. Order expires in 30 minutes.",
    "onlyThrough": "only through",
    "orderExpired": "Order Expired",
    "pendingAdmin": "Pending admin confirmation",
    "platformPromotion": "Platform Promotion",
    "pool": "Пул",
    "poolPrizeTitle": "Saba World Cup Pool Prize",
    "progress": "Progress",
    "promo": "Rewards / Promotion",
    "rate": "Rate",
    "rateFailed": "Rate load failed",
    "rateLoading": "Binance realtime loading...",
    "rateRealtime": "Binance realtime",
    "referralPartner": "Referral Partner",
    "rewards": "Награды",
    "rewardsCenter": "Rewards Center",
    "searchTeam": "Поиск команды",
    "selectAmount": "Select amount in USDT value",
    "selectPayment": "Select payment coin / network",
    "send": "Send",
    "sevenDayLogin": "7-Day Login",
    "share": "Доля",
    "shares": "Доли",
    "submitScreenshot": "Отправить чек",
    "teamSharePercent": "Team Share Percent",
    "telegram_id": "Telegram ID",
    "ticket": "Билет",
    "ticketRule": "1 Ticket = 10 USDT. Team share multiplier",
    "tickets": "Билеты",
    "totalFive": "Total 5 USDT",
    "totalPrizeFormula": "Total Prize Formula",
    "trc20Address": "USDT-TRC20 Address",
    "turnoverRequired": "1x turnover required",
    "uploadDesc": "После оплаты загрузите скриншот для ручной проверки.",
    "uploadScreenshot": "Загрузить чек",
    "uploadedWait": "Screenshot uploaded. Please wait for confirmation.",
    "uploading": "Uploading...",
    "usdtAvailable": "USDT Available",
    "validInvites": "Valid Invites",
    "viewAll": "View All",
    "walletHistory": "Wallet History",
    "winHistory": "Win History",
    "withdraw": "Вывод",
    "withdrawHistory": "Withdraw History",
    "wrongNetwork": "Wrong coin or wrong network may cause permanent loss. Upload receipt after sending.",
    "youDeposit": "You deposit",
    "youEnter": "You enter",
    "youPay": "You pay",
    "yourPoolShare": "Your Pool Share",
    "active": "Активно",
    "completed": "Завершено",
    "pending": "Ожидает",
    "cancelled": "Отменено",
    "canceled": "Отменено",
    "rejected": "Отклонено"
  },
  "tr": {
    "activeOrder": "Aktif Yatırma Emri",
    "alreadyActive": "Zaten aktif bir yatırma emriniz var. Dekont yükleyin, iptal edin veya süresinin dolmasını bekleyin.",
    "amountMultiple": "Tutar, 10'un katı",
    "amountUsdt": "USDT Tutarı",
    "apiError": "API Hatası",
    "balance": "Bakiye",
    "basePool": "Temel Havuz",
    "bet": "Bahis",
    "betAmount": "Bahis Tutarı",
    "betHistory": "Bahis Geçmişi",
    "betMission": "Bahis Görevi",
    "betSuccess": "Bahis başarılı: {tickets} bilet / {shares} pay",
    "betTarget": "{amount} USDT bahis yap",
    "btcLuckyDraw": "+ 3 BTC Şans Çekilişi",
    "cancelConfirm": "Bu yatırma emrini iptal etmek istiyor musunuz?",
    "cancelOrder": "Emri İptal Et",
    "cancelling": "İptal ediliyor...",
    "championBet": "Şampiyon Bahsi",
    "championMarket": "Şampiyon Pazarı",
    "chooseFileFirst": "Önce ödeme ekran görüntüsü seçin.",
    "chooseScreenshot": "Ekran Görüntüsü Seç",
    "claimBonus": "Bonusu Al",
    "claimBtcShare": "BTC Payını Al",
    "claimDailyLogin": "Günlük Giriş Ödülünü Al",
    "claimed": "Alındı",
    "claimedToday": "Bugün Alındı",
    "closed": "Kapalı",
    "confirmBet": "Bahsi Onayla",
    "copyInviteLink": "Davet Linkini Kopyala",
    "createFirst": "Önce yatırma emri oluşturun.",
    "createOrder": "Yatırma Emri Oluştur",
    "createWithdraw": "Çekim Oluştur",
    "creatingOrder": "Oluşturuluyor...",
    "customAmount": "Özel tutar (USDT değeri)",
    "dailyLoginMission": "Günlük Giriş Görevi",
    "deposit": "Yatır",
    "depositBonus": "100 USDT yatır, 20 USDT bonus al",
    "depositHistory": "Yatırma Geçmişi",
    "depositMission": "Yatırma Görevi",
    "depositMore": "20 USDT bonusu açmak için {amount} USDT daha yatır.",
    "depositTarget": "{amount} USDT yatır",
    "drawShare": "Çekiliş Payı",
    "earlyBetMoreShare": "Erken Bahis = Daha Fazla Pay",
    "est": "Tahmini",
    "estimatedWin": "Tahmini Kazanç",
    "expiredCreateNew": "Emir süresi doldu. Yeni emir oluşturun.",
    "extraShare": "Ek Pay",
    "fileLimit": "JPG, PNG en fazla 5MB",
    "firstDepositPack": "İlk Yatırma Paketi",
    "formula": "Formül",
    "formulaBase": "Temel Havuz 500,000 USD × Pay",
    "formulaBtc": "BTC Çekilişi",
    "formulaLive": "Canlı Takım Bahis Havuzu × Pay",
    "inviteLink": "Davet Linki",
    "inviteMission": "Davet Görevi",
    "invitePlayer": "100 USDT yatıran oyuncu davet et",
    "inviteRewardDesc": "Ödül 10 USDT ve kazanan havuz payının %5'ini içerir.",
    "invited": "Davet Edilen",
    "language": "Dil",
    "left": "kaldı",
    "liveTeamBetPool": "Canlı Takım Bahis Havuzu",
    "loadingRealData": "Gerçek veriler yükleniyor...",
    "lockedTurnover": "Çekimden önce kilitli turnover",
    "missionCenter": "Görev Merkezi",
    "myBets": "Bahislerim",
    "myTickets": "Biletlerim",
    "needMore": "{amount} USDT daha gerekli",
    "needToPay": "Ödenecek",
    "network": "Ağ",
    "nextDay": "Gün {day}",
    "noBetsYet": "Henüz bahis yok.",
    "noRecords": "Kayıt yok.",
    "noWalletRecords": "Cüzdan kaydı yok.",
    "notReady": "Hazır Değil",
    "oneActive": "Her oyuncu aynı anda yalnızca bir aktif yatırma emri tutabilir. Emir 30 dakika sonra sona erer.",
    "onlyThrough": "sadece",
    "orderExpired": "Emir Süresi Doldu",
    "pendingAdmin": "Yönetici onayı bekleniyor",
    "platformPromotion": "Platform Promosyonu",
    "pool": "Havuz",
    "poolPrizeTitle": "Saba Dünya Kupası Ödül Havuzu",
    "progress": "İlerleme",
    "promo": "Ödüller / Promosyon",
    "rate": "Kur",
    "rateFailed": "Kur yüklenemedi",
    "rateLoading": "Binance canlı kur yükleniyor...",
    "rateRealtime": "Binance canlı kur",
    "referralPartner": "Davet Ortağı",
    "rewards": "Ödüller",
    "rewardsCenter": "Ödül Merkezi",
    "searchTeam": "Takım ara",
    "selectAmount": "USDT değerinde tutar seç",
    "selectPayment": "Ödeme coin / ağ seç",
    "send": "Gönder",
    "sevenDayLogin": "7 Günlük Giriş",
    "share": "Pay",
    "shares": "Paylar",
    "submitScreenshot": "Dekontu Gönder",
    "teamSharePercent": "Takım Pay Yüzdesi",
    "telegram_id": "Telegram ID",
    "ticket": "Bilet",
    "ticketRule": "1 Bilet = 10 USDT. Takım pay çarpanı",
    "tickets": "Biletler",
    "totalFive": "Toplam 5 USDT",
    "totalPrizeFormula": "Toplam Ödül Formülü",
    "trc20Address": "USDT-TRC20 Adresi",
    "turnoverRequired": "1x turnover gerekli",
    "uploadDesc": "Ödeme yaptıktan sonra yönetici incelemesi için ekran görüntüsü yükleyin.",
    "uploadScreenshot": "Ödeme Dekontu Yükle",
    "uploadedWait": "Dekont yüklendi. Lütfen onay bekleyin.",
    "uploading": "Yükleniyor...",
    "usdtAvailable": "Kullanılabilir USDT",
    "validInvites": "Geçerli Davetler",
    "viewAll": "Tümünü Gör",
    "walletHistory": "Cüzdan Geçmişi",
    "winHistory": "Kazanç Geçmişi",
    "withdraw": "Çekim",
    "withdrawHistory": "Çekim Geçmişi",
    "wrongNetwork": "Yanlış coin veya ağ kalıcı kayba neden olabilir. Gönderdikten sonra dekont yükleyin.",
    "youDeposit": "Yatırdığınız",
    "youEnter": "Girdiğiniz",
    "youPay": "Ödeyeceğiniz",
    "yourPoolShare": "Havuz Payınız"
  }
};
Object.keys(V4_COMPLETE_I18N).forEach((code) => { I18N[code] = { ...(I18N[code] || I18N.en), ...V4_COMPLETE_I18N[code] }; });

const V5_EXTRA_I18N = {
  "en": {
    "assets": "Assets",
    "contactSupport": "Contact Support",
    "availableBalance": "Available Balance",
    "bonus": "Bonus",
    "totalBetAmount": "Total Bet Amount",
    "poolShare": "Pool Share",
    "btcShare": "BTC Share",
    "orderDetail": "Order Detail",
    "confirmBetTitle": "Confirm Bet",
    "confirmBetDesc": "Please check your team and amount before confirming.",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "activityPopup": "Activity"
  },
  "zh": {
    "assets": "我的资产",
    "contactSupport": "联系客服",
    "availableBalance": "可用余额",
    "bonus": "奖励余额",
    "totalBetAmount": "总下注金额",
    "poolShare": "奖池分成",
    "btcShare": "BTC 分成",
    "orderDetail": "订单详情",
    "confirmBetTitle": "确认下注",
    "confirmBetDesc": "扣款前请确认球队和金额。",
    "confirm": "确认",
    "cancel": "取消",
    "activityPopup": "活动公告"
  },
  "tr": {
    "assets": "Varlıklarım",
    "contactSupport": "Destek ile İletişim",
    "availableBalance": "Kullanılabilir Bakiye",
    "bonus": "Bonus",
    "totalBetAmount": "Toplam Bahis Tutarı",
    "poolShare": "Havuz Payı",
    "btcShare": "BTC Payı",
    "orderDetail": "Emir Detayı",
    "confirmBetTitle": "Bahsi Onayla",
    "confirmBetDesc": "Onaylamadan önce takım ve tutarı kontrol edin.",
    "confirm": "Onayla",
    "cancel": "İptal",
    "activityPopup": "Etkinlik"
  },
  "es": {
    "assets": "Assets",
    "contactSupport": "Contact Support",
    "availableBalance": "Available Balance",
    "bonus": "Bonus",
    "totalBetAmount": "Total Bet Amount",
    "poolShare": "Pool Share",
    "btcShare": "BTC Share",
    "orderDetail": "Order Detail",
    "confirmBetTitle": "Confirm Bet",
    "confirmBetDesc": "Please check your team and amount before confirming.",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "activityPopup": "Activity"
  },
  "hi": {
    "assets": "Assets",
    "contactSupport": "Contact Support",
    "availableBalance": "Available Balance",
    "bonus": "Bonus",
    "totalBetAmount": "Total Bet Amount",
    "poolShare": "Pool Share",
    "btcShare": "BTC Share",
    "orderDetail": "Order Detail",
    "confirmBetTitle": "Confirm Bet",
    "confirmBetDesc": "Please check your team and amount before confirming.",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "activityPopup": "Activity"
  },
  "ar": {
    "assets": "Assets",
    "contactSupport": "Contact Support",
    "availableBalance": "Available Balance",
    "bonus": "Bonus",
    "totalBetAmount": "Total Bet Amount",
    "poolShare": "Pool Share",
    "btcShare": "BTC Share",
    "orderDetail": "Order Detail",
    "confirmBetTitle": "Confirm Bet",
    "confirmBetDesc": "Please check your team and amount before confirming.",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "activityPopup": "Activity"
  },
  "fr": {
    "assets": "Assets",
    "contactSupport": "Contact Support",
    "availableBalance": "Available Balance",
    "bonus": "Bonus",
    "totalBetAmount": "Total Bet Amount",
    "poolShare": "Pool Share",
    "btcShare": "BTC Share",
    "orderDetail": "Order Detail",
    "confirmBetTitle": "Confirm Bet",
    "confirmBetDesc": "Please check your team and amount before confirming.",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "activityPopup": "Activity"
  },
  "ja": {
    "assets": "Assets",
    "contactSupport": "Contact Support",
    "availableBalance": "Available Balance",
    "bonus": "Bonus",
    "totalBetAmount": "Total Bet Amount",
    "poolShare": "Pool Share",
    "btcShare": "BTC Share",
    "orderDetail": "Order Detail",
    "confirmBetTitle": "Confirm Bet",
    "confirmBetDesc": "Please check your team and amount before confirming.",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "activityPopup": "Activity"
  },
  "ko": {
    "assets": "Assets",
    "contactSupport": "Contact Support",
    "availableBalance": "Available Balance",
    "bonus": "Bonus",
    "totalBetAmount": "Total Bet Amount",
    "poolShare": "Pool Share",
    "btcShare": "BTC Share",
    "orderDetail": "Order Detail",
    "confirmBetTitle": "Confirm Bet",
    "confirmBetDesc": "Please check your team and amount before confirming.",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "activityPopup": "Activity"
  },
  "ru": {
    "assets": "Assets",
    "contactSupport": "Contact Support",
    "availableBalance": "Available Balance",
    "bonus": "Bonus",
    "totalBetAmount": "Total Bet Amount",
    "poolShare": "Pool Share",
    "btcShare": "BTC Share",
    "orderDetail": "Order Detail",
    "confirmBetTitle": "Confirm Bet",
    "confirmBetDesc": "Please check your team and amount before confirming.",
    "confirm": "Confirm",
    "cancel": "Cancel",
    "activityPopup": "Activity"
  }
};
Object.keys(V5_EXTRA_I18N).forEach((code) => { I18N[code] = { ...(I18N[code] || I18N.en), ...V5_EXTRA_I18N[code] }; });


const V5_SUPPORT_FIX_I18N = {
  en: { liveSupport: "Live Support" },
  zh: { liveSupport: "在线客服" },
  tr: { liveSupport: "Canlı Destek" }
};
Object.keys(V5_SUPPORT_FIX_I18N).forEach((code) => { I18N[code] = { ...(I18N[code] || I18N.en), ...V5_SUPPORT_FIX_I18N[code] }; });



const V6_EXTRA_I18N = {
  en: { rankings: "Rankings", messages: "Messages", teamDetail: "Team Detail", teamTotalBet: "Team Total Bet", supporters: "Supporters", currentShareRate: "Current Share Rate", teamRanking: "Team Ranking", btcRanking: "BTC Share Ranking", betRanking: "Bet Ranking", maintenance: "Maintenance" },
  zh: { rankings: "排行榜", messages: "消息", teamDetail: "球队详情", teamTotalBet: "球队总下注", supporters: "支持人数", currentShareRate: "当前分成倍率", teamRanking: "球队排行榜", btcRanking: "BTC 分成榜", betRanking: "下注排行榜", maintenance: "维护中" },
  tr: { rankings: "Sıralama", messages: "Mesajlar", teamDetail: "Takım Detayı", teamTotalBet: "Takım Toplam Bahis", supporters: "Destekçiler", currentShareRate: "Mevcut Pay Çarpanı", teamRanking: "Takım Sıralaması", btcRanking: "BTC Pay Sıralaması", betRanking: "Bahis Sıralaması", maintenance: "Bakım" }
};
Object.keys(V6_EXTRA_I18N).forEach((code) => { I18N[code] = { ...(I18N[code] || I18N.en), ...V6_EXTRA_I18N[code] }; });



const V6_POLISHED_I18N = {
  en: { rankings: "Rankings", teamRanking: "Team Ranking", btcRanking: "BTC Share Ranking", betRanking: "Bet Ranking" },
  zh: { rankings: "排行榜", teamRanking: "球队排行榜", btcRanking: "BTC 分成榜", betRanking: "下注排行榜" },
  ja: { rankings: "ランキング", teamRanking: "チームランキング", btcRanking: "BTCシェアランキング", betRanking: "ベットランキング" },
  ko: { rankings: "랭킹", teamRanking: "팀 랭킹", btcRanking: "BTC 쉐어 랭킹", betRanking: "베팅 랭킹" },
  tr: { rankings: "Sıralamalar", teamRanking: "Takım Sıralaması", btcRanking: "BTC Pay Sıralaması", betRanking: "Bahis Sıralaması" },
  es: { rankings: "Clasificaciones", teamRanking: "Ranking de Equipos", btcRanking: "Ranking BTC Share", betRanking: "Ranking de Apuestas" },
  ru: { rankings: "Рейтинг", teamRanking: "Рейтинг команд", btcRanking: "Рейтинг BTC доли", betRanking: "Рейтинг ставок" },
  ar: { rankings: "التصنيفات", teamRanking: "ترتيب الفرق", btcRanking: "ترتيب حصة BTC", betRanking: "ترتيب الرهانات" },
  hi: { rankings: "रैंकिंग", teamRanking: "टीम रैंकिंग", btcRanking: "BTC शेयर रैंकिंग", betRanking: "बेट रैंकिंग" }
};
Object.keys(V6_POLISHED_I18N).forEach((code) => {
  I18N[code] = { ...(I18N[code] || I18N.en), ...V6_POLISHED_I18N[code] };
});



const SABA_V6_FULL_UI_I18N = {
  en: {
    pool: "Pool", deposit: "Deposit", myBets: "My Bets", rewards: "Rewards", assets: "Assets",
    rankings: "Rankings", teamRanking: "Team Ranking", btcRanking: "BTC Share Ranking", betRanking: "Bet Ranking",
    poolPrizeTitle: "SABA World Cup Pool Prize", basePool: "Base Pool", liveTeamBetPool: "Live Team Bet Pool",
    btcLuckyDraw: "+ 3 BTC Lucky Draw", totalPrizeFormula: "Total Prize Formula",
    formulaBase: "Base Pool 500,000 USD × Share", formulaLive: "Live Team Bet Pool × Share", formulaBtc: "BTC Draw",
    yourPoolShare: "Your Pool Share", drawShare: "Draw Share", extraShare: "Extra Share",
    ticket: "Total Tickets", share: "Total Share", searchTeam: "Search team", championMarket: "Champion Market",
    earlyBetMoreShare: "Early Bet = More Share", bet: "Bet", closed: "Closed",
    availableBalance: "Available Balance", bonus: "Bonus", totalBetAmount: "Total Bet Amount", poolShare: "Pool Share", btcShare: "BTC Share",
    contactSupport: "Contact Support", walletHistory: "Wallet History", orderDetail: "Order Detail",
    missionCenter: "Mission Center", depositMission: "Deposit Mission", lockedTurnover: "Locked turnover before withdraw:",
    platformPromotion: "Platform Promotion", claim: "Claim", claimed: "Claimed", liveSupport: "Live Support",
    betAmount: "Bet Amount", totalShare: "Total Share", totalTickets: "Total Tickets", btcDrawShare: "BTC Share"
  },
  zh: {
    pool: "奖池", deposit: "入金", myBets: "我的下注", rewards: "奖励", assets: "我的资产",
    rankings: "排行榜", teamRanking: "球队排行榜", btcRanking: "BTC 分成榜", betRanking: "下注排行榜",
    poolPrizeTitle: "SABA 世界杯奖池", basePool: "基础奖池", liveTeamBetPool: "实时球队下注池",
    btcLuckyDraw: "+ 3 BTC 幸运抽奖", totalPrizeFormula: "总奖金公式",
    formulaBase: "基础奖池 500,000 USD × 分成", formulaLive: "实时球队下注池 × 分成", formulaBtc: "BTC 抽奖",
    yourPoolShare: "你的奖池分成", drawShare: "抽奖份额", extraShare: "额外分成",
    ticket: "总票数", share: "总分成", searchTeam: "搜索球队", championMarket: "冠军市场",
    earlyBetMoreShare: "越早下注，分成越高", bet: "下注", closed: "已关闭",
    availableBalance: "可用余额", bonus: "已领奖金", totalBetAmount: "累计下注", poolShare: "奖池分成", btcShare: "BTC 分成",
    contactSupport: "联系客服", walletHistory: "钱包记录", orderDetail: "订单详情",
    missionCenter: "任务中心", depositMission: "充值任务", lockedTurnover: "提现前还需完成流水：",
    platformPromotion: "平台活动", claim: "领取", claimed: "已领取", liveSupport: "在线客服",
    betAmount: "下注金额", totalShare: "总分成", totalTickets: "总票数", btcDrawShare: "BTC 分成"
  },
  ja: {
    pool: "プール", deposit: "入金", myBets: "マイベット", rewards: "報酬", assets: "資産",
    rankings: "ランキング", teamRanking: "チームランキング", btcRanking: "BTCシェアランキング", betRanking: "ベットランキング",
    poolPrizeTitle: "SABA ワールドカップ賞金プール", basePool: "基本プール", liveTeamBetPool: "ライブチームベットプール",
    btcLuckyDraw: "+ 3 BTC ラッキードロー", totalPrizeFormula: "賞金計算式",
    formulaBase: "基本プール 500,000 USD × シェア", formulaLive: "ライブチームベットプール × シェア", formulaBtc: "BTCドロー",
    yourPoolShare: "あなたのプールシェア", drawShare: "ドローシェア", extraShare: "追加シェア",
    ticket: "総チケット数", share: "総シェア", searchTeam: "チーム検索", championMarket: "優勝マーケット",
    earlyBetMoreShare: "早くベットするほどシェア増加", bet: "ベット", closed: "終了",
    availableBalance: "利用可能残高", bonus: "獲得ボーナス", totalBetAmount: "総ベット額", poolShare: "プールシェア", btcShare: "BTCシェア",
    contactSupport: "サポート", walletHistory: "ウォレット履歴", orderDetail: "注文詳細",
    missionCenter: "ミッションセンター", depositMission: "入金ミッション", lockedTurnover: "出金前に必要な賭け条件：",
    platformPromotion: "プロモーション", claim: "受取", claimed: "受取済み", liveSupport: "ライブサポート",
    betAmount: "ベット額", totalShare: "総シェア", totalTickets: "総チケット数", btcDrawShare: "BTCシェア"
  },
  ko: {
    pool: "풀", deposit: "입금", myBets: "내 베팅", rewards: "보상", assets: "내 자산",
    rankings: "랭킹", teamRanking: "팀 랭킹", btcRanking: "BTC 쉐어 랭킹", betRanking: "베팅 랭킹",
    poolPrizeTitle: "SABA 월드컵 상금 풀", basePool: "기본 풀", liveTeamBetPool: "실시간 팀 베팅 풀",
    btcLuckyDraw: "+ 3 BTC 럭키드로우", totalPrizeFormula: "총 상금 공식",
    formulaBase: "기본 풀 500,000 USD × 쉐어", formulaLive: "실시간 팀 베팅 풀 × 쉐어", formulaBtc: "BTC 드로우",
    yourPoolShare: "내 풀 쉐어", drawShare: "추첨 쉐어", extraShare: "추가 쉐어",
    ticket: "총 티켓", share: "총 쉐어", searchTeam: "팀 검색", championMarket: "우승 마켓",
    earlyBetMoreShare: "일찍 베팅할수록 쉐어 증가", bet: "베팅", closed: "마감",
    availableBalance: "사용 가능 잔액", bonus: "수령 보너스", totalBetAmount: "총 베팅 금액", poolShare: "풀 쉐어", btcShare: "BTC 쉐어",
    contactSupport: "고객지원", walletHistory: "지갑 내역", orderDetail: "주문 상세",
    missionCenter: "미션 센터", depositMission: "입금 미션", lockedTurnover: "출금 전 필요한 롤오버:",
    platformPromotion: "플랫폼 이벤트", claim: "받기", claimed: "수령 완료", liveSupport: "실시간 지원",
    betAmount: "베팅 금액", totalShare: "총 쉐어", totalTickets: "총 티켓", btcDrawShare: "BTC 쉐어"
  },
  tr: {
    pool: "Havuz", deposit: "Yatır", myBets: "Bahislerim", rewards: "Ödüller", assets: "Varlıklarım",
    rankings: "Sıralamalar", teamRanking: "Takım Sıralaması", btcRanking: "BTC Payı Sıralaması", betRanking: "Bahis Sıralaması",
    poolPrizeTitle: "SABA Dünya Kupası Ödül Havuzu", basePool: "Temel Havuz", liveTeamBetPool: "Canlı Takım Bahis Havuzu",
    btcLuckyDraw: "+ 3 BTC Çekilişi", totalPrizeFormula: "Toplam Ödül Formülü",
    formulaBase: "Temel Havuz 500,000 USD × Pay", formulaLive: "Canlı Takım Bahis Havuzu × Pay", formulaBtc: "BTC Çekilişi",
    yourPoolShare: "Havuz Payın", drawShare: "Çekiliş Payı", extraShare: "Ek Pay",
    ticket: "Toplam Bilet", share: "Toplam Pay", searchTeam: "Takım ara", championMarket: "Şampiyon Pazarı",
    earlyBetMoreShare: "Erken bahis = daha fazla pay", bet: "Bahis", closed: "Kapalı",
    availableBalance: "Kullanılabilir Bakiye", bonus: "Alınan Bonus", totalBetAmount: "Toplam Bahis", poolShare: "Havuz Payı", btcShare: "BTC Payı",
    contactSupport: "Destek", walletHistory: "Cüzdan Geçmişi", orderDetail: "Emir Detayı",
    missionCenter: "Görev Merkezi", depositMission: "Yatırım Görevi", lockedTurnover: "Çekimden önce gereken çevrim:",
    platformPromotion: "Platform Kampanyası", claim: "Al", claimed: "Alındı", liveSupport: "Canlı Destek",
    betAmount: "Bahis Tutarı", totalShare: "Toplam Pay", totalTickets: "Toplam Bilet", btcDrawShare: "BTC Payı"
  },
  es: {
    pool: "Pool", deposit: "Depósito", myBets: "Mis Apuestas", rewards: "Recompensas", assets: "Activos",
    rankings: "Clasificaciones", teamRanking: "Ranking de Equipos", btcRanking: "Ranking BTC Share", betRanking: "Ranking de Apuestas",
    poolPrizeTitle: "Pozo SABA Copa Mundial", basePool: "Pozo Base", liveTeamBetPool: "Pozo Vivo de Equipos",
    btcLuckyDraw: "+ Sorteo de 3 BTC", totalPrizeFormula: "Fórmula del Premio",
    formulaBase: "Pozo Base 500,000 USD × Participación", formulaLive: "Pozo Vivo de Equipos × Participación", formulaBtc: "Sorteo BTC",
    yourPoolShare: "Tu Participación", drawShare: "Participación del Sorteo", extraShare: "Participación Extra",
    ticket: "Boletos Totales", share: "Participación Total", searchTeam: "Buscar equipo", championMarket: "Mercado Campeón",
    earlyBetMoreShare: "Apuesta temprano = más participación", bet: "Apostar", closed: "Cerrado",
    availableBalance: "Saldo Disponible", bonus: "Bonos Recibidos", totalBetAmount: "Total Apostado", poolShare: "Participación", btcShare: "BTC Share",
    contactSupport: "Soporte", walletHistory: "Historial de Wallet", orderDetail: "Detalle de Orden",
    missionCenter: "Centro de Misiones", depositMission: "Misión de Depósito", lockedTurnover: "Volumen requerido antes de retirar:",
    platformPromotion: "Promoción", claim: "Cobrar", claimed: "Cobrado", liveSupport: "Soporte en Vivo",
    betAmount: "Monto Apostado", totalShare: "Participación Total", totalTickets: "Boletos Totales", btcDrawShare: "BTC Share"
  },
  ru: {
    pool: "Пул", deposit: "Пополнить", myBets: "Мои ставки", rewards: "Награды", assets: "Активы",
    rankings: "Рейтинг", teamRanking: "Рейтинг команд", btcRanking: "Рейтинг BTC доли", betRanking: "Рейтинг ставок",
    poolPrizeTitle: "Призовой пул SABA ЧМ", basePool: "Базовый пул", liveTeamBetPool: "Живой пул ставок команд",
    btcLuckyDraw: "+ Розыгрыш 3 BTC", totalPrizeFormula: "Формула приза",
    formulaBase: "Базовый пул 500,000 USD × Доля", formulaLive: "Живой пул ставок × Доля", formulaBtc: "BTC розыгрыш",
    yourPoolShare: "Ваша доля пула", drawShare: "Доля розыгрыша", extraShare: "Доп. доля",
    ticket: "Всего билетов", share: "Общая доля", searchTeam: "Поиск команды", championMarket: "Рынок чемпиона",
    earlyBetMoreShare: "Ранняя ставка = больше доля", bet: "Ставка", closed: "Закрыто",
    availableBalance: "Доступный баланс", bonus: "Полученные бонусы", totalBetAmount: "Сумма ставок", poolShare: "Доля пула", btcShare: "BTC доля",
    contactSupport: "Поддержка", walletHistory: "История кошелька", orderDetail: "Детали заказа",
    missionCenter: "Центр заданий", depositMission: "Задание пополнения", lockedTurnover: "Оборот до вывода:",
    platformPromotion: "Акция", claim: "Получить", claimed: "Получено", liveSupport: "Онлайн поддержка",
    betAmount: "Сумма ставки", totalShare: "Общая доля", totalTickets: "Всего билетов", btcDrawShare: "BTC доля"
  },
  ar: {
    pool: "المجمع", deposit: "إيداع", myBets: "رهاناتي", rewards: "المكافآت", assets: "الأصول",
    rankings: "التصنيفات", teamRanking: "ترتيب الفرق", btcRanking: "ترتيب حصة BTC", betRanking: "ترتيب الرهانات",
    poolPrizeTitle: "مجمع جوائز SABA لكأس العالم", basePool: "المجمع الأساسي", liveTeamBetPool: "مجمع رهانات الفرق المباشر",
    btcLuckyDraw: "+ سحب 3 BTC", totalPrizeFormula: "معادلة الجائزة",
    formulaBase: "المجمع الأساسي 500,000 USD × الحصة", formulaLive: "مجمع رهانات الفرق × الحصة", formulaBtc: "سحب BTC",
    yourPoolShare: "حصتك في المجمع", drawShare: "حصة السحب", extraShare: "حصة إضافية",
    ticket: "إجمالي التذاكر", share: "إجمالي الحصة", searchTeam: "بحث عن فريق", championMarket: "سوق البطل",
    earlyBetMoreShare: "الرهان المبكر = حصة أكبر", bet: "راهن", closed: "مغلق",
    availableBalance: "الرصيد المتاح", bonus: "المكافآت المستلمة", totalBetAmount: "إجمالي الرهانات", poolShare: "حصة المجمع", btcShare: "حصة BTC",
    contactSupport: "الدعم", walletHistory: "سجل المحفظة", orderDetail: "تفاصيل الطلب",
    missionCenter: "مركز المهام", depositMission: "مهمة الإيداع", lockedTurnover: "الدوران المطلوب قبل السحب:",
    platformPromotion: "عرض المنصة", claim: "استلام", claimed: "تم الاستلام", liveSupport: "دعم مباشر",
    betAmount: "مبلغ الرهان", totalShare: "إجمالي الحصة", totalTickets: "إجمالي التذاكر", btcDrawShare: "حصة BTC"
  },
  hi: {
    pool: "पूल", deposit: "जमा", myBets: "मेरे बेट", rewards: "रिवॉर्ड", assets: "एसेट्स",
    rankings: "रैंकिंग", teamRanking: "टीम रैंकिंग", btcRanking: "BTC शेयर रैंकिंग", betRanking: "बेट रैंकिंग",
    poolPrizeTitle: "SABA वर्ल्ड कप प्राइज पूल", basePool: "बेस पूल", liveTeamBetPool: "लाइव टीम बेट पूल",
    btcLuckyDraw: "+ 3 BTC लकी ड्रॉ", totalPrizeFormula: "कुल प्राइज फॉर्मूला",
    formulaBase: "बेस पूल 500,000 USD × शेयर", formulaLive: "लाइव टीम बेट पूल × शेयर", formulaBtc: "BTC ड्रॉ",
    yourPoolShare: "आपका पूल शेयर", drawShare: "ड्रॉ शेयर", extraShare: "एक्स्ट्रा शेयर",
    ticket: "कुल टिकट", share: "कुल शेयर", searchTeam: "टीम खोजें", championMarket: "चैंपियन मार्केट",
    earlyBetMoreShare: "जल्दी बेट = ज्यादा शेयर", bet: "बेट", closed: "बंद",
    availableBalance: "उपलब्ध बैलेंस", bonus: "प्राप्त बोनस", totalBetAmount: "कुल बेट राशि", poolShare: "पूल शेयर", btcShare: "BTC शेयर",
    contactSupport: "सपोर्ट", walletHistory: "वॉलेट इतिहास", orderDetail: "ऑर्डर विवरण",
    missionCenter: "मिशन सेंटर", depositMission: "डिपॉजिट मिशन", lockedTurnover: "निकासी से पहले जरूरी टर्नओवर:",
    platformPromotion: "प्लेटफॉर्म प्रमोशन", claim: "क्लेम", claimed: "क्लेम हो गया", liveSupport: "लाइव सपोर्ट",
    betAmount: "बेट राशि", totalShare: "कुल शेयर", totalTickets: "कुल टिकट", btcDrawShare: "BTC शेयर"
  }
};
Object.keys(SABA_V6_FULL_UI_I18N).forEach((code) => {
  I18N[code] = { ...(I18N[code] || I18N.en), ...SABA_V6_FULL_UI_I18N[code] };
});

function tr(lang, key, vars = {}) {
  const text = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  return Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), text);
}

function detectDefaultLang() {
  const saved = localStorage.getItem("saba_lang");
  if (saved && I18N[saved]) return saved;
  const nav = (navigator.language || "en").toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("hi")) return "hi";
  if (nav.startsWith("ar")) return "ar";
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("ko")) return "ko";
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("tr")) return "tr";
  return "en";
}


// SABA_LANG_UNDEFINED_FINAL_HOTFIX
// Safe fallback for any legacy component that accidentally references `lang` outside App() scope.
// App() still uses its own state lang and all normal pages receive lang by props.
const lang = detectDefaultLang();

function LanguageSwitcher({ lang, setLang, t }) {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((x) => x.code === lang) || LANGUAGES[0];

  function choose(code) {
    setLang(code);
    localStorage.setItem("saba_lang", code);
    setOpen(false);
  }

  return (
    <div className="lang-switcher">
      <button className="lang-current" onClick={() => setOpen(!open)}>
        <span>{current.short}</span>
        <b>{t("language")}</b>
      </button>
      {open && (
        <div className="lang-menu">
          {LANGUAGES.map((l) => (
            <button key={l.code} className={lang === l.code ? "active" : ""} onClick={() => choose(l.code)}>
              <span>{l.short}</span>
              <b>{l.label}</b>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


function formatCompactUSDT(value) {
  const n = Number(value || 0);
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function fmt(value, digits = 2) {
  const n = Number(value || 0);
  return n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

const teamMeta = {
  France: { code: "FR", flag: "https://flagcdn.com/w80/fr.png", rate: "1.50", hotRank: 1 },
  Spain: { code: "ES", flag: "https://flagcdn.com/w80/es.png", rate: "1.60", hotRank: 2 },
  England: { code: "EN", flag: "https://flagcdn.com/w80/gb-eng.png", rate: "1.70", hotRank: 3 },
  Brazil: { code: "BR", flag: "https://flagcdn.com/w80/br.png", rate: "1.80", hotRank: 4 },
  Argentina: { code: "AR", flag: "https://flagcdn.com/w80/ar.png", rate: "1.90", hotRank: 5 },
  Portugal: { code: "PT", flag: "https://flagcdn.com/w80/pt.png", rate: "2.10", hotRank: 6 },
  Germany: { code: "DE", flag: "https://flagcdn.com/w80/de.png", rate: "2.30", hotRank: 7 },
  Netherlands: { code: "NL", flag: "https://flagcdn.com/w80/nl.png", rate: "2.50", hotRank: 8 },
  Japan: { code: "JP", flag: "https://flagcdn.com/w80/jp.png", rate: "2.80", hotRank: 9 },
  Belgium: { code: "BE", flag: "https://flagcdn.com/w80/be.png", rate: "3.00", hotRank: 10 },

  Norway: { code: "NO", flag: "https://flagcdn.com/w80/no.png", rate: "3.20" },
  Colombia: { code: "CO", flag: "https://flagcdn.com/w80/co.png", rate: "3.40" },
  USA: { code: "US", flag: "https://flagcdn.com/w80/us.png", rate: "3.60" },
  Morocco: { code: "MA", flag: "https://flagcdn.com/w80/ma.png", rate: "3.80" },
  Switzerland: { code: "CH", flag: "https://flagcdn.com/w80/ch.png", rate: "4.00" },
  Uruguay: { code: "UY", flag: "https://flagcdn.com/w80/uy.png", rate: "4.20" },
  Mexico: { code: "MX", flag: "https://flagcdn.com/w80/mx.png", rate: "4.40" },
  Croatia: { code: "HR", flag: "https://flagcdn.com/w80/hr.png", rate: "4.60" },
  Ecuador: { code: "EC", flag: "https://flagcdn.com/w80/ec.png", rate: "4.80" },
  Senegal: { code: "SN", flag: "https://flagcdn.com/w80/sn.png", rate: "5.00" },
  Turkiye: { code: "TR", flag: "https://flagcdn.com/w80/tr.png", rate: "5.20" },
  Canada: { code: "CA", flag: "https://flagcdn.com/w80/ca.png", rate: "5.40" },
  Austria: { code: "AT", flag: "https://flagcdn.com/w80/at.png", rate: "5.60" },
  Sweden: { code: "SE", flag: "https://flagcdn.com/w80/se.png", rate: "5.80" },
  "South Korea": { code: "KR", flag: "https://flagcdn.com/w80/kr.png", rate: "6.00" },
  Algeria: { code: "DZ", flag: "https://flagcdn.com/w80/dz.png", rate: "6.10" },
  Paraguay: { code: "PY", flag: "https://flagcdn.com/w80/py.png", rate: "6.20" },
  Scotland: { code: "SC", flag: "https://flagcdn.com/w80/gb-sct.png", rate: "6.30" },
  "Ivory Coast": { code: "CI", flag: "https://flagcdn.com/w80/ci.png", rate: "6.40" },
  Czechia: { code: "CZ", flag: "https://flagcdn.com/w80/cz.png", rate: "6.50" },
  Egypt: { code: "EG", flag: "https://flagcdn.com/w80/eg.png", rate: "6.60" },
  Ghana: { code: "GH", flag: "https://flagcdn.com/w80/gh.png", rate: "6.70" },
  "Bosnia-Herzegovina": { code: "BA", flag: "https://flagcdn.com/w80/ba.png", rate: "6.80" },
  Tunisia: { code: "TN", flag: "https://flagcdn.com/w80/tn.png", rate: "6.90" },
  Australia: { code: "AU", flag: "https://flagcdn.com/w80/au.png", rate: "7.00" },
  "New Zealand": { code: "NZ", flag: "https://flagcdn.com/w80/nz.png", rate: "7.00" },
  Haiti: { code: "HT", flag: "https://flagcdn.com/w80/ht.png", rate: "7.00" },
  Jordan: { code: "JO", flag: "https://flagcdn.com/w80/jo.png", rate: "7.00" },
  Curaçao: { code: "CW", flag: "https://flagcdn.com/w80/cw.png", rate: "7.00" },
  Iran: { code: "IR", flag: "https://flagcdn.com/w80/ir.png", rate: "7.00" },
  Uzbekistan: { code: "UZ", flag: "https://flagcdn.com/w80/uz.png", rate: "7.00" },
  Panama: { code: "PA", flag: "https://flagcdn.com/w80/pa.png", rate: "7.00" },
  Iraq: { code: "IQ", flag: "https://flagcdn.com/w80/iq.png", rate: "7.00" },
  "South Africa": { code: "ZA", flag: "https://flagcdn.com/w80/za.png", rate: "7.00" },
  "Congo DR": { code: "CD", flag: "https://flagcdn.com/w80/cd.png", rate: "7.00" },
  "Cape Verde": { code: "CV", flag: "https://flagcdn.com/w80/cv.png", rate: "7.00" },
  Qatar: { code: "QA", flag: "https://flagcdn.com/w80/qa.png", rate: "7.00" },
  "Saudi Arabia": { code: "SA", flag: "https://flagcdn.com/w80/sa.png", rate: "7.00" },
};

const HOT_TEAM_ORDER = [
  "France",
  "Spain",
  "England",
  "Brazil",
  "Argentina",
  "Portugal",
  "Germany",
  "Netherlands",
  "Japan",
  "Belgium",
];

const allTeamNames = [
  ...HOT_TEAM_ORDER,
  "Norway",
  "Colombia",
  "USA",
  "Morocco",
  "Switzerland",
  "Uruguay",
  "Mexico",
  "Croatia",
  "Ecuador",
  "Senegal",
  "Turkiye",
  "Canada",
  "Austria",
  "Sweden",
  "South Korea",
  "Algeria",
  "Paraguay",
  "Scotland",
  "Ivory Coast",
  "Czechia",
  "Egypt",
  "Ghana",
  "Bosnia-Herzegovina",
  "Tunisia",
  "Australia",
  "New Zealand",
  "Haiti",
  "Jordan",
  "Curaçao",
  "Iran",
  "Uzbekistan",
  "Panama",
  "Iraq",
  "South Africa",
  "Congo DR",
  "Cape Verde",
  "Qatar",
  "Saudi Arabia",
];

const fallbackTeams = allTeamNames.map((name) => ({
  name,
  total_ticket: 0,
  total_share: "0.00",
  share_rate: teamMeta[name]?.rate || "7.00",
  is_open: true,
}));

const hotRankMap = Object.fromEntries(HOT_TEAM_ORDER.map((name, index) => [name, index + 1]));


function useTelegramUser() {
  const [tgUser, setTgUser] = useState({ id: 7336278327, username: "aceXXX", first_name: "Demo User" });
  const [initData, setInitData] = useState("");

  useEffect(() => {
    const load = () => {
      const tg = window.Telegram?.WebApp;
      if (!tg) return false;
      tg.ready();
      tg.expand();
      setInitData(tg.initData || "");
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTgUser(user);
        return true;
      }
      return false;
    };
    if (load()) return;
    const timer = setInterval(() => {
      if (load()) clearInterval(timer);
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return { tgUser, initData };
}

function authUrl(path, tgUser, initData) {
  const url = new URL(`${API_BASE}${path}`);
  // Always pass telegram_id as fallback. Telegram initData is still sent in header when available.
  if (tgUser?.id) url.searchParams.set("telegram_id", String(tgUser.id));
  return url.toString();
}

async function api(path, { method = "GET", body, tgUser, initData } = {}) {
  const headers = { "ngrok-skip-browser-warning": "true" };
  if (initData) headers["X-Telegram-Init-Data"] = initData;
  if (body !== undefined && body !== null) headers["Content-Type"] = "application/json";

  const url = authUrl(path, tgUser, initData);

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch (err) {
    throw new Error(`Network error: ${err?.message || "Failed to fetch"} | API: ${url}`);
  }

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text };
  }
  if (!res.ok) {
    const msg = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail || data);
    throw new Error(`${res.status} ${res.statusText}: ${msg}`);
  }
  return data;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


function normalizeDepositAmount(value) {
  const n = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100) / 100;
}

function previewPayAmount(amountUsdt, method) {
  const amount = normalizeDepositAmount(amountUsdt);
  if (!amount) return "0.00";

  const rate = Number(method?.rate_usdt);
  const coin = String(method?.coin || method?.label || "USDT").toUpperCase();
  const decimals = Number(method?.decimals ?? (coin === "BTC" || coin === "ETH" ? 8 : 6));

  if (Number.isFinite(rate) && rate > 0) {
    return (amount / rate).toLocaleString(undefined, {
      minimumFractionDigits: coin === "USDT" || coin === "USDC" ? 2 : 2,
      maximumFractionDigits: coin === "USDT" || coin === "USDC" ? 2 : decimals,
    });
  }

  return "Rate loading";
}


const SABA_V7_FINANCE_TEAM_BANNER_I18N = {
  en: { teamDetail:"Team Detail", teamTotalBet:"Team Total Bet", supporters:"Supporters", currentShareRate:"Current Share Rate", myTickets:"My Tickets", myShares:"My Shares", myAmount:"My Bet Amount", estWin:"Estimated Win", topSupporters:"Top Supporters", marketStatus:"Market Status", marketPaused:"Market Paused", teamPaused:"Team Paused", maintenanceNotice:"Maintenance Notice", banner:"Banner", activity:"Activity" },
  zh: { teamDetail:"球队详情", teamTotalBet:"球队总下注", supporters:"支持人数", currentShareRate:"当前分成倍率", myTickets:"我的票数", myShares:"我的分成", myAmount:"我的下注金额", estWin:"预计可赢", topSupporters:"支持榜", marketStatus:"市场状态", marketPaused:"市场维护中", teamPaused:"球队暂停下注", maintenanceNotice:"维护公告", banner:"活动横幅", activity:"活动" },
  ja: { teamDetail:"チーム詳細", teamTotalBet:"チーム総ベット", supporters:"サポーター数", currentShareRate:"現在シェア倍率", myTickets:"マイチケット", myShares:"マイシェア", myAmount:"自分のベット額", estWin:"予想獲得額", topSupporters:"サポーターランキング", marketStatus:"マーケット状態", marketPaused:"メンテナンス中", teamPaused:"チームベット停止中", maintenanceNotice:"メンテナンス告知", banner:"キャンペーンバナー", activity:"キャンペーン" },
  ko: { teamDetail:"팀 상세", teamTotalBet:"팀 총 베팅", supporters:"지원자 수", currentShareRate:"현재 쉐어 배율", myTickets:"내 티켓", myShares:"내 쉐어", myAmount:"내 베팅 금액", estWin:"예상 당첨금", topSupporters:"지원 랭킹", marketStatus:"마켓 상태", marketPaused:"점검 중", teamPaused:"팀 베팅 일시중지", maintenanceNotice:"점검 공지", banner:"이벤트 배너", activity:"이벤트" },
  tr: { teamDetail:"Takım Detayı", teamTotalBet:"Takım Toplam Bahis", supporters:"Destekçi", currentShareRate:"Güncel Pay Çarpanı", myTickets:"Biletlerim", myShares:"Payım", myAmount:"Bahis Tutarım", estWin:"Tahmini Kazanç", topSupporters:"En İyi Destekçiler", marketStatus:"Pazar Durumu", marketPaused:"Bakım Modu", teamPaused:"Takım Bahsi Durduruldu", maintenanceNotice:"Bakım Duyurusu", banner:"Kampanya Bannerı", activity:"Kampanya" },
  es: { teamDetail:"Detalle del Equipo", teamTotalBet:"Apuesta Total del Equipo", supporters:"Seguidores", currentShareRate:"Multiplicador Actual", myTickets:"Mis Boletos", myShares:"Mi Participación", myAmount:"Mi Apuesta", estWin:"Ganancia Estimada", topSupporters:"Top Seguidores", marketStatus:"Estado del Mercado", marketPaused:"Mantenimiento", teamPaused:"Equipo Pausado", maintenanceNotice:"Aviso de Mantenimiento", banner:"Banner", activity:"Promoción" },
  ru: { teamDetail:"Детали команды", teamTotalBet:"Ставки команды", supporters:"Участники", currentShareRate:"Текущий множитель", myTickets:"Мои билеты", myShares:"Моя доля", myAmount:"Моя сумма", estWin:"Ожидаемый выигрыш", topSupporters:"Топ участников", marketStatus:"Статус рынка", marketPaused:"Техобслуживание", teamPaused:"Команда приостановлена", maintenanceNotice:"Уведомление о техработах", banner:"Баннер", activity:"Акция" },
  ar: { teamDetail:"تفاصيل الفريق", teamTotalBet:"إجمالي رهان الفريق", supporters:"الداعمون", currentShareRate:"مضاعف الحصة الحالي", myTickets:"تذاكري", myShares:"حصتي", myAmount:"مبلغ رهاني", estWin:"الربح المتوقع", topSupporters:"أفضل الداعمين", marketStatus:"حالة السوق", marketPaused:"وضع الصيانة", teamPaused:"تم إيقاف رهان الفريق", maintenanceNotice:"إشعار الصيانة", banner:"بانر النشاط", activity:"نشاط" },
  hi: { teamDetail:"टीम विवरण", teamTotalBet:"टीम कुल बेट", supporters:"समर्थक", currentShareRate:"मौजूदा शेयर गुणक", myTickets:"मेरे टिकट", myShares:"मेरा शेयर", myAmount:"मेरी बेट राशि", estWin:"अनुमानित जीत", topSupporters:"टॉप समर्थक", marketStatus:"मार्केट स्थिति", marketPaused:"मेंटेनेंस मोड", teamPaused:"टीम बेट रुकी", maintenanceNotice:"मेंटेनेंस सूचना", banner:"बैनर", activity:"प्रमोशन" }
};
Object.keys(SABA_V7_FINANCE_TEAM_BANNER_I18N).forEach((code) => {
  I18N[code] = { ...(I18N[code] || I18N.en), ...SABA_V7_FINANCE_TEAM_BANNER_I18N[code] };
});


function AppHeader({ user }) {
  return (
    <div className="brand-hero player-hero">
      <div className="hero-glow hero-glow-left" />
      <div className="hero-glow hero-glow-right" />

      <img
        src="/hero-left-player.png"
        className="hero-player-img hero-player-left"
        alt="France football player"
      />

      <div className="hero-logo-wrap">
        <img
          src="/saba-sports-logo.png"
          className="brand-logo"
          alt="SABA SPORTS"
        />
      </div>

      <img
        src="/hero-right-player.png"
        className="hero-player-img hero-player-right"
        alt="Spain football player"
      />

      <div className="brand-user-pill">
        {user?.username ? `@${user.username}` : user?.first_name || "Player"}
      </div>
    </div>
  );
}

function AnnouncementBanners({ banners, t }) {
  const items = banners?.items || [];
  const ann = banners?.announcement || banners?.maintenance_message || "";
  const maintenance = Boolean(banners?.maintenance_mode);
  const [showPopup, setShowPopup] = useState(() => !sessionStorage.getItem("saba_activity_popup_seen"));
  if (!ann && items.length === 0 && !maintenance) return null;
  const first = items[0] || null;
  return (
    <div className="announcement-wrap">
      {maintenance && <div className="notice-card maintenance-banner">🛠 {t("maintenanceNotice")}: {ann || t("marketPaused")}</div>}
      {items.map((b) => (
        <div className="activity-banner-card" key={b.id} onClick={() => b.link_url && window.open(b.link_url, "_blank")}>
          {b.image_url && <img src={b.image_url} alt={b.title || "banner"} />}
          <div><b>{b.title || t("activity")}</b><span>{b.body}</span></div>
        </div>
      ))}
      {showPopup && (ann || first) && (
        <div className="activity-popup-bg" onClick={() => { sessionStorage.setItem("saba_activity_popup_seen", "1"); setShowPopup(false); }}>
          <div className="activity-popup" onClick={(e) => e.stopPropagation()}>
            <button className="activity-close" onClick={() => { sessionStorage.setItem("saba_activity_popup_seen", "1"); setShowPopup(false); }}>×</button>
            {first?.image_url && <img src={first.image_url} className="activity-popup-img" alt={first.title || "activity"} />}
            <h2>{first?.title || t("activity")}</h2>
            <p>{first?.body || ann}</p>
            {first?.link_url && <button className="red-button wide-red-button" onClick={() => window.open(first.link_url, "_blank")}>{t("viewAll") || "View"}</button>}
          </div>
        </div>
      )}
    </div>
  );
}


function UserInfoCard({ user }) {
  return (
    <div className="user-info-card dark-user-card">
      <div>
        <span>Telegram User</span>
        <b>{user?.first_name || "Demo User"}</b>
      </div>
      <div>
        <span>Username</span>
        <b>{user?.username ? `@${user.username}` : "-"}</b>
      </div>
      <div>
        <span>Telegram ID</span>
        <b>{user?.id || "Demo"}</b>
      </div>
    </div>
  );
}

function HeroCard({ prizePool, festival, onDeposit, t }) {
  const basePool = formatUsdFull(prizePool?.base_pool || prizePool?.champion_base_pool, 500000);
  const liveBet = formatUsdFull(prizePool?.live_team_bet || prizePool?.live_team_bet_pool || prizePool?.total_pool, 1800);
  const drawShare = festival?.btc_draw_share ?? 0;
  const extraShare = festival?.extra_share_boost || "0%";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="hero-card premium-hero-card">
      <div className="hero-kicker">
        <Trophy size={18} /> {t("poolPrizeTitle")}
      </div>

      <div className="pool-combo">
        <div className="pool-base">
          <span>{t("basePool")}</span>
          <b>{basePool}</b>
        </div>
        <div className="pool-plus">+</div>
        <div className="pool-live">
          <span>{t("liveTeamBetPool")}</span>
          <b>{liveBet}</b>
        </div>
      </div>

      <div className="hero-sub">
        <Bitcoin size={26} /> {t("btcLuckyDraw")}
      </div>

      <div className="total-prize-panel">
        <div className="total-prize-title">{t("totalPrizeFormula")}</div>
        <div className="formula-line">
          <span>{t("formulaBase")}</span>
          <b>+</b>
          <span>{t("formulaLive")}</span>
          <b>+</b>
          <span>{t("formulaBtc")}</span>
        </div>
      </div>

      <div className="hero-stats total-prize-stats">
        <div className="hero-stat">
          <span>{t("yourPoolShare")}</span>
          <b>{meSafePercent(drawShare)}%</b>
        </div>
        <div className="hero-stat">
          <span>{t("drawShare")}</span>
          <b>{drawShare}</b>
        </div>
        <div className="hero-stat">
          <span>{t("extraShare")}</span>
          <b>{extraShare}</b>
        </div>
      </div>

      <button className="red-button hero-cta" onClick={onDeposit}>
        {t("deposit")}
      </button>
    </motion.div>
  );
}

function meSafePercent(drawShare) {
  const n = Number(drawShare || 0);
  if (!n) return "0";
  return Math.min(100, Math.max(0, n)).toFixed(0);
}

function BalanceCard({ me, t }) {
  return (
    <div className="balance-grid">
      <div className="info-card premium-info-card">
        <div className="info-label">
          <Wallet size={16} /> {t("balance")}
        </div>
        <div className="info-value">{me?.balance || "0.00"}</div>
        <div className="info-small">{t("usdtAvailable")}</div>
      </div>
      <div className="info-card premium-info-card">
        <div className="info-label">
          <Ticket size={16} /> {t("yourPoolShare")}
        </div>
        <div className="info-value">{me?.total_share || "0.00"}</div>
        <div className="info-small">{me?.total_ticket || 0} {t("tickets")}</div>
      </div>
    </div>
  );
}

function TeamRow({ team, onBet, onDetail, rank, t, lang = 'en' }) {
  const meta = teamMeta[team.name] || {};
  const isHot = Boolean(meta.hotRank);
  const code = meta.code || countryCodeMap?.[team.name] || team.name.slice(0, 2).toUpperCase();
  const flagSrc = meta.flag;
  const shareRate = team.live_share_rate || team.current_share_rate || team.share_rate || meta.rate || "7.00"; // SABA_V9_STRICT_LIVE_ODD_SYNC

  return (
    <div className={`team-row premium-team-card ${isHot ? "hot-team-card" : ""}`}>
      <div className="team-rank">{rank}</div>

      <div className="team-left premium-team-left">
        <div className="flag-box">
          {flagSrc ? (
            <img src={flagSrc} className="flag-img" alt={`${localTeamName(team.name, lang, team.names)} flag`} />
          ) : (
            <span className="flag-emoji">🏳️</span>
          )}
        </div>

        <div className="team-code-box">
          <span className="team-code">{code}</span>
        </div>

        <div className="team-info" onClick={() => onDetail && onDetail(team)}>
          <div className="team-name-line">
            <span className="team-name">{localTeamName(team.name, lang, team.names)}</span>
            {isHot && <span className="hot-badge" aria-label="Hot team">🔥</span>}
          </div>

          <div className="team-odds">
            {localMetricLabel("totalTickets", lang)} {team.total_ticket || 0} / {localMetricLabel("totalShare", lang)} {team.total_share || "0.00"}
          </div>
        </div>
      </div>

      <div className="team-right premium-team-right">
        <div className="share-box premium-share-box">
          <b>{t("share")} {Number(shareRate).toFixed(2)}x</b>
        </div>

        <button
          onClick={() => onBet({ ...team, share_rate: shareRate })}
          disabled={!team.is_open}
          className="blue-button premium-bet-button"
        >
          {team.is_open ? t("bet") : t("closed")}
        </button>
      </div>
    </div>
  );
}

function PoolPage({ onBet, onDetail, setTab, me, teams, prizePool, festival, loading, error, t, lang = 'en'}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const apiMap = new Map((teams || []).map((t) => [t.name, t]));
    const merged = allTeamNames.map((name) => ({
      ...(apiMap.get(name) || {}),
      name,
      is_open: apiMap.get(name)?.is_open ?? true,
      share_rate: teamMeta[name]?.rate || apiMap.get(name)?.share_rate || "7.00",
      total_ticket: apiMap.get(name)?.total_ticket || 0,
      total_share: apiMap.get(name)?.total_share || "0.00",
    }));

    return merged
      .sort((a, b) => {
        const aRank = hotRankMap[a.name] || 999;
        const bRank = hotRankMap[b.name] || 999;
        if (aRank !== bRank) return aRank - bRank;
        return allTeamNames.indexOf(a.name) - allTeamNames.indexOf(b.name);
      })
      .filter((team) => team.name.toLowerCase().includes(query.toLowerCase()));
  }, [query, teams]);
  return (
    <div className="page">
      <HeroCard prizePool={prizePool} festival={festival} onDeposit={() => setTab("deposit")} t={t} />
      <BalanceCard me={me} t={t} />
      {loading && <div className="notice-card">{t("loadingRealData")}</div>}
      {error && <div className="error-card">{t("apiError")}: {error}</div>}
      <div className="search-box premium-search">
        <Search size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchTeam")} />
      </div>
      <div className="section-title">
        <b>{t("championMarket")}</b>
        <span>{t("earlyBetMoreShare")}</span>
      </div>
      <div className="team-list">{filtered.map((team, index) => <TeamRow key={localTeamName(team.name, lang, team.names)} team={team} rank={index + 1} onBet={onBet} onDetail={onDetail} t={t} lang={lang} />)}</div>
    </div>
  );
}

function DepositPage({ t, festival, deposits, withdraws, myBets, walletHistory, createDeposit, cancelDeposit, submitReceipt, btcDraw, depositMethods = [], tgUser, initData, lang = 'en'}) {
  const [amount, setAmount] = useState("50");
  const [selectedMethod, setSelectedMethod] = useState("USDT_TRC20");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [historyTab, setHistoryTab] = useState("deposit");
  const [nowTick, setNowTick] = useState(Date.now());
  const [liveMethods, setLiveMethods] = useState([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState("");

  const fallbackMethods = [
    { key: "USDT_TRC20", label: "USDT", coin: "USDT", network: "TRC20", address: DEPOSIT_ADDRESS, rate_usdt: "1", pay_amount: amount, tag: "Low fee" },
    { key: "USDC_ERC20", label: "USDC", coin: "USDC", network: "ERC20", address: "0xf6B8f9550E5f1674A42eF88473cB75F5f6EAC61A", rate_usdt: "1", pay_amount: amount, tag: "Stable" },
    { key: "TRX_TRC20", label: "TRX", coin: "TRX", network: "TRC20", address: "TVk3UDQnBrT8vvgUbR3dy9Eb1ogBwvNx4G", rate_usdt: "—", pay_amount: "—", tag: "Low fee" },
    { key: "TON", label: "TON", coin: "TON", network: "TON", address: "UQB7zGttYgXMvC7yVhg6r_GCdoAsxVKMyfV4vdbbLQrZIAD-", rate_usdt: "—", pay_amount: "—", tag: "Fast" },
    { key: "BNB_BEP20", label: "BNB", coin: "BNB", network: "BEP20", address: "0xf6B8f9550E5f1674A42eF88473cB75F5f6EAC61A", rate_usdt: "—", pay_amount: "—", tag: "BSC" },
    { key: "ETH_ERC20", label: "ETH", coin: "ETH", network: "ERC20", address: "0xf6B8f9550E5f1674A42eF88473cB75F5f6EAC61A", rate_usdt: "—", pay_amount: "—", tag: "ERC20" },
    { key: "BTC", label: "BTC", coin: "BTC", network: "Bitcoin", address: "bc1qduqvj3yjg0fr42j42rytlmrl6auy3050fr38g5", rate_usdt: "—", pay_amount: "—", tag: "BTC" },
  ];

  const methods = liveMethods.length ? liveMethods : (depositMethods.length ? depositMethods : fallbackMethods);

  useEffect(() => {
    if (currentOrder?.order_no) return;

    const currentAmount = normalizeDepositAmount(amount);
    if (!currentAmount) {
      setLiveMethods([]);
      return;
    }

    let alive = true;
    setRatesLoading(true);
    setRatesError("");

    const timer = setTimeout(async () => {
      try {
        const data = await api(`/api/deposit/methods?amount=${encodeURIComponent(currentAmount)}`, { tgUser, initData });
        if (alive) setLiveMethods(data.methods || []);
      } catch (err) {
        console.warn("Deposit realtime rate load failed:", err);
        if (alive) setRatesError(err.message || "Rate load failed");
      } finally {
        if (alive) setRatesLoading(false);
      }
    }, 350);

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [amount, currentOrder?.order_no, tgUser?.id, initData]);

  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentOrder?.order_no) return;
    const active = (deposits || []).find((d) => {
      const hasReceipt = String(d.txid || "").startsWith("RECEIPT:");
      const status = String(d.status || "").toLowerCase();
      if (status !== "pending" || hasReceipt) return false;
      if (!d.expires_at) return true;
      const exp = new Date(String(d.expires_at).replace(" ", "T") + "Z").getTime();
      return Number.isNaN(exp) ? true : exp > Date.now();
    });
    if (active) {
      setCurrentOrder({
        order_no: active.order_no,
        amount: active.amount_usdt,
        amount_usdt: active.amount_usdt,
        coin_symbol: active.coin_symbol || String(active.network || "USDT").split(" ")[0],
        pay_amount: active.pay_amount || active.amount_usdt,
        rate_usdt: active.rate_usdt || "1",
        network: active.network || "USDT (TRC20)",
        address: active.address || DEPOSIT_ADDRESS,
        status: active.status || "pending",
        created_at: active.created_at,
        expires_at: active.expires_at,
      });
    }
  }, [deposits, currentOrder?.order_no]);

  const methodInfo = methods.find((m) => m.key === selectedMethod) || methods[0] || fallbackMethods[0];
  const selectedAddress = currentOrder?.address || methodInfo?.address || DEPOSIT_ADDRESS;
  const selectedCoin = currentOrder?.coin_symbol || methodInfo?.coin || "USDT";
  const selectedNetwork = currentOrder?.network || `${methodInfo?.coin || "USDT"} (${methodInfo?.network || "TRC20"})`;
  const cleanAmount = normalizeDepositAmount(amount);
  const livePreviewPayAmount = methodInfo?.pay_amount || previewPayAmount(cleanAmount, methodInfo);
  const payAmount = currentOrder?.order_no ? (currentOrder?.pay_amount || currentOrder?.amount_usdt || cleanAmount.toFixed(2)) : livePreviewPayAmount;
  const rateValue = currentOrder?.rate_usdt || methodInfo?.rate_usdt;
  const rateText = rateValue && rateValue !== "—" && Number(rateValue) > 0
    ? `1 ${selectedCoin} ≈ ${Number(rateValue).toLocaleString(undefined, { maximumFractionDigits: 8 })} USDT`
    : "Realtime Binance rate loading";

  const expireMs = currentOrder?.expires_at ? new Date(String(currentOrder.expires_at).replace(" ", "T") + "Z").getTime() : 0;
  const remainingSeconds = expireMs ? Math.max(0, Math.floor((expireMs - nowTick) / 1000)) : 0;
  const remainText = currentOrder?.order_no
    ? `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`
    : "30:00";

  const bonusTarget = 100;
  const confirmed = Number(festival?.total_deposit || 0);
  const cycleProgress = Math.min(bonusTarget, confirmed % bonusTarget || (confirmed >= bonusTarget ? bonusTarget : confirmed));
  const progressPercent = Math.min(100, Math.round((cycleProgress / bonusTarget) * 100));
  const needMore = Math.max(0, bonusTarget - cycleProgress);

  async function handleCreateDeposit() {
    if (currentOrder?.order_no) {
      alert(t("alreadyActive"));
      setTimeout(() => document.getElementById("deposit-order-section")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      return;
    }
    setCreating(true);
    try {
      const res = await createDeposit(cleanAmount, selectedMethod);
      if (res) {
        setCurrentOrder(res);
        setReceiptFile(null);
        setTimeout(() => document.getElementById("deposit-order-section")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleCancelOrder() {
    if (!currentOrder?.order_no) return;
    if (!window.confirm(t("cancelConfirm"))) return;
    setCancelling(true);
    try {
      const res = await cancelDeposit(currentOrder.order_no);
      if (res?.ok) {
        setCurrentOrder(null);
        setReceiptFile(null);
      }
    } finally {
      setCancelling(false);
    }
  }

  async function handleReceiptUpload() {
    if (!currentOrder?.order_no) {
      alert(t("createFirst"));
      return;
    }
    if (remainingSeconds <= 0) {
      alert(t("expiredCreateNew"));
      setCurrentOrder(null);
      return;
    }
    if (!receiptFile) {
      alert(t("chooseFileFirst"));
      return;
    }
    setUploading(true);
    try {
      await submitReceipt(currentOrder.order_no, receiptFile);
      alert(t("uploadedWait"));
      setReceiptFile(null);
      setCurrentOrder(null);
    } finally {
      setUploading(false);
    }
  }

  function historyItems() {
    if (historyTab === "deposit") {
      return (deposits || []).map((d) => ({
        key: d.order_no,
        title: `${t("depositRecord")} · ${d.network || t("crypto")}`,
        date: d.created_at,
        amount: `${d.amount_usdt} USDT`,
        status: d.status,
        remark: String(d.txid || "").startsWith("RECEIPT:") ? `${t("receipt")}: ${String(d.txid).replace("RECEIPT:", "")}` : (d.txid || `${d.pay_amount || d.amount_usdt} ${d.coin_symbol || ""}`),
        icon: Download,
      }));
    }
    if (historyTab === "withdraw") {
      return (withdraws || []).map((w) => ({
        key: w.order_no,
        title: `${t("withdrawRecord")} · ${w.network || "USDT-TRC20"}`,
        date: w.created_at,
        amount: `${w.amount_usdt} USDT`,
        status: w.status,
        remark: w.address || "",
        icon: Wallet,
      }));
    }
    if (historyTab === "bet") {
      return (myBets || []).map((b) => ({
        key: b.id,
        title: `${t("betRecord")} · ${localTeamName(b.team, lang, b.names)}`,
        date: b.created_at,
        amount: `${b.amount} USDT`,
        status: b.status,
        remark: `${b.tickets} ${t("tickets")} / ${b.shares} ${t("shares")}`,
        icon: Ticket,
      }));
    }
    return (walletHistory || [])
      .filter((x) => String(x.tx_type || "").includes("win") || String(x.tx_type || "").includes("settle"))
      .map((x, i) => ({
        key: i,
        title: t("winRecord"),
        date: x.created_at,
        amount: `${x.amount_usdt} USDT`,
        status: "completed",
        remark: localRemarkText(x.remark || "", lang, t),
        icon: Medal,
      }));
  }

  const rows = historyItems();

  return (
    <div className="page premium-deposit-page">
      {!currentOrder?.order_no && (
        <div className="premium-panel deposit-main-panel">
          <div className="panel-title premium-title">
            <span className="token-icon">₮</span> {t("depositCrypto")}
          </div>

          <div className="field-label">{t("selectAmount")}</div>
          <div className="amount-grid premium-amount-grid">
            {[20, 50, 100, 300, 500, 1000].map((v) => (
              <button key={v} onClick={() => setAmount(String(v))} className={String(v) === String(amount) ? "selected" : ""}>
                {v}
                {String(v) === String(amount) && <CheckCircle2 size={16} />}
              </button>
            ))}
          </div>

          <label className="field-label">{t("customAmount")}</label>
          <div className="amount-input-shell">
            <input value={amount} inputMode="decimal" onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="Amount USDT" />
            <span>USDT</span>
          </div>

          <div className="field-label">
            {t("selectPayment")}
            <span className="rate-live-note">{ratesLoading ? ` · ${t("rateLoading")}` : ratesError ? ` · ${t("rateFailed")}` : ` · ${t("rateRealtime")}`}</span>
          </div>
          <div className="coin-method-grid">
            {methods.map((m) => (
              <button key={m.key} className={selectedMethod === m.key ? "coin-method active" : "coin-method"} onClick={() => setSelectedMethod(m.key)}>
                <b>{m.label}</b>
                <span>{m.network}</span>
                <em>{m.tag}</em>
                <small className="coin-rate-mini">{m.rate_usdt && Number(m.rate_usdt) > 0 ? `1 ${m.coin}≈${Number(m.rate_usdt).toLocaleString(undefined, { maximumFractionDigits: 6 })} USDT` : "Rate loading"}</small>
              </button>
            ))}
          </div>

          <div className="convert-preview">
            <div>
              <span>{t("youEnter")}</span>
              <b>{fmt(cleanAmount, 2)} USDT</b>
            </div>
            <ArrowRight size={20} />
            <div>
              <span>{t("needToPay")}</span>
              <b>{payAmount} {selectedCoin}</b>
            </div>
          </div>
          <div className="rate-proof-line">{rateText} · {methodInfo?.source || t("rateRealtime")}</div>

          <button className="red-button wide-red-button" onClick={handleCreateDeposit} disabled={creating || (!currentOrder?.order_no && (!rateValue || Number(rateValue) <= 0))}>
            {creating ? t("creatingOrder") : t("createOrder")}
          </button>
          <p className="help-line center-help">{t("oneActive")}</p>
        </div>
      )}

      {currentOrder?.order_no && (
        <div id="deposit-order-section" className="premium-panel active-order-panel">
          <div className="order-topbar">
            <div>
              <span className="order-label">{t("activeOrder")}</span>
              <h2>{currentOrder.order_no}</h2>
            </div>
            <div className={remainingSeconds <= 60 ? "order-countdown urgent" : "order-countdown"}>
              <Clock3 size={18} />
              <b>{remainText}</b>
              <span>{t("left")}</span>
            </div>
          </div>

          <div className="order-summary-grid">
            <div><span>{t("youDeposit")}</span><b>{currentOrder.amount || currentOrder.amount_usdt} USDT</b></div>
            <div><span>{t("youPay")}</span><b>{payAmount} {selectedCoin}</b></div>
            <div><span>{t("network")}</span><b>{selectedNetwork}</b></div>
            <div><span>{t("rate")}</span><b>{rateText}</b></div>
          </div>

          <div className="pay-address-card">
            <div className="pay-label">
              {t("send")} <b>{selectedCoin}</b> {t("onlyThrough")} <span className="network-pill">{selectedNetwork}</span>
            </div>
            <div className="address-line">
              <b>{selectedAddress}</b>
              <button onClick={() => navigator.clipboard?.writeText(selectedAddress)}>
                <Copy size={16} />
              </button>
            </div>
            <div className="qr-card order-qr">
              <QRCodeCanvas value={selectedAddress} size={170} includeMargin />
            </div>
            <p className="danger-help">{t("wrongNetwork")}</p>
          </div>

          <div className="order-actions">
            <button className="gray-button" onClick={handleCancelOrder} disabled={cancelling || uploading}>
              {cancelling ? t("cancelling") : t("cancelOrder")}
            </button>
          </div>
        </div>
      )}

      {currentOrder?.order_no && (
        <div className="premium-panel upload-panel">
          <div className="upload-info">
            <div className="upload-icon"><UploadCloud size={24} /></div>
            <div>
              <h3>{t("uploadScreenshot")}</h3>
              <p>{t("uploadDesc")}</p>
              <span className="pending-pill">{t("pendingAdmin")}</span>
            </div>
          </div>

          <label className="upload-drop">
            <UploadCloud size={34} />
            <b>{receiptFile ? receiptFile.name : t("chooseScreenshot")}</b>
            <span>{t("fileLimit")}</span>
            <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} />
          </label>

          <button className="red-button upload-submit" onClick={handleReceiptUpload} disabled={uploading || remainingSeconds <= 0}>
            {remainingSeconds <= 0 ? t("orderExpired") : uploading ? t("uploading") : t("submitScreenshot")}
          </button>
        </div>
      )}

      <div className="premium-panel history-panel">
        <div className="history-head">
          <div className="panel-title premium-title"><History size={20} /> {t("walletHistory")}</div>
          <button className="link-button">{t("viewAll")} <ArrowRight size={16} /></button>
        </div>

        <div className="history-tabs">
          {[
            ["deposit", t("depositHistory")],
            ["withdraw", t("withdrawHistory")],
            ["bet", t("betHistory")],
            ["win", t("winHistory")],
          ].map(([key, label]) => (
            <button key={key} className={historyTab === key ? "active" : ""} onClick={() => setHistoryTab(key)}>
              {label}
            </button>
          ))}
        </div>

        <div className="history-list">
          {rows.length === 0 && <div className="notice-card dark-notice">{t("noRecords")}</div>}
          {rows.slice(0, 6).map((r) => {
            const Icon = r.icon;
            const okStatus = ["confirmed", "completed", "active"].includes(String(r.status).toLowerCase());
            return (
              <div className="history-row" key={r.key}>
                <div className="history-icon"><Icon size={18} /></div>
                <div className="history-info">
                  <b>{r.title}</b>
                  <span>{r.date || "—"}</span>
                  <small>{r.remark}</small>
                </div>
                <div className="history-amount">
                  <b>{r.amount}</b>
                  <span className={okStatus ? "status-ok" : "status-pending"}>{localStatusLabel(t, r.status)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="promo-panel">
        <div className="promo-left">
          <div className="gift-orb"><Gift size={28} /></div>
          <div>
            <span className="promo-kicker">{t("promo")}</span>
            <h3>{t("depositBonus")}</h3>
          </div>
        </div>

        <div className="promo-progress-row">
          <span>{Math.round(cycleProgress)}/100 Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="promo-progress">
          <div style={{ width: `${progressPercent}%` }} />
        </div>
        <p>{t("depositMore", { amount: fmt(needMore, 0) })}</p>
      </div>
    </div>
  );
}






const TEAM_NAME_I18N_FRONT = {
  France: { en: "France", zh: "法国", tr: "Fransa", ja: "フランス", ko: "프랑스", es: "Francia", ru: "Франция", ar: "فرنسا", hi: "फ्रांस" },
  Brazil: { en: "Brazil", zh: "巴西", tr: "Brezilya", ja: "ブラジル", ko: "브라질", es: "Brasil", ru: "Бразилия", ar: "البرازيل", hi: "ब्राजील" },
  Portugal: { en: "Portugal", zh: "葡萄牙", tr: "Portekiz", ja: "ポルトガル", ko: "포르투갈", es: "Portugal", ru: "Португалия", ar: "البرتغال", hi: "पुर्तगाल" },
  Spain: { en: "Spain", zh: "西班牙", tr: "İspanya", ja: "スペイン", ko: "스페인", es: "España", ru: "Испания", ar: "إسبانيا", hi: "स्पेन" },
  England: { en: "England", zh: "英格兰", tr: "İngiltere", ja: "イングランド", ko: "잉글랜드", es: "Inglaterra", ru: "Англия", ar: "إنجلترا", hi: "इंग्लैंड" },
  Argentina: { en: "Argentina", zh: "阿根廷", tr: "Arjantin", ja: "アルゼンチン", ko: "아르헨티나", es: "Argentina", ru: "Аргентина", ar: "الأرجنتين", hi: "अर्जेंटीना" },
  Germany: { en: "Germany", zh: "德国", tr: "Almanya", ja: "ドイツ", ko: "독일", es: "Alemania", ru: "Германия", ar: "ألمانيا", hi: "जर्मनी" },
  Italy: { en: "Italy", zh: "意大利", tr: "İtalya", ja: "イタリア", ko: "이탈리아", es: "Italia", ru: "Италия", ar: "إيطاليا", hi: "इटली" },
  Japan: { en: "Japan", zh: "日本", tr: "Japonya", ja: "日本", ko: "일본", es: "Japón", ru: "Япония", ar: "اليابان", hi: "जापान" },
  USA: { en: "USA", zh: "美国", tr: "ABD", ja: "アメリカ", ko: "미국", es: "Estados Unidos", ru: "США", ar: "الولايات المتحدة", hi: "अमेरिका" },
  Canada: { en: "Canada", zh: "加拿大", tr: "Kanada", ja: "カナダ", ko: "캐나다", es: "Canadá", ru: "Канада", ar: "كندا", hi: "कनाडा" },
  Netherlands: { en: "Netherlands", zh: "荷兰", tr: "Hollanda", ja: "オランダ", ko: "네덜란드", es: "Países Bajos", ru: "Нидерланды", ar: "هولندا", hi: "नीदरलैंड" },
  Mexico: { en: "Mexico", zh: "墨西哥", tr: "Meksika", ja: "メキシコ", ko: "멕시코", es: "México", ru: "Мексика", ar: "المكسيك", hi: "मेक्सिको" },
  Morocco: { en: "Morocco", zh: "摩洛哥", tr: "Fas", ja: "モロッコ", ko: "모로코", es: "Marruecos", ru: "Марокко", ar: "المغرب", hi: "मोरक्को" },
  Croatia: { en: "Croatia", zh: "克罗地亚", tr: "Hırvatistan", ja: "クロアチア", ko: "크로아티아", es: "Croacia", ru: "Хорватия", ar: "كرواتيا", hi: "क्रोएशिया" },
  Uruguay: { en: "Uruguay", zh: "乌拉圭", tr: "Uruguay", ja: "ウルグアイ", ko: "우루과이", es: "Uruguay", ru: "Уругвай", ar: "أوروغواي", hi: "उरुग्वे" },
  Belgium: { en: "Belgium", zh: "比利时", tr: "Belçika", ja: "ベルギー", ko: "벨기에", es: "Bélgica", ru: "Бельгия", ar: "بلجيكا", hi: "बेल्जियम" },
  Switzerland: { en: "Switzerland", zh: "瑞士", tr: "İsviçre", ja: "スイス", ko: "스위스", es: "Suiza", ru: "Швейцария", ar: "سويسرا", hi: "स्विट्ज़रलैंड" },
  Turkey: { en: "Turkey", zh: "土耳其", tr: "Türkiye", ja: "トルコ", ko: "튀르키예", es: "Turquía", ru: "Турция", ar: "تركيا", hi: "तुर्की" },
  Poland: { en: "Poland", zh: "波兰", tr: "Polonya", ja: "ポーランド", ko: "폴란드", es: "Polonia", ru: "Польша", ar: "بولندا", hi: "पोलैंड" },
  Denmark: { en: "Denmark", zh: "丹麦", tr: "Danimarka", ja: "デンマーク", ko: "덴마크", es: "Dinamarca", ru: "Дания", ar: "الدنمارك", hi: "डेनमार्क" },
  Senegal: { en: "Senegal", zh: "塞内加尔", tr: "Senegal", ja: "セネガル", ko: "세네갈", es: "Senegal", ru: "Сенегал", ar: "السنغال", hi: "सेनेगल" },
  Serbia: { en: "Serbia", zh: "塞尔维亚", tr: "Sırbistan", ja: "セルビア", ko: "세르비아", es: "Serbia", ru: "Сербия", ar: "صربيا", hi: "सर्बिया" },
  Qatar: { en: "Qatar", zh: "卡塔尔", tr: "Katar", ja: "カタール", ko: "카타르", es: "Catar", ru: "Катар", ar: "قطر", hi: "क़तर" },
  "Saudi Arabia": { en: "Saudi Arabia", zh: "沙特阿拉伯", tr: "Suudi Arabistan", ja: "サウジアラビア", ko: "사우디아라비아", es: "Arabia Saudita", ru: "Саудовская Аравия", ar: "السعودية", hi: "सऊदी अरब" },
};

const TEAM_CODE_ALIAS = {
  UnitedStates: "USA",
  "United States": "USA",
  SouthKorea: "South Korea",
  Korea: "South Korea"
};

Object.assign(TEAM_NAME_I18N_FRONT, {"Uzbekistan": {"zh": "乌兹别克斯坦", "ja": "ウズベキスタン", "ko": "우즈베키스탄", "tr": "Özbekistan", "es": "Uzbekistán", "ru": "Узбекистан", "ar": "أوزبكستان", "hi": "उज़्बेकिस्तान", "en": "Uzbekistan"}, "Panama": {"zh": "巴拿马", "ja": "パナマ", "ko": "파나마", "tr": "Panama", "es": "Panamá", "ru": "Панама", "ar": "بنما", "hi": "पनामा", "en": "Panama"}, "Iraq": {"zh": "伊拉克", "ja": "イラク", "ko": "이라크", "tr": "Irak", "es": "Irak", "ru": "Ирак", "ar": "العراق", "hi": "इराक", "en": "Iraq"}, "South Africa": {"zh": "南非", "ja": "南アフリカ", "ko": "남아프리카", "tr": "Güney Afrika", "es": "Sudáfrica", "ru": "ЮАР", "ar": "جنوب أفريقيا", "hi": "दक्षिण अफ्रीका", "en": "South Africa"}, "Congo DR": {"zh": "刚果（金）", "ja": "コンゴ民主共和国", "ko": "콩고민주공화국", "tr": "Kongo DC", "es": "RD Congo", "ru": "ДР Конго", "ar": "الكونغو الديمقراطية", "hi": "कांगो DR", "en": "Congo DR"}, "Turkiye": {"zh": "土耳其", "ja": "トルコ", "ko": "튀르키예", "tr": "Türkiye", "es": "Turquía", "ru": "Турция", "ar": "تركيا", "hi": "तुर्की", "en": "Türkiye"}, "South Korea": {"zh": "韩国", "ja": "韓国", "ko": "대한민국", "tr": "Güney Kore", "es": "Corea del Sur", "ru": "Южная Корея", "ar": "كوريا الجنوبية", "hi": "दक्षिण कोरिया", "en": "South Korea"}, "Ecuador": {"zh": "厄瓜多尔", "ja": "エクアドル", "ko": "에콰도르", "tr": "Ekvador", "es": "Ecuador", "ru": "Эквадор", "ar": "الإكوادور", "hi": "इक्वाडोर", "en": "Ecuador"}});

// ABSOLUTE_ALL_POOL_TEAM_TRANSLATIONS
Object.assign(TEAM_NAME_I18N_FRONT, {"Norway": {"en": "Norway", "zh": "挪威", "ja": "ノルウェー", "ko": "노르웨이", "tr": "Norveç", "es": "Noruega", "ru": "Норвегия", "ar": "النرويج", "hi": "नॉर्वे"}, "Colombia": {"en": "Colombia", "zh": "哥伦比亚", "ja": "コロンビア", "ko": "콜롬비아", "tr": "Kolombiya", "es": "Colombia", "ru": "Колумбия", "ar": "كولومبيا", "hi": "कोलंबिया"}, "Austria": {"en": "Austria", "zh": "奥地利", "ja": "オーストリア", "ko": "오스트리아", "tr": "Avusturya", "es": "Austria", "ru": "Австрия", "ar": "النمسا", "hi": "ऑस्ट्रिया"}, "Sweden": {"en": "Sweden", "zh": "瑞典", "ja": "スウェーデン", "ko": "스웨덴", "tr": "İsveç", "es": "Suecia", "ru": "Швеция", "ar": "السويد", "hi": "स्वीडन"}, "Algeria": {"en": "Algeria", "zh": "阿尔及利亚", "ja": "アルジェリア", "ko": "알제리", "tr": "Cezayir", "es": "Argelia", "ru": "Алжир", "ar": "الجزائر", "hi": "अल्जीरिया"}, "Paraguay": {"en": "Paraguay", "zh": "巴拉圭", "ja": "パラグアイ", "ko": "파라과이", "tr": "Paraguay", "es": "Paraguay", "ru": "Парагвай", "ar": "باراغواي", "hi": "पैराग्वे"}, "Scotland": {"en": "Scotland", "zh": "苏格兰", "ja": "スコットランド", "ko": "스코틀랜드", "tr": "İskoçya", "es": "Escocia", "ru": "Шотландия", "ar": "اسكتلندا", "hi": "स्कॉटलैंड"}, "Ivory Coast": {"en": "Ivory Coast", "zh": "科特迪瓦", "ja": "コートジボワール", "ko": "코트디부아르", "tr": "Fildişi Sahili", "es": "Costa de Marfil", "ru": "Кот-д’Ивуар", "ar": "ساحل العاج", "hi": "आइवरी कोस्ट"}, "Czechia": {"en": "Czechia", "zh": "捷克", "ja": "チェコ", "ko": "체코", "tr": "Çekya", "es": "Chequia", "ru": "Чехия", "ar": "التشيك", "hi": "चेकिया"}, "Egypt": {"en": "Egypt", "zh": "埃及", "ja": "エジプト", "ko": "이집트", "tr": "Mısır", "es": "Egipto", "ru": "Египет", "ar": "مصر", "hi": "मिस्र"}, "Ghana": {"en": "Ghana", "zh": "加纳", "ja": "ガーナ", "ko": "가나", "tr": "Gana", "es": "Ghana", "ru": "Гана", "ar": "غانا", "hi": "घाना"}, "Bosnia-Herzegovina": {"en": "Bosnia-Herzegovina", "zh": "波黑", "ja": "ボスニア・ヘルツェゴビナ", "ko": "보스니아 헤르체고비나", "tr": "Bosna-Hersek", "es": "Bosnia y Herzegovina", "ru": "Босния и Герцеговина", "ar": "البوسنة والهرسك", "hi": "बोस्निया और हर्जेगोविना"}, "Tunisia": {"en": "Tunisia", "zh": "突尼斯", "ja": "チュニジア", "ko": "튀니지", "tr": "Tunus", "es": "Túnez", "ru": "Тунис", "ar": "تونس", "hi": "ट्यूनीशिया"}, "Australia": {"en": "Australia", "zh": "澳大利亚", "ja": "オーストラリア", "ko": "호주", "tr": "Avustralya", "es": "Australia", "ru": "Австралия", "ar": "أستراليا", "hi": "ऑस्ट्रेलिया"}, "New Zealand": {"en": "New Zealand", "zh": "新西兰", "ja": "ニュージーランド", "ko": "뉴질랜드", "tr": "Yeni Zelanda", "es": "Nueva Zelanda", "ru": "Новая Зеландия", "ar": "نيوزيلندا", "hi": "न्यूज़ीलैंड"}, "Haiti": {"en": "Haiti", "zh": "海地", "ja": "ハイチ", "ko": "아이티", "tr": "Haiti", "es": "Haití", "ru": "Гаити", "ar": "هايتي", "hi": "हैती"}, "Jordan": {"en": "Jordan", "zh": "约旦", "ja": "ヨルダン", "ko": "요르단", "tr": "Ürdün", "es": "Jordania", "ru": "Иордания", "ar": "الأردن", "hi": "जॉर्डन"}, "Curaçao": {"en": "Curaçao", "zh": "库拉索", "ja": "キュラソー", "ko": "퀴라소", "tr": "Curaçao", "es": "Curazao", "ru": "Кюрасао", "ar": "كوراساو", "hi": "कुराकाओ"}, "Iran": {"en": "Iran", "zh": "伊朗", "ja": "イラン", "ko": "이란", "tr": "İran", "es": "Irán", "ru": "Иран", "ar": "إيران", "hi": "ईरान"}, "Uzbekistan": {"en": "Uzbekistan", "zh": "乌兹别克斯坦", "ja": "ウズベキスタン", "ko": "우즈베키스탄", "tr": "Özbekistan", "es": "Uzbekistán", "ru": "Узбекистан", "ar": "أوزبكستان", "hi": "उज़्बेकिस्तान"}, "Panama": {"en": "Panama", "zh": "巴拿马", "ja": "パナマ", "ko": "파나마", "tr": "Panama", "es": "Panamá", "ru": "Панама", "ar": "بنما", "hi": "पनामा"}, "Iraq": {"en": "Iraq", "zh": "伊拉克", "ja": "イラク", "ko": "이라크", "tr": "Irak", "es": "Irak", "ru": "Ирак", "ar": "العراق", "hi": "इराक"}, "South Africa": {"en": "South Africa", "zh": "南非", "ja": "南アフリカ", "ko": "남아프리카", "tr": "Güney Afrika", "es": "Sudáfrica", "ru": "ЮАР", "ar": "جنوب أفريقيا", "hi": "दक्षिण अफ्रीका"}, "Congo DR": {"en": "Congo DR", "zh": "刚果（金）", "ja": "コンゴ民主共和国", "ko": "콩고민주공화국", "tr": "Kongo DC", "es": "RD Congo", "ru": "ДР Конго", "ar": "الكونغو الديمقراطية", "hi": "कांगो DR"}, "Cape Verde": {"en": "Cape Verde", "zh": "佛得角", "ja": "カーボベルデ", "ko": "카보베르데", "tr": "Yeşil Burun Adaları", "es": "Cabo Verde", "ru": "Кабо-Верде", "ar": "الرأس الأخضر", "hi": "केप वर्डे"}, "Turkiye": {"en": "Türkiye", "zh": "土耳其", "ja": "トルコ", "ko": "튀르키예", "tr": "Türkiye", "es": "Turquía", "ru": "Турция", "ar": "تركيا", "hi": "तुर्की"}, "South Korea": {"en": "South Korea", "zh": "韩国", "ja": "韓国", "ko": "대한민국", "tr": "Güney Kore", "es": "Corea del Sur", "ru": "Южная Корея", "ar": "كوريا الجنوبية", "hi": "दक्षिण कोरिया"}, "Ecuador": {"en": "Ecuador", "zh": "厄瓜多尔", "ja": "エクアドル", "ko": "에콰도르", "tr": "Ekvador", "es": "Ecuador", "ru": "Эквадор", "ar": "الإكوادور", "hi": "इक्वाडोर"}});


// ABSOLUTE_FINAL_TRANSLATION_OVERRIDE_LAST
const ABSOLUTE_FINAL_TRANSLATION_OVERRIDE_LAST = {
  zh: { bet:"下注", deposit:"入金", withdraw:"提现", win:"派奖", tickets:"票", shares:"分成", ticket:"总票数", share:"总分成", confirmed:"已确认", pending:"待审核", completed:"已完成", rejected:"已拒绝", cancelled:"已取消", championBet:"冠军下注", depositConfirmed:"入金已确认", betRecord:"下注", depositRecord:"入金", withdrawRecord:"提现", winRecord:"派奖", totalTickets:"总票数", totalShare:"总分成", betAmount:"下注金额", btcShare:"BTC 分成" },
  ja: { bet:"ベット", deposit:"入金", withdraw:"出金", win:"配当", tickets:"チケット", shares:"シェア", ticket:"総チケット数", share:"総シェア", confirmed:"確認済み", pending:"審査中", completed:"完了", rejected:"拒否", cancelled:"取消済み", championBet:"優勝ベット", depositConfirmed:"入金確認済み", betRecord:"ベット", depositRecord:"入金", withdrawRecord:"出金", winRecord:"配当", totalTickets:"総チケット数", totalShare:"総シェア", betAmount:"ベット額", btcShare:"BTCシェア" },
  ko: { bet:"베팅", deposit:"입금", withdraw:"출금", win:"지급", tickets:"티켓", shares:"쉐어", ticket:"총 티켓", share:"총 쉐어", confirmed:"확인됨", pending:"심사 중", completed:"완료", rejected:"거절됨", cancelled:"취소됨", championBet:"우승 베팅", depositConfirmed:"입금 확인됨", betRecord:"베팅", depositRecord:"입금", withdrawRecord:"출금", winRecord:"지급", totalTickets:"총 티켓", totalShare:"총 쉐어", betAmount:"베팅 금액", btcShare:"BTC 쉐어" },
  tr: { bet:"Bahis", deposit:"Yatırım", withdraw:"Çekim", win:"Kazanç", tickets:"Bilet", shares:"Pay", ticket:"Toplam Bilet", share:"Toplam Pay", confirmed:"Onaylandı", pending:"Beklemede", completed:"Tamamlandı", rejected:"Reddedildi", cancelled:"İptal", championBet:"Şampiyon bahsi", depositConfirmed:"Yatırım onaylandı", betRecord:"Bahis", depositRecord:"Yatırım", withdrawRecord:"Çekim", winRecord:"Kazanç", totalTickets:"Toplam Bilet", totalShare:"Toplam Pay", betAmount:"Bahis Tutarı", btcShare:"BTC Payı" },
  es: { bet:"Apuesta", deposit:"Depósito", withdraw:"Retiro", win:"Premio", tickets:"Boletos", shares:"Participación", ticket:"Boletos Totales", share:"Participación Total", confirmed:"Confirmado", pending:"Pendiente", completed:"Completado", rejected:"Rechazado", cancelled:"Cancelado", championBet:"Apuesta campeón", depositConfirmed:"Depósito confirmado", betRecord:"Apuesta", depositRecord:"Depósito", withdrawRecord:"Retiro", winRecord:"Premio", totalTickets:"Boletos Totales", totalShare:"Participación Total", betAmount:"Monto Apostado", btcShare:"BTC Share" },
  ru: { bet:"Ставка", deposit:"Депозит", withdraw:"Вывод", win:"Выплата", tickets:"билетов", shares:"долей", ticket:"Всего билетов", share:"Общая доля", confirmed:"Подтверждено", pending:"Ожидает", completed:"Завершено", rejected:"Отклонено", cancelled:"Отменено", championBet:"Ставка на чемпиона", depositConfirmed:"Депозит подтвержден", betRecord:"Ставка", depositRecord:"Депозит", withdrawRecord:"Вывод", winRecord:"Выплата", totalTickets:"Всего билетов", totalShare:"Общая доля", betAmount:"Сумма ставки", btcShare:"BTC доля" },
  ar: { bet:"رهان", deposit:"إيداع", withdraw:"سحب", win:"جائزة", tickets:"تذاكر", shares:"حصص", ticket:"إجمالي التذاكر", share:"إجمالي الحصة", confirmed:"مؤكد", pending:"قيد المراجعة", completed:"مكتمل", rejected:"مرفوض", cancelled:"ملغي", championBet:"رهان البطل", depositConfirmed:"تم تأكيد الإيداع", betRecord:"رهان", depositRecord:"إيداع", withdrawRecord:"سحب", winRecord:"جائزة", totalTickets:"إجمالي التذاكر", totalShare:"إجمالي الحصة", betAmount:"مبلغ الرهان", btcShare:"حصة BTC" },
  en: { championBet:"Champion bet", depositConfirmed:"Deposit confirmed", betRecord:"Bet", depositRecord:"Deposit", withdrawRecord:"Withdraw", winRecord:"Win", totalTickets:"Total Tickets", totalShare:"Total Share", betAmount:"Bet Amount", btcShare:"BTC Share" }
};
Object.keys(ABSOLUTE_FINAL_TRANSLATION_OVERRIDE_LAST).forEach((code) => {
  I18N[code] = { ...(I18N[code] || I18N.en), ...ABSOLUTE_FINAL_TRANSLATION_OVERRIDE_LAST[code] };
});


function normalizeTeamKey(team) {
  const raw = String(team || "").trim();
  return TEAM_CODE_ALIAS[raw] || TEAM_CODE_ALIAS[raw.replace(/\s+/g, "")] || raw;
}



const SABA_V6_FINAL_LANGUAGE_CLEANUP = {
  en: {
    pool:"Pool", deposit:"Deposit", myBets:"My Bets", rewards:"Rewards", assets:"Assets", rankings:"Rankings",
    bet:"Bet", ticket:"Total Tickets", tickets:"Tickets", share:"Total Share", shares:"Shares",
    betAmount:"Bet Amount", btcShare:"BTC Share", totalShare:"Total Share", totalTickets:"Total Tickets",
    depositMission:"Deposit Mission", betMission:"Bet Mission", inviteMission:"Invite Mission", dailyLoginMission:"Daily Login Mission",
    invitePlayer:"Invite player with 100 USDT deposit", validInvites:"Valid Invites", inviteRewardDesc:"Reward includes 10 USDT and 5% of winner pool share.",
    sevenDayLogin:"7-Day Login", totalFive:"Total 5 USDT", claimedToday:"Claimed Today", claimed:"Claimed",
    depositTarget:"Deposit {amount} USDT", betTarget:"Bet {amount} USDT", needMore:"Need {amount} USDT more", turnoverRequired:"1x turnover required",
    platformPromotion:"Platform Promotion", depositBonus:"Deposit 100 USDT, get 20 USDT bonus", progress:"Progress", missionCenter:"Mission Center",
    firstDepositPack:"First Deposit Pack", referralPartner:"Referral Partner", invited:"Invited", copyInviteLink:"Copy Invite Link", inviteLink:"Invite Link",
    depositRecord:"Deposit", withdrawRecord:"Withdraw", betRecord:"Bet", winRecord:"Win", walletHistory:"Wallet History",
    depositHistory:"Deposit History", withdrawHistory:"Withdraw History", betHistory:"Bet History", winHistory:"Win History",
    confirmed:"Confirmed", pending:"Pending", completed:"Completed", rejected:"Rejected", cancelled:"Cancelled", active:"Active",
    receipt:"Receipt", crypto:"Crypto", depositCrypto:"Deposit Crypto", selectAmount:"Select deposit amount", chooseScreenshot:"Upload Screenshot",
    fileLimit:"JPG/PNG up to 5MB", submitScreenshot:"Submit Screenshot", uploading:"Uploading...", pendingAdmin:"Pending Admin Confirmation",
    noRecords:"No records yet.", noWalletRecords:"No wallet records.", lockedTurnover:"Locked turnover before withdraw:",
    availableBalance:"Available Balance", bonus:"Bonus", totalBetAmount:"Total Bet Amount", poolShare:"Pool Share", contactSupport:"Contact Support",
    liveSupport:"Live Support", orderDetail:"Order Detail", championBet:"Champion bet"
  },
  zh: {
    pool:"奖池", deposit:"入金", myBets:"我的下注", rewards:"奖励", assets:"我的资产", rankings:"排行榜",
    bet:"下注", ticket:"总票数", tickets:"票", share:"总分成", shares:"分成",
    betAmount:"下注金额", btcShare:"BTC 分成", totalShare:"总分成", totalTickets:"总票数",
    depositMission:"入金任务", betMission:"下注任务", inviteMission:"邀请任务", dailyLoginMission:"每日登录任务",
    invitePlayer:"邀请玩家完成 100 USDT 入金", validInvites:"有效邀请", inviteRewardDesc:"奖励包含 10 USDT，以及赢家奖池 5% 分成。",
    sevenDayLogin:"7 天登录", totalFive:"总计 5 USDT", claimedToday:"今日已领取", claimed:"已领取",
    depositTarget:"入金 {amount} USDT", betTarget:"下注 {amount} USDT", needMore:"还差 {amount} USDT", turnoverRequired:"需要 1 倍流水",
    platformPromotion:"平台活动", depositBonus:"入金 100 USDT，领取 20 USDT 奖励", progress:"进度", missionCenter:"任务中心",
    firstDepositPack:"首充礼包", referralPartner:"邀请伙伴", invited:"已邀请", copyInviteLink:"复制邀请链接", inviteLink:"邀请链接",
    depositRecord:"入金", withdrawRecord:"提现", betRecord:"下注", winRecord:"派奖", walletHistory:"钱包记录",
    depositHistory:"入金记录", withdrawHistory:"提现记录", betHistory:"下注记录", winHistory:"派奖记录",
    confirmed:"已确认", pending:"待审核", completed:"已完成", rejected:"已拒绝", cancelled:"已取消", active:"进行中",
    receipt:"付款凭证", crypto:"加密货币", depositCrypto:"加密货币入金", selectAmount:"选择入金金额", chooseScreenshot:"上传付款截图",
    fileLimit:"JPG/PNG，最大 5MB", submitScreenshot:"提交截图", uploading:"上传中...", pendingAdmin:"等待管理员审核",
    noRecords:"暂无记录。", noWalletRecords:"暂无钱包记录。", lockedTurnover:"提现前还需完成流水：",
    availableBalance:"可用余额", bonus:"已领奖金", totalBetAmount:"累计下注", poolShare:"奖池分成", contactSupport:"联系客服",
    liveSupport:"在线客服", orderDetail:"订单详情", championBet:"冠军下注"
  },
  ja: {
    pool:"プール", deposit:"入金", myBets:"マイベット", rewards:"報酬", assets:"資産", rankings:"ランキング",
    bet:"ベット", ticket:"総チケット数", tickets:"チケット", share:"総シェア", shares:"シェア",
    betAmount:"ベット額", btcShare:"BTCシェア", totalShare:"総シェア", totalTickets:"総チケット数",
    depositMission:"入金ミッション", betMission:"ベットミッション", inviteMission:"招待ミッション", dailyLoginMission:"デイリーログインミッション",
    invitePlayer:"100 USDTを入金するプレイヤーを招待", validInvites:"有効招待", inviteRewardDesc:"報酬は10 USDTと勝者プール5%シェアです。",
    sevenDayLogin:"7日間ログイン", totalFive:"合計 5 USDT", claimedToday:"本日受取済み", claimed:"受取済み",
    depositTarget:"{amount} USDT 入金", betTarget:"{amount} USDT ベット", needMore:"あと {amount} USDT", turnoverRequired:"1倍の賭け条件が必要",
    platformPromotion:"プロモーション", depositBonus:"100 USDT入金で20 USDTボーナス", progress:"進捗", missionCenter:"ミッションセンター",
    firstDepositPack:"初回入金パック", referralPartner:"紹介パートナー", invited:"招待済み", copyInviteLink:"招待リンクをコピー", inviteLink:"招待リンク",
    depositRecord:"入金", withdrawRecord:"出金", betRecord:"ベット", winRecord:"配当", walletHistory:"ウォレット履歴",
    depositHistory:"入金履歴", withdrawHistory:"出金履歴", betHistory:"ベット履歴", winHistory:"配当履歴",
    confirmed:"確認済み", pending:"審査中", completed:"完了", rejected:"拒否", cancelled:"取消済み", active:"進行中",
    receipt:"領収書", crypto:"暗号資産", depositCrypto:"暗号資産入金", selectAmount:"入金額を選択", chooseScreenshot:"支払い画像をアップロード",
    fileLimit:"JPG/PNG 最大5MB", submitScreenshot:"画像を提出", uploading:"アップロード中...", pendingAdmin:"管理者確認待ち",
    noRecords:"記録はありません。", noWalletRecords:"ウォレット履歴はありません。", lockedTurnover:"出金前に必要な賭け条件：",
    availableBalance:"利用可能残高", bonus:"獲得ボーナス", totalBetAmount:"総ベット額", poolShare:"プールシェア", contactSupport:"サポート",
    liveSupport:"ライブサポート", orderDetail:"注文詳細", championBet:"優勝ベット"
  },
  ko: {
    pool:"풀", deposit:"입금", myBets:"내 베팅", rewards:"보상", assets:"내 자산", rankings:"랭킹",
    bet:"베팅", ticket:"총 티켓", tickets:"티켓", share:"총 쉐어", shares:"쉐어",
    betAmount:"베팅 금액", btcShare:"BTC 쉐어", totalShare:"총 쉐어", totalTickets:"총 티켓",
    depositMission:"입금 미션", betMission:"베팅 미션", inviteMission:"초대 미션", dailyLoginMission:"일일 로그인 미션",
    invitePlayer:"100 USDT 입금 플레이어 초대", validInvites:"유효 초대", inviteRewardDesc:"보상은 10 USDT와 우승자 풀 5% 쉐어입니다.",
    sevenDayLogin:"7일 로그인", totalFive:"총 5 USDT", claimedToday:"오늘 수령 완료", claimed:"수령 완료",
    depositTarget:"{amount} USDT 입금", betTarget:"{amount} USDT 베팅", needMore:"{amount} USDT 더 필요", turnoverRequired:"1배 롤오버 필요",
    platformPromotion:"플랫폼 이벤트", depositBonus:"100 USDT 입금 시 20 USDT 보너스", progress:"진행도", missionCenter:"미션 센터",
    firstDepositPack:"첫 입금 패키지", referralPartner:"추천 파트너", invited:"초대됨", copyInviteLink:"초대 링크 복사", inviteLink:"초대 링크",
    depositRecord:"입금", withdrawRecord:"출금", betRecord:"베팅", winRecord:"지급", walletHistory:"지갑 내역",
    depositHistory:"입금 내역", withdrawHistory:"출금 내역", betHistory:"베팅 내역", winHistory:"지급 내역",
    confirmed:"확인됨", pending:"심사 중", completed:"완료", rejected:"거절됨", cancelled:"취소됨", active:"진행 중",
    receipt:"영수증", crypto:"암호화폐", depositCrypto:"암호화폐 입금", selectAmount:"입금 금액 선택", chooseScreenshot:"결제 스크린샷 업로드",
    fileLimit:"JPG/PNG 최대 5MB", submitScreenshot:"스크린샷 제출", uploading:"업로드 중...", pendingAdmin:"관리자 확인 대기",
    noRecords:"기록이 없습니다.", noWalletRecords:"지갑 내역이 없습니다.", lockedTurnover:"출금 전 필요한 롤오버:",
    availableBalance:"사용 가능 잔액", bonus:"수령 보너스", totalBetAmount:"총 베팅 금액", poolShare:"풀 쉐어", contactSupport:"고객지원",
    liveSupport:"실시간 지원", orderDetail:"주문 상세", championBet:"우승 베팅"
  },
  tr: {
    pool:"Havuz", deposit:"Yatır", myBets:"Bahislerim", rewards:"Ödüller", assets:"Varlıklarım", rankings:"Sıralamalar",
    bet:"Bahis", ticket:"Toplam Bilet", tickets:"Bilet", share:"Toplam Pay", shares:"Pay",
    betAmount:"Bahis Tutarı", btcShare:"BTC Payı", totalShare:"Toplam Pay", totalTickets:"Toplam Bilet",
    depositMission:"Yatırım Görevi", betMission:"Bahis Görevi", inviteMission:"Davet Görevi", dailyLoginMission:"Günlük Giriş Görevi",
    invitePlayer:"100 USDT yatıran oyuncu davet et", validInvites:"Geçerli Davet", inviteRewardDesc:"Ödül 10 USDT ve kazanan havuzundan %5 pay içerir.",
    sevenDayLogin:"7 Gün Giriş", totalFive:"Toplam 5 USDT", claimedToday:"Bugün Alındı", claimed:"Alındı",
    depositTarget:"{amount} USDT yatır", betTarget:"{amount} USDT bahis yap", needMore:"{amount} USDT daha gerekli", turnoverRequired:"1x çevrim gerekli",
    platformPromotion:"Platform Kampanyası", depositBonus:"100 USDT yatır, 20 USDT bonus al", progress:"İlerleme", missionCenter:"Görev Merkezi",
    firstDepositPack:"İlk Yatırım Paketi", referralPartner:"Davet Ortağı", invited:"Davet Edildi", copyInviteLink:"Davet Linkini Kopyala", inviteLink:"Davet Linki",
    depositRecord:"Yatırım", withdrawRecord:"Çekim", betRecord:"Bahis", winRecord:"Kazanç", walletHistory:"Cüzdan Geçmişi",
    depositHistory:"Yatırım Geçmişi", withdrawHistory:"Çekim Geçmişi", betHistory:"Bahis Geçmişi", winHistory:"Kazanç Geçmişi",
    confirmed:"Onaylandı", pending:"Beklemede", completed:"Tamamlandı", rejected:"Reddedildi", cancelled:"İptal", active:"Aktif",
    receipt:"Dekont", crypto:"Kripto", depositCrypto:"Kripto Yatırma", selectAmount:"Yatırım tutarı seç", chooseScreenshot:"Ödeme ekran görüntüsü yükle",
    fileLimit:"JPG/PNG en fazla 5MB", submitScreenshot:"Ekran görüntüsünü gönder", uploading:"Yükleniyor...", pendingAdmin:"Admin onayı bekleniyor",
    noRecords:"Kayıt yok.", noWalletRecords:"Cüzdan kaydı yok.", lockedTurnover:"Çekimden önce gereken çevrim:",
    availableBalance:"Kullanılabilir Bakiye", bonus:"Alınan Bonus", totalBetAmount:"Toplam Bahis", poolShare:"Havuz Payı", contactSupport:"Destek",
    liveSupport:"Canlı Destek", orderDetail:"Emir Detayı", championBet:"Şampiyon bahsi"
  }
};
Object.keys(SABA_V6_FINAL_LANGUAGE_CLEANUP).forEach((code) => {
  I18N[code] = { ...(I18N[code] || I18N.en), ...SABA_V6_FINAL_LANGUAGE_CLEANUP[code] };
});


function localTxTypeLabel(t, type) {
  const key = String(type || "").toLowerCase();
  if (key.includes("deposit")) return t("depositRecord") || t("deposit");
  if (key.includes("withdraw")) return t("withdrawRecord") || t("withdraw");
  if (key.includes("bet")) return t("betRecord") || t("bet");
  if (key.includes("win") || key.includes("settle") || key.includes("payout")) return t("winRecord") || t("win");
  return type || "";
}

function localRemarkText(text, lang, t) {
  let s = String(text || "");
  if (!s || s === "-") return s || "-";
  s = s.replace(/^RECEIPT:/i, `${t("receipt")}: `);
  s = s.replace(/\bDeposit confirmed\b/gi, t("depositConfirmed") || t("confirmed"));
  s = s.replace(/Champion bet\s+([A-Za-zÀ-ÿ\s\-\(\)]+?)\s*\/\s*([0-9.]+)\s*tickets?\s*\/\s*([0-9.]+)\s*shares?/gi, (_, team, tk, sh) =>
    `${t("championBet")} ${localTeamName(team.trim(), lang)} / ${tk} ${t("tickets")} / ${sh} ${t("shares")}`
  );
  s = s.replace(/Champion bet\s+([A-Za-zÀ-ÿ\s\-\(\)]+?)\s*\/\s*([0-9.]+)\s*tickets?/gi, (_, team, tk) =>
    `${t("championBet")} ${localTeamName(team.trim(), lang)} / ${tk} ${t("tickets")}`
  );
  s = s.replace(/Champion bet\s+([A-Za-zÀ-ÿ\s\-\(\)]+?)\s+([0-9.]+)\s*tickets?/gi, (_, team, tk) =>
    `${t("championBet")} ${localTeamName(team.trim(), lang)} / ${tk} ${t("tickets")}`
  );
  s = s.replace(/\bChampion bet\b/gi, t("championBet"));
  s = s.replace(/\btickets\b/gi, t("tickets"));
  s = s.replace(/\bshares\b/gi, t("shares"));
  return s;
}


function formatUsdFull(value, fallback = 0) {
  const n = Number(value ?? fallback ?? 0);
  if (!Number.isFinite(n)) return `${Number(fallback || 0).toLocaleString("en-US")} USD`;
  return `${Math.round(n).toLocaleString("en-US")} USD`;
}



const SABA_V6_REWARDS_DEPOSIT_I18N = {
  en: {
    inviteMission:"Invite Mission", invitePlayer:"Invite player with 100 USDT deposit", validInvites:"Valid Invites",
    inviteRewardDesc:"Reward includes 10 USDT and 5% of winner pool share.",
    dailyLoginMission:"Daily Login Mission", sevenDayLogin:"7-Day Login", totalFive:"Total 5 USDT",
    claimedToday:"Claimed Today", depositMission:"Deposit Mission", depositTarget:"Deposit {amount} USDT",
    needMore:"Need {amount} USDT more", turnoverRequired:"1x turnover required", claimed:"Claimed",
    platformPromotion:"Platform Promotion", missionCenter:"Mission Center", depositBonus:"Deposit 100 USDT, get 20 USDT bonus",
    progress:"Progress", depositHistory:"Deposit History", withdrawHistory:"Withdraw History", betHistory:"Bet History",
    winHistory:"Win History", depositRecord:"Deposit", withdrawRecord:"Withdraw", betRecord:"Bet", winRecord:"Win",
    confirmed:"Confirmed", pending:"Pending", completed:"Completed", rejected:"Rejected", cancelled:"Cancelled",
    receipt:"Receipt", crypto:"Crypto", depositCrypto:"Deposit Crypto", selectAmount:"Select deposit amount",
    chooseScreenshot:"Upload Screenshot", submitScreenshot:"Submit Screenshot", pendingAdmin:"Pending Admin Confirmation",
    walletHistory:"Wallet History", noWalletRecords:"No wallet records."
  },
  zh: {
    inviteMission:"邀请任务", invitePlayer:"邀请玩家完成 100 USDT 充值", validInvites:"有效邀请",
    inviteRewardDesc:"奖励包含 10 USDT，以及赢家奖池 5% 分成。",
    dailyLoginMission:"每日登录任务", sevenDayLogin:"7 天登录", totalFive:"总计 5 USDT",
    claimedToday:"今日已领取", depositMission:"入金任务", depositTarget:"入金 {amount} USDT",
    needMore:"还差 {amount} USDT", turnoverRequired:"需要 1 倍流水", claimed:"已领取",
    platformPromotion:"平台活动", missionCenter:"任务中心", depositBonus:"入金 100 USDT，领取 20 USDT 奖励",
    progress:"进度", depositHistory:"入金记录", withdrawHistory:"提现记录", betHistory:"下注记录",
    winHistory:"派奖记录", depositRecord:"入金", withdrawRecord:"提现", betRecord:"下注", winRecord:"派奖",
    confirmed:"已确认", pending:"待审核", completed:"已完成", rejected:"已拒绝", cancelled:"已取消",
    receipt:"凭证", crypto:"加密货币", depositCrypto:"加密货币入金", selectAmount:"选择入金金额",
    chooseScreenshot:"上传付款截图", submitScreenshot:"提交截图", pendingAdmin:"等待管理员审核",
    walletHistory:"钱包记录", noWalletRecords:"暂无钱包记录。"
  },
  ja: {
    inviteMission:"招待ミッション", invitePlayer:"100 USDT入金するプレイヤーを招待", validInvites:"有効招待",
    inviteRewardDesc:"報酬は10 USDTと勝者プール5%シェアです。",
    dailyLoginMission:"デイリーログインミッション", sevenDayLogin:"7日間ログイン", totalFive:"合計 5 USDT",
    claimedToday:"本日受取済み", depositMission:"入金ミッション", depositTarget:"{amount} USDT 入金",
    needMore:"あと {amount} USDT", turnoverRequired:"1倍の賭け条件が必要", claimed:"受取済み",
    platformPromotion:"プロモーション", missionCenter:"ミッションセンター", depositBonus:"100 USDT入金で20 USDTボーナス",
    progress:"進捗", depositHistory:"入金履歴", withdrawHistory:"出金履歴", betHistory:"ベット履歴",
    winHistory:"配当履歴", depositRecord:"入金", withdrawRecord:"出金", betRecord:"ベット", winRecord:"配当",
    confirmed:"確認済み", pending:"審査中", completed:"完了", rejected:"拒否", cancelled:"取消済み",
    receipt:"領収書", crypto:"暗号資産", depositCrypto:"暗号資産入金", selectAmount:"入金額を選択",
    chooseScreenshot:"支払い画像をアップロード", submitScreenshot:"画像を提出", pendingAdmin:"管理者確認待ち",
    walletHistory:"ウォレット履歴", noWalletRecords:"ウォレット履歴はありません。"
  },
  ko: {
    inviteMission:"초대 미션", invitePlayer:"100 USDT 입금 플레이어 초대", validInvites:"유효 초대",
    inviteRewardDesc:"보상은 10 USDT와 우승자 풀 5% 쉐어입니다.",
    dailyLoginMission:"일일 로그인 미션", sevenDayLogin:"7일 로그인", totalFive:"총 5 USDT",
    claimedToday:"오늘 수령 완료", depositMission:"입금 미션", depositTarget:"{amount} USDT 입금",
    needMore:"{amount} USDT 더 필요", turnoverRequired:"1배 롤오버 필요", claimed:"수령 완료",
    platformPromotion:"플랫폼 이벤트", missionCenter:"미션 센터", depositBonus:"100 USDT 입금 시 20 USDT 보너스",
    progress:"진행도", depositHistory:"입금 내역", withdrawHistory:"출금 내역", betHistory:"베팅 내역",
    winHistory:"지급 내역", depositRecord:"입금", withdrawRecord:"출금", betRecord:"베팅", winRecord:"지급",
    confirmed:"확인됨", pending:"심사 중", completed:"완료", rejected:"거절됨", cancelled:"취소됨",
    receipt:"영수증", crypto:"암호화폐", depositCrypto:"암호화폐 입금", selectAmount:"입금 금액 선택",
    chooseScreenshot:"결제 스크린샷 업로드", submitScreenshot:"스크린샷 제출", pendingAdmin:"관리자 확인 대기",
    walletHistory:"지갑 내역", noWalletRecords:"지갑 내역이 없습니다."
  },
  tr: {
    inviteMission:"Davet Görevi", invitePlayer:"100 USDT yatıran oyuncu davet et", validInvites:"Geçerli Davet",
    inviteRewardDesc:"Ödül 10 USDT ve kazanan havuzundan %5 pay içerir.",
    dailyLoginMission:"Günlük Giriş Görevi", sevenDayLogin:"7 Gün Giriş", totalFive:"Toplam 5 USDT",
    claimedToday:"Bugün Alındı", depositMission:"Yatırım Görevi", depositTarget:"{amount} USDT yatır",
    needMore:"{amount} USDT daha gerekli", turnoverRequired:"1x çevrim gerekli", claimed:"Alındı",
    platformPromotion:"Platform Kampanyası", missionCenter:"Görev Merkezi", depositBonus:"100 USDT yatır, 20 USDT bonus al",
    progress:"İlerleme", depositHistory:"Yatırım Geçmişi", withdrawHistory:"Çekim Geçmişi", betHistory:"Bahis Geçmişi",
    winHistory:"Kazanç Geçmişi", depositRecord:"Yatırım", withdrawRecord:"Çekim", betRecord:"Bahis", winRecord:"Kazanç",
    confirmed:"Onaylandı", pending:"Beklemede", completed:"Tamamlandı", rejected:"Reddedildi", cancelled:"İptal",
    receipt:"Dekont", crypto:"Kripto", depositCrypto:"Kripto Yatırma", selectAmount:"Yatırım tutarı seç",
    chooseScreenshot:"Ödeme ekran görüntüsü yükle", submitScreenshot:"Ekran görüntüsünü gönder", pendingAdmin:"Admin onayı bekleniyor",
    walletHistory:"Cüzdan Geçmişi", noWalletRecords:"Cüzdan kaydı yok."
  },
  es: {
    inviteMission:"Misión de Invitación", invitePlayer:"Invita a un jugador con depósito de 100 USDT", validInvites:"Invitaciones Válidas",
    inviteRewardDesc:"La recompensa incluye 10 USDT y 5% del pool de ganadores.",
    dailyLoginMission:"Misión de Login Diario", sevenDayLogin:"Login de 7 días", totalFive:"Total 5 USDT",
    claimedToday:"Cobrado Hoy", depositMission:"Misión de Depósito", depositTarget:"Deposita {amount} USDT",
    needMore:"Faltan {amount} USDT", turnoverRequired:"Requiere 1x de rollover", claimed:"Cobrado",
    platformPromotion:"Promoción", missionCenter:"Centro de Misiones", depositBonus:"Deposita 100 USDT y recibe 20 USDT",
    progress:"Progreso", depositHistory:"Historial de Depósitos", withdrawHistory:"Historial de Retiros", betHistory:"Historial de Apuestas",
    winHistory:"Historial de Premios", depositRecord:"Depósito", withdrawRecord:"Retiro", betRecord:"Apuesta", winRecord:"Premio",
    confirmed:"Confirmado", pending:"Pendiente", completed:"Completado", rejected:"Rechazado", cancelled:"Cancelado",
    receipt:"Recibo", crypto:"Cripto", depositCrypto:"Depósito Cripto", selectAmount:"Selecciona monto",
    chooseScreenshot:"Subir captura de pago", submitScreenshot:"Enviar captura", pendingAdmin:"Pendiente de revisión",
    walletHistory:"Historial de Wallet", noWalletRecords:"Sin registros."
  },
  ru: {
    inviteMission:"Задание приглашения", invitePlayer:"Пригласите игрока с депозитом 100 USDT", validInvites:"Действительные приглашения",
    inviteRewardDesc:"Награда включает 10 USDT и 5% доли пула победителей.",
    dailyLoginMission:"Ежедневный вход", sevenDayLogin:"Вход 7 дней", totalFive:"Всего 5 USDT",
    claimedToday:"Получено сегодня", depositMission:"Задание депозита", depositTarget:"Пополнить {amount} USDT",
    needMore:"Нужно еще {amount} USDT", turnoverRequired:"Требуется 1x оборот", claimed:"Получено",
    platformPromotion:"Акция платформы", missionCenter:"Центр заданий", depositBonus:"Пополните 100 USDT и получите 20 USDT",
    progress:"Прогресс", depositHistory:"История депозитов", withdrawHistory:"История выводов", betHistory:"История ставок",
    winHistory:"История выплат", depositRecord:"Депозит", withdrawRecord:"Вывод", betRecord:"Ставка", winRecord:"Выплата",
    confirmed:"Подтверждено", pending:"Ожидает", completed:"Завершено", rejected:"Отклонено", cancelled:"Отменено",
    receipt:"Квитанция", crypto:"Крипто", depositCrypto:"Крипто депозит", selectAmount:"Выберите сумму",
    chooseScreenshot:"Загрузить скрин оплаты", submitScreenshot:"Отправить скрин", pendingAdmin:"Ожидает проверки",
    walletHistory:"История кошелька", noWalletRecords:"Записей нет."
  },
  ar: {
    inviteMission:"مهمة الدعوة", invitePlayer:"ادعُ لاعبًا يودع 100 USDT", validInvites:"دعوات صالحة",
    inviteRewardDesc:"المكافأة تشمل 10 USDT و5% من حصة مجمع الفائزين.",
    dailyLoginMission:"مهمة تسجيل الدخول اليومية", sevenDayLogin:"تسجيل 7 أيام", totalFive:"الإجمالي 5 USDT",
    claimedToday:"تم الاستلام اليوم", depositMission:"مهمة الإيداع", depositTarget:"إيداع {amount} USDT",
    needMore:"تحتاج {amount} USDT إضافية", turnoverRequired:"مطلوب دوران 1x", claimed:"تم الاستلام",
    platformPromotion:"عرض المنصة", missionCenter:"مركز المهام", depositBonus:"أودع 100 USDT واحصل على 20 USDT",
    progress:"التقدم", depositHistory:"سجل الإيداع", withdrawHistory:"سجل السحب", betHistory:"سجل الرهانات",
    winHistory:"سجل الجوائز", depositRecord:"إيداع", withdrawRecord:"سحب", betRecord:"رهان", winRecord:"جائزة",
    confirmed:"مؤكد", pending:"قيد المراجعة", completed:"مكتمل", rejected:"مرفوض", cancelled:"ملغي",
    receipt:"إيصال", crypto:"كريبتو", depositCrypto:"إيداع كريبتو", selectAmount:"اختر مبلغ الإيداع",
    chooseScreenshot:"ارفع لقطة الدفع", submitScreenshot:"إرسال اللقطة", pendingAdmin:"بانتظار مراجعة الإدارة",
    walletHistory:"سجل المحفظة", noWalletRecords:"لا توجد سجلات."
  },
  hi: {
    inviteMission:"इनवाइट मिशन", invitePlayer:"100 USDT जमा करने वाले खिलाड़ी को आमंत्रित करें", validInvites:"मान्य इनवाइट",
    inviteRewardDesc:"रिवॉर्ड में 10 USDT और विनर पूल का 5% शेयर शामिल है।",
    dailyLoginMission:"डेली लॉगिन मिशन", sevenDayLogin:"7-दिन लॉगिन", totalFive:"कुल 5 USDT",
    claimedToday:"आज क्लेम हो गया", depositMission:"डिपॉजिट मिशन", depositTarget:"{amount} USDT जमा करें",
    needMore:"{amount} USDT और चाहिए", turnoverRequired:"1x टर्नओवर जरूरी", claimed:"क्लेम हो गया",
    platformPromotion:"प्लेटफॉर्म प्रमोशन", missionCenter:"मिशन सेंटर", depositBonus:"100 USDT जमा करें, 20 USDT बोनस पाएं",
    progress:"प्रगति", depositHistory:"डिपॉजिट इतिहास", withdrawHistory:"निकासी इतिहास", betHistory:"बेट इतिहास",
    winHistory:"विन इतिहास", depositRecord:"डिपॉजिट", withdrawRecord:"निकासी", betRecord:"बेट", winRecord:"विन",
    confirmed:"पुष्टि हुई", pending:"लंबित", completed:"पूरा", rejected:"अस्वीकृत", cancelled:"रद्द",
    receipt:"रसीद", crypto:"क्रिप्टो", depositCrypto:"क्रिप्टो डिपॉजिट", selectAmount:"डिपॉजिट राशि चुनें",
    chooseScreenshot:"पेमेंट स्क्रीनशॉट अपलोड करें", submitScreenshot:"स्क्रीनशॉट जमा करें", pendingAdmin:"एडमिन समीक्षा बाकी",
    walletHistory:"वॉलेट इतिहास", noWalletRecords:"कोई रिकॉर्ड नहीं."
  }
};
Object.keys(SABA_V6_REWARDS_DEPOSIT_I18N).forEach((code) => {
  I18N[code] = { ...(I18N[code] || I18N.en), ...SABA_V6_REWARDS_DEPOSIT_I18N[code] };
});


const SABA_V6_WITHDRAW_MULTI_COIN_I18N = {
  en: { withdraw:"Withdraw", withdrawAmount:"Withdraw Amount", withdrawAddress:"Withdraw Address", withdrawMethod:"Withdraw Coin", createWithdraw:"Create Withdraw", receiveEstimate:"Estimated Receive", withdrawRate:"Realtime Rate", afterFee:"After Fee", selectWithdrawCoin:"Select withdraw coin" },
  zh: { withdraw:"提现", withdrawAmount:"提现金额", withdrawAddress:"提现地址", withdrawMethod:"提现币种", createWithdraw:"创建提现", receiveEstimate:"预计到账", withdrawRate:"实时汇率", afterFee:"扣费后", selectWithdrawCoin:"选择提现币种" },
  ja: { withdraw:"出金", withdrawAmount:"出金額", withdrawAddress:"出金アドレス", withdrawMethod:"出金币種", createWithdraw:"出金申請", receiveEstimate:"受取予定", withdrawRate:"リアルタイムレート", afterFee:"手数料後", selectWithdrawCoin:"出金币種を選択" },
  ko: { withdraw:"출금", withdrawAmount:"출금 금액", withdrawAddress:"출금 주소", withdrawMethod:"출금 코인", createWithdraw:"출금 신청", receiveEstimate:"예상 수령", withdrawRate:"실시간 환율", afterFee:"수수료 후", selectWithdrawCoin:"출금 코인 선택" },
  tr: { withdraw:"Çekim", withdrawAmount:"Çekim Tutarı", withdrawAddress:"Çekim Adresi", withdrawMethod:"Çekim Coini", createWithdraw:"Çekim Oluştur", receiveEstimate:"Tahmini Alım", withdrawRate:"Canlı Kur", afterFee:"Ücret Sonrası", selectWithdrawCoin:"Çekim coinini seç" },
  es: { withdraw:"Retiro", withdrawAmount:"Monto de Retiro", withdrawAddress:"Dirección de Retiro", withdrawMethod:"Moneda de Retiro", createWithdraw:"Crear Retiro", receiveEstimate:"Recibo Estimado", withdrawRate:"Tasa en Vivo", afterFee:"Después de Comisión", selectWithdrawCoin:"Seleccionar moneda" },
  ru: { withdraw:"Вывод", withdrawAmount:"Сумма вывода", withdrawAddress:"Адрес вывода", withdrawMethod:"Монета вывода", createWithdraw:"Создать вывод", receiveEstimate:"Ожидаемое получение", withdrawRate:"Курс в реальном времени", afterFee:"После комиссии", selectWithdrawCoin:"Выберите монету" },
  ar: { withdraw:"سحب", withdrawAmount:"مبلغ السحب", withdrawAddress:"عنوان السحب", withdrawMethod:"عملة السحب", createWithdraw:"إنشاء طلب سحب", receiveEstimate:"المبلغ المتوقع", withdrawRate:"السعر المباشر", afterFee:"بعد الرسوم", selectWithdrawCoin:"اختر عملة السحب" },
  hi: { withdraw:"निकासी", withdrawAmount:"निकासी राशि", withdrawAddress:"निकासी पता", withdrawMethod:"निकासी कॉइन", createWithdraw:"निकासी बनाएं", receiveEstimate:"अनुमानित प्राप्ति", withdrawRate:"लाइव रेट", afterFee:"फीस के बाद", selectWithdrawCoin:"निकासी कॉइन चुनें" }
};
Object.keys(SABA_V6_WITHDRAW_MULTI_COIN_I18N).forEach((code) => {
  I18N[code] = { ...(I18N[code] || I18N.en), ...SABA_V6_WITHDRAW_MULTI_COIN_I18N[code] };
});


function localStatusLabel(t, status) {
  const key = String(status || "").toLowerCase();
  if (key === "confirmed") return t("confirmed");
  if (key === "pending") return t("pending");
  if (key === "completed") return t("completed");
  if (key === "rejected") return t("rejected");
  if (key === "cancelled" || key === "canceled") return t("cancelled");
  return status || "";
}

function localTeamName(team, lang, names) {
  const code = lang || "en";
  const key = normalizeTeamKey(team);
  if (!key) return "";
  return names?.[code] || TEAM_NAME_I18N_FRONT?.[key]?.[code] || TEAM_NAME_I18N_FRONT?.[key]?.en || key;
}

function localMetricLabel(key, lang) {
  const dict = {
    totalTickets: { en: "Total Tickets", zh: "总票数", ja: "総チケット数", ko: "총 티켓", tr: "Toplam Bilet", es: "Boletos Totales", ru: "Всего билетов", ar: "إجمالي التذاكر", hi: "कुल टिकट" },
    totalShare: { en: "Total Share", zh: "总分成", ja: "総シェア", ko: "총 쉐어", tr: "Toplam Pay", es: "Participación Total", ru: "Общая доля", ar: "إجمالي الحصة", hi: "कुल शेयर" },
    betAmount: { en: "Bet Amount", zh: "下注金额", ja: "ベット額", ko: "베팅 금액", tr: "Bahis Tutarı", es: "Monto Apostado", ru: "Сумма ставки", ar: "مبلغ الرهان", hi: "दांव राशि" },
    btcShare: { en: "BTC Share", zh: "BTC 分成", ja: "BTCシェア", ko: "BTC 쉐어", tr: "BTC Payı", es: "Participación BTC", ru: "BTC доля", ar: "حصة BTC", hi: "BTC शेयर" },
  };
  return dict[key]?.[lang] || dict[key]?.en || key;
}


function RankingsPage({ t, tgUser, initData, lang = 'en' }) {
  const [kind, setKind] = useState("teams");
  const [data, setData] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  function ordinal(n) {
    const num = Number(n);
    if (num % 100 >= 11 && num % 100 <= 13) return `${num}th`;
    if (num % 10 === 1) return `${num}st`;
    if (num % 10 === 2) return `${num}nd`;
    if (num % 10 === 3) return `${num}rd`;
    return `${num}th`;
  }

  async function load(k = kind) {
    setLoading(true);
    try {
      const apiKind = k === "bettors" ? "bet" : k;
      const d = await api(`/api/rankings?kind=${encodeURIComponent(apiKind)}&limit=10`, { tgUser, initData });
      const items = d?.items || d?.rankings || d?.teams || d?.btc_share_ranking || d?.bet_ranking || d?.bets || d?.bettors || [];
      setData({ ...(d || {}), items });
    } catch (err) {
      console.warn("Ranking load failed:", err);
      setData({ kind: k, items: [], error: err?.message || "Ranking data is not ready. Please update the backend API." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(kind); }, [kind]);

  return (
    <section className="page-section rankings-page">
      <h2>{t("rankings") || "Rankings"}</h2>
      <div className="ranking-tabs">
        <button className={kind==="teams" ? "active" : ""} onClick={() => setKind("teams")}>{t("teamRanking") || "Team Ranking"}</button>
        <button className={kind==="btc" ? "active" : ""} onClick={() => setKind("btc")}>{t("btcRanking") || "BTC Share Ranking"}</button>
        <button className={kind==="bettors" ? "active" : ""} onClick={() => setKind("bettors")}>{t("betRanking") || "Bet Ranking"}</button>
      </div>

      {loading && <div className="empty-history">Loading Top 10...</div>}
      {data?.error && <div className="empty-history">{data.error}</div>}

      <div className="ranking-list top10-ranking-list">
        {!loading && !data?.error && (data.items || []).length === 0 && <div className="empty-history">No ranking data yet.</div>}
        {(data.items || []).slice(0, 10).map((x, i) => (
          <div className={`ranking-card top10-ranking-card ${i < 3 ? `top${i+1}` : ""}`} key={i}>
            <strong className={`ordinal-rank rank-${i+1}`}>{ordinal(i + 1)}</strong>
            <div className="ranking-main">
              {kind === "teams" ? (
                <>
                  <b className="team-rank-title"><span className="team-rank-emoji">{x.flag || x.flag_emoji || ""}</span><span className="team-rank-name">{localTeamName(x.team || x.name, lang, x.names)}</span></b>
                  <span>{localMetricLabel("betAmount", lang)}: <span className="metric">{x.amount || x.amount_usdt || x.total_bet || "0.00"} USDT</span> · {localMetricLabel("totalShare", lang)}: <span className="metric">{x.share || x.shares || x.total_share || "0.00"}</span></span>
                </>
              ) : kind === "btc" ? (
                <>
                  <b className="player-rank-title">{x.player || x.display_name || x.name || "Player"}</b>
                  <span>{localMetricLabel("btcShare", lang)}: <span className="metric">{x.btc_share || "0.000000"}</span> · {localMetricLabel("betAmount", lang)}: <span className="metric">{x.amount || x.amount_usdt || x.total_bet || "0.00"} USDT</span> · {localMetricLabel("totalShare", lang)}: <span className="metric">{x.share || x.shares || x.total_share || "0.00"}</span></span>
                </>
              ) : (
                <>
                  <b className="player-rank-title">{x.player || x.display_name || x.name || "Player"}</b>
                  <span>{localMetricLabel("betAmount", lang)}: <span className="metric">{x.amount || x.amount_usdt || x.total_bet || "0.00"} USDT</span> · {localMetricLabel("totalShare", lang)}: <span className="metric">{x.share || x.shares || x.total_share || "0.00"}</span> · {localMetricLabel("btcShare", lang)}: <span className="metric">{x.btc_share || "0.000000"}</span></span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


function MessagesPage({ t, lang = "en", tgUser, initData }) {
  const [items, setItems] = useState([]);
  async function load() {
    try {
      const d = await api("/api/messages", { tgUser, initData });
      setItems(d.items || []);
    } catch (err) {
      alert(err.message);
    }
  }
  useEffect(() => { load(); }, []);
  return (
    <section className="page-section messages-page">
      <h2>{t("messages") || "Messages"}</h2>
      <div className="message-list">
        {items.length === 0 && <div className="empty-history">No messages.</div>}
        {items.map((m) => (
          <div className={`message-card ${m.is_read ? "" : "unread"}`} key={m.id}>
            <b>{m.title}</b>
            <p>{m.body}</p>
            <small>{m.created_at}</small>
          </div>
        ))}
      </div>
    </section>
  );
}


const SABA_V7_TEAM_DETAIL_FIX_I18N = {
  en: { topSupporters:"Top Players" },
  zh: { topSupporters:"下注用户榜" },
  ja: { topSupporters:"ベットユーザーランキング" },
  ko: { topSupporters:"베팅 유저 랭킹" },
  tr: { topSupporters:"Bahis Oyuncu Sıralaması" },
  es: { topSupporters:"Top Apostadores" },
  ru: { topSupporters:"Топ игроков" },
  ar: { topSupporters:"أفضل المراهنين" },
  hi: { topSupporters:"टॉप बेटर्स" }
};
Object.keys(SABA_V7_TEAM_DETAIL_FIX_I18N).forEach((code) => {
  I18N[code] = { ...(I18N[code] || I18N.en), ...SABA_V7_TEAM_DETAIL_FIX_I18N[code] };
});

function TeamDetailModal({ t, team, tgUser, initData, onClose, onBet, myBets = [], lang = 'en'}) {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState("");

  const localMine = useMemo(() => {
    const items = (myBets || []).filter((b) => String(b.team || "").toLowerCase() === String(team?.name || "").toLowerCase());
    const amount = items.reduce((s, b) => s + Number(b.amount || b.amount_usdt || 0), 0);
    const tickets = items.reduce((s, b) => s + Number(b.tickets || 0), 0);
    const shares = items.reduce((s, b) => s + Number(b.shares || 0), 0);
    return { amount, tickets, shares };
  }, [myBets, team?.name]);

  useEffect(() => {
    if (!team?.name) return;
    setLoadError("");
    api(`/api/team_detail?team=${encodeURIComponent(team.name)}`, { tgUser, initData })
      .then(setData)
      .catch((e) => {
        console.warn("team_detail failed:", e);
        setLoadError(e.message || "Failed to fetch");
      });
  }, [team?.name, tgUser?.id, initData]);

  if (!team) return null;

  const closed = data?.is_open === false || (data?.status && data.status !== "open");
  const myAmount = data?.my_amount ?? localMine.amount.toFixed(2);
  const myTickets = data?.my_tickets ?? String(localMine.tickets || 0);
  const myShares = data?.my_shares ?? localMine.shares.toFixed(2);
  const totalTickets = data?.total_tickets ?? team.total_ticket ?? 0;
  const totalShare = data?.total_share ?? team.total_share ?? "0.00";
  const totalBet = data?.total_bet_amount ?? team.total_bet ?? "0.00";
  const rate = data?.share_rate ?? team.share_rate ?? "1.50";
  const estWin = data?.my_expected_win ?? "0.00";

  return (
    <div className="team-detail-bg" onClick={onClose}>
      <div className="team-detail-card enhanced-team-detail" onClick={(e) => e.stopPropagation()}>
        <button className="activity-close" onClick={onClose}>×</button>
        <h2>{team.flag} {localTeamName(team.name, lang, data?.names || team.names)}</h2>
        <div className={`team-status ${closed ? "closed" : "open"}`}>{closed ? t("teamPaused") : t("active")}</div>
        {data?.reason && <div className="notice-card">{data.reason}</div>}
        {loadError && <div className="notice-card soft-error">{t("teamDetail")} API: {loadError}</div>}

        <div className="team-detail-grid no-supporters-grid">
          <div><small>{t("teamTotalBet")}</small><b>{totalBet} USDT</b></div>
          <div><small>{t("currentShareRate")}</small><b>{rate}x</b></div>
          <div><small>{t("totalTickets")}</small><b>{totalTickets}</b></div>
          <div><small>{t("totalShare")}</small><b>{totalShare}</b></div>
          <div><small>{t("myAmount")}</small><b>{myAmount} USDT</b></div>
          <div><small>{t("myTickets")}</small><b>{myTickets}</b></div>
          <div><small>{t("myShares")}</small><b>{myShares}</b></div>
          <div><small>{t("estWin")}</small><b>{estWin} USDT</b></div>
        </div>

        <h3>{t("topSupporters")}</h3>
        <div className="supporter-list">
          {(data?.top_supporters || []).map((x, i) => (
            <div className="supporter-row" key={i}><b>{i+1}. {x.player}</b><span>{x.amount} USDT · {x.shares}</span></div>
          ))}
          {(data?.top_supporters || []).length === 0 && <div className="empty-history">{t("noRecords")}</div>}
        </div>

        <button className="red-button wide-red-button" disabled={closed} onClick={() => { onBet(team); onClose(); }}>
          {closed ? t("closed") : t("bet")}
        </button>
      </div>
    </div>
  );
}


function localWithdrawStatusText(t, status) {
  const s = String(status || "").toLowerCase();
  if (s === "completed" || s === "confirmed" || s === "approved") return t("withdrawCompleted");
  if (s === "pending") return t("withdrawPending");
  if (s === "rejected" || s === "cancelled" || s === "canceled") return t("withdrawRejected");
  return localStatusLabel ? localStatusLabel(t, status) : (status || "");
}


const SABA_ORDER_LIST_I18N_FINAL = {
  en: { depositOrder:"Deposit Order", withdrawOrder:"Withdraw Order", betId:"Bet ID", copied:"Copied", copy:"Copy", orderList:"Order List", selectOrderType:"Select order type", noOrderRecords:"No order records yet.", clickToView:"Tap a record to view details", supportTip:"Copy the ID and send it to support if needed." },
  zh: { depositOrder:"充值订单", withdrawOrder:"提现订单", betId:"下注 ID", copied:"已复制", copy:"复制", orderList:"订单列表", selectOrderType:"选择订单类型", noOrderRecords:"暂无订单记录。", clickToView:"点击记录查看详情", supportTip:"需要客服协助时，可复制 ID 发给客服。" },
  ja: { depositOrder:"入金注文", withdrawOrder:"出金注文", betId:"ベットID", copied:"コピー済み", copy:"コピー", orderList:"注文リスト", selectOrderType:"注文タイプを選択", noOrderRecords:"注文記録はありません。", clickToView:"記録をタップして詳細を確認", supportTip:"必要な場合はIDをコピーしてサポートへ送信してください。" },
  ko: { depositOrder:"입금 주문", withdrawOrder:"출금 주문", betId:"베팅 ID", copied:"복사됨", copy:"복사", orderList:"주문 목록", selectOrderType:"주문 유형 선택", noOrderRecords:"주문 기록이 없습니다.", clickToView:"기록을 눌러 상세 확인", supportTip:"필요하면 ID를 복사해 고객지원에 보내세요." },
  tr: { depositOrder:"Yatırım Emri", withdrawOrder:"Çekim Emri", betId:"Bahis ID", copied:"Kopyalandı", copy:"Kopyala", orderList:"Emir Listesi", selectOrderType:"Emir türü seç", noOrderRecords:"Emir kaydı yok.", clickToView:"Detay için kayda dokun", supportTip:"Gerekirse ID'yi kopyalayıp desteğe gönderin." },
  es: { depositOrder:"Orden de Depósito", withdrawOrder:"Orden de Retiro", betId:"ID de Apuesta", copied:"Copiado", copy:"Copiar", orderList:"Lista de Órdenes", selectOrderType:"Seleccionar tipo de orden", noOrderRecords:"Sin registros.", clickToView:"Toca un registro para ver detalles", supportTip:"Copia el ID y envíalo a soporte si hace falta." },
  ru: { depositOrder:"Ордер депозита", withdrawOrder:"Ордер вывода", betId:"ID ставки", copied:"Скопировано", copy:"Копировать", orderList:"Список ордеров", selectOrderType:"Выберите тип ордера", noOrderRecords:"Записей нет.", clickToView:"Нажмите запись для деталей", supportTip:"Скопируйте ID и отправьте в поддержку при необходимости." },
  ar: { depositOrder:"طلب الإيداع", withdrawOrder:"طلب السحب", betId:"معرّف الرهان", copied:"تم النسخ", copy:"نسخ", orderList:"قائمة الطلبات", selectOrderType:"اختر نوع الطلب", noOrderRecords:"لا توجد سجلات.", clickToView:"اضغط على السجل لعرض التفاصيل", supportTip:"انسخ المعرّف وأرسله للدعم عند الحاجة." },
  hi: { depositOrder:"डिपॉजिट ऑर्डर", withdrawOrder:"निकासी ऑर्डर", betId:"बेट ID", copied:"कॉपी हुआ", copy:"कॉपी", orderList:"ऑर्डर सूची", selectOrderType:"ऑर्डर प्रकार चुनें", noOrderRecords:"कोई ऑर्डर रिकॉर्ड नहीं.", clickToView:"विवरण देखने के लिए रिकॉर्ड टैप करें", supportTip:"जरूरत हो तो ID कॉपी करके सपोर्ट को भेजें." }
};
Object.keys(SABA_ORDER_LIST_I18N_FINAL).forEach((code) => {
  I18N[code] = { ...(I18N[code] || I18N.en), ...SABA_ORDER_LIST_I18N_FINAL[code] };
});

function copyTextValue(text, t) {
  const value = String(text || "");
  if (!value) return;
  try {
    navigator.clipboard?.writeText(value);
    if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(t("copied"));
  } catch (_) {}
}

function orderTypeTitle(t, type) {
  if (type === "deposit") return t("depositOrder");
  if (type === "withdraw") return t("withdrawOrder");
  if (type === "bet") return t("betId");
  return type;
}


function AssetsPage({ t, tgUser, initData, lang = 'en', deposits = [], withdraws = [], myBets = [] }) {
  const [data, setData] = useState(null);
  const [support, setSupport] = useState({ support_url: "https://t.me/SabaCs_Reena", button_text: "Live Support" });
  const [detail, setDetail] = useState(null);
  const [detailInput, setDetailInput] = useState({ type: "deposit" });
  const [withdrawAmount, setWithdrawAmount] = useState("20");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("USDT_TRC20");
  const [withdrawMethods, setWithdrawMethods] = useState([]);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawRateLoading, setWithdrawRateLoading] = useState(false);

  async function loadAssets() {
    try {
      const a = await api("/api/assets", { tgUser, initData });
      setData(a);
    } catch (err) {
      console.warn("Assets load failed:", err);
      setData({ summary: {}, wallet_history: [] });
    }
    try {
      const s = await api("/api/contact_support", { tgUser, initData });
      setSupport(s);
    } catch (err) {
      console.warn("Support config load failed:", err);
      setSupport({ support_url: "https://t.me/SabaCs_Reena", button_text: "Live Support", text: "Contact official support if you need help with deposit, withdraw, or bets." });
    }
  }


  async function loadWithdrawMethods(amountValue = withdrawAmount) {
    const n = Number(amountValue || 0);
    if (!n || n <= 0) {
      setWithdrawMethods([]);
      return;
    }
    setWithdrawRateLoading(true);
    try {
      const res = await api(`/api/withdraw/methods?amount=${encodeURIComponent(n)}`, { tgUser, initData });
      setWithdrawMethods(res.methods || []);
    } catch (err) {
      console.warn("Withdraw methods load failed:", err);
      try {
        const res = await api(`/api/deposit/methods?amount=${encodeURIComponent(n)}`, { tgUser, initData });
        setWithdrawMethods(res.methods || []);
      } catch (e) {
        setWithdrawMethods([]);
      }
    } finally {
      setWithdrawRateLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => loadWithdrawMethods(withdrawAmount), 300);
    return () => clearTimeout(timer);
  }, [withdrawAmount, tgUser?.id, initData]);

  async function createWithdrawOrder() {
    const amount = Number(withdrawAmount || 0);
    if (!amount || amount <= 0) return alert(t("withdrawAmount"));
    if (!withdrawAddress.trim()) return alert(t("withdrawAddress"));
    setWithdrawLoading(true);
    try {
      const res = await api("/api/withdraw/create", {
        method: "POST",
        body: { amount, address: withdrawAddress.trim(), method: withdrawMethod },
        tgUser,
        initData,
      });
      alert(`${t("withdrawCreated")}: ${res.order_no}\\n${t("receiveEstimate")}: ${res.pay_amount || res.receive} ${res.coin_symbol || "USDT"}`);
      setWithdrawAddress("");
      await loadAssets();
    } finally {
      setWithdrawLoading(false);
    }
  }


  async function loadOrderDetail(orderType, orderNo) {
    if (!orderNo) return;
    try {
      const d = await api(`/api/order_detail?order_type=${encodeURIComponent(orderType)}&order_no=${encodeURIComponent(orderNo)}`, { tgUser, initData });
      setDetail(d);
    } catch (err) {
      alert(err.message);
    }
  }

  const visibleOrders = detailInput.type === "deposit"
    ? (deposits || []).map((d) => ({
        type: "deposit",
        id: d.order_no,
        title: t("depositOrder"),
        amount: `${d.amount_usdt || d.amount || "0.00"} USDT`,
        status: localStatusLabel(t, d.status),
        time: d.created_at || d.confirmed_at || "",
        extra: d.network || d.coin_symbol || "",
      }))
    : detailInput.type === "withdraw"
      ? (withdraws || []).map((w) => ({
          type: "withdraw",
          id: w.order_no,
          title: t("withdrawOrder"),
          amount: `${w.amount_usdt || w.amount || "0.00"} USDT`,
          status: localWithdrawStatusText(t, w.status),
          time: w.created_at || w.processed_at || "",
          extra: w.network || w.coin_symbol || "",
        }))
      : (myBets || []).map((b) => ({
          type: "bet",
          id: b.id,
          title: `${t("betId")}: ${b.id}`,
          amount: `${b.amount || b.amount_usdt || "0.00"} USDT`,
          status: statusLabel(t, b.status),
          time: b.created_at || "",
          extra: `${localTeamName(b.team, lang, b.names)} · ${b.tickets || 0} ${t("tickets")} · ${b.shares || "0.00"} ${t("shares")}`,
        }));

  function openLiveSupport() {
    const url = support?.support_url || "https://t.me/SabaCs_Reena";
    try {
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url);
        return;
      }
    } catch (_) {}
    window.open(url, "_blank", "noopener,noreferrer");
  }

  useEffect(() => { loadAssets(); }, []);

  const s = data?.summary || {};
  const history = data?.wallet_history || [];

  return (
    <section className="page-section assets-page">
      <h2>{t("assets") || "Assets"}</h2>
      <div className="asset-grid">
        <div><small>{t("availableBalance") || "Available Balance"}</small><b>{s.available_balance || "0.00"} USDT</b></div>
        <div><small>{t("bonus") || "Bonus"}</small><b>{s.bonus || "0.00"} USDT</b><em>{s.bonus_rule || "Claimed bonuses"}</em></div>
        <div><small>{t("totalBetAmount") || "Total Bet Amount"}</small><b>{s.total_bet_amount || "0.00"} USDT</b></div>
        <div><small>{t("poolShare") || "Pool Share"}</small><b>{s.pool_share || "0.00"}</b></div>
        <div><small>{t("btcShare") || "BTC Share"}</small><b>{s.btc_share || "0.000000"}</b><em>{s.btc_share_rule || "1 ticket = 1 BTC draw share"}</em></div>
      </div>


      
      <div className="support-card withdraw-card">
        <h3><Wallet size={20} /> {t("withdraw")}</h3>
        <label className="field-label">{t("selectWithdrawCoin") || t("withdrawMethod")}</label>
        <div className="withdraw-method-grid">
          {(withdrawMethods.length ? withdrawMethods : [
            { key:"USDT_TRC20", label:"USDT", coin:"USDT", network:"TRC20", rate_usdt:"1", pay_amount: withdrawAmount, tag:"Stable / Low fee" },
            { key:"USDC_ERC20", label:"USDC", coin:"USDC", network:"ERC20", rate_usdt:"1", pay_amount: withdrawAmount, tag:"Stable / ERC20" },
            { key:"TRX_TRC20", label:"TRX", coin:"TRX", network:"TRC20", rate_usdt:"—", pay_amount:"—", tag:"Low fee" },
            { key:"TON", label:"TON", coin:"TON", network:"TON", rate_usdt:"—", pay_amount:"—", tag:"Fast" },
            { key:"BNB_BEP20", label:"BNB", coin:"BNB", network:"BEP20 / BSC", rate_usdt:"—", pay_amount:"—", tag:"BSC" },
            { key:"ETH_ERC20", label:"ETH", coin:"ETH", network:"ERC20", rate_usdt:"—", pay_amount:"—", tag:"ERC20" },
            { key:"BTC", label:"BTC", coin:"BTC", network:"Bitcoin", rate_usdt:"—", pay_amount:"—", tag:"Bitcoin" },
          ]).map((m) => (
            <button type="button" key={m.key} className={`withdraw-method-card ${withdrawMethod === m.key ? "active" : ""}`} onClick={() => setWithdrawMethod(m.key)}>
              <b>{m.coin}</b>
              <small>{m.network}</small>
              <em>{m.tag || m.network}</em>
              <span>1 {m.coin}≈{m.rate_usdt && m.rate_usdt !== "—" ? Number(m.rate_usdt).toLocaleString(undefined, { maximumFractionDigits: 8 }) : "—"} USDT</span>
            </button>
          ))}
        </div>
        <input className="dark-input" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder={t("withdrawAmount")} />
        <input className="dark-input" value={withdrawAddress} onChange={(e) => setWithdrawAddress(e.target.value)} placeholder={t("withdrawAddress")} />
        {(() => {
          const m = (withdrawMethods || []).find((x) => x.key === withdrawMethod);
          if (!m) return <p className="muted">{withdrawRateLoading ? "Loading rate..." : t("withdrawRate")}</p>;
          const afterFee = Number(withdrawAmount || 0) > 0 ? (Number(withdrawAmount) * 0.98).toFixed(2) : "0.00";
          return (
            <div className="withdraw-preview-box">
              <div><b>{t("withdrawRate")}:</b> 1 {m.coin} ≈ {Number(m.rate_usdt || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })} USDT</div>
              <div><b>{t("afterFee")}:</b> {afterFee} USDT</div>
              <div><b>{t("receiveEstimate")}:</b> {m.pay_amount || "—"} {m.coin}</div>
            </div>
          );
        })()}
        <button className="red-button wide-red-button" disabled={withdrawLoading} onClick={createWithdrawOrder}>
          {withdrawLoading ? "..." : t("createWithdraw")}
        </button>
      </div>


      <div className="support-card">
        <h3>{t("contactSupport") || "Contact Support"}</h3>
        <p>{support?.text || "Contact official support if you need help with deposit, withdraw, or bets."}</p>
        <button type="button" className="telegram-support-button blue-only" onClick={openLiveSupport}>
          <Send size={20} />
          <span>{support?.button_text || "Live Support"}</span>
        </button>
      </div>

      <div className="order-detail-card">
        <h3>{t("orderDetail") || "Order Detail"}</h3>
        <p className="order-help-text">{t("supportTip")}</p>
        <div className="order-detail-row single-select">
          <select value={detailInput.type} onChange={(e)=>{ setDetailInput({ type:e.target.value }); setDetail(null); }}>
            <option value="deposit">{t("depositOrder")}</option>
            <option value="withdraw">{t("withdrawOrder")}</option>
            <option value="bet">{t("betId")}</option>
          </select>
        </div>
        <div className="order-list-panel">
          <h4>{orderTypeTitle(t, detailInput.type)}</h4>
          {(visibleOrders || []).length === 0 && <div className="empty-history">{t("noOrderRecords")}</div>}
          {(visibleOrders || []).map((o) => (
            <div className="order-list-card" key={`${o.type}-${o.id}`} onClick={() => loadOrderDetail(o.type, o.id)}>
              <div>
                <b>{o.title}</b>
                <strong>{o.id}</strong>
                <small>{o.extra}</small>
                <small>{o.time}</small>
              </div>
              <div className="order-list-side">
                <span>{o.amount}</span>
                <em>{o.status}</em>
                <button type="button" onClick={(ev) => { ev.stopPropagation(); copyTextValue(o.id, t); }}>{t("copy")}</button>
              </div>
            </div>
          ))}
        </div>
        {detail && <pre className="detail-pre">{JSON.stringify(detail, null, 2)}</pre>}
      </div>

      <h3>{t("walletHistory") || "Wallet History"}</h3>
      <div className="wallet-history-list">
        {history.length === 0 && <div className="empty-history">{t("noWalletRecords") || "No wallet records."}</div>}
        {history.map((x, i) => {
          const rawAmount = String(x.display_amount || x.amount_usdt || x.amount || "0");
          const positive = rawAmount.trim().startsWith("+") || Number(rawAmount) > 0;
          return (
            <div className="wallet-history-card" key={i}>
              <div className="wallet-history-top">
                <b>{String(x.tx_type || x.type || x.display_type || "").toLowerCase().includes("withdraw") ? localWithdrawStatusText(t, x.status || x.display_status || x.tx_type) : localTxTypeLabel(t, x.tx_type || x.type || x.display_type || "Record")}</b>
                <strong className={positive ? "amount-plus" : "amount-minus"}>
                  {x.display_amount || x.amount_usdt || x.amount || "0"} USDT
                </strong>
              </div>
              <p>{localRemarkText(x.remark || x.note || x.display_remark || "-", lang, t)}</p>
              <small>{x.order_no || x.display_order_no || ""}{(x.order_no || x.display_order_no) ? " · " : ""}{x.display_time || x.created_at || ""}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}


function MyBetsPage({ bets, t, lang = 'en'}) {
  return (
    <div className="page">
      <div className="premium-panel">
        <div className="panel-title premium-title"><Ticket size={20} /> {t("myTickets")}</div>
        {(bets || []).length === 0 && <div className="notice-card dark-notice">{t("noBetsYet")}</div>}
        {(bets || []).map((b) => (
          <div key={b.id} className="bet-card premium-bet-card">
            <div className="bet-head">
              <b>{b.flag} {localTeamName(b.team, lang, b.names)}</b>
              <span>{statusLabel(t, b.status)}</span>
            </div>
            <div className="order-id-row bet-id-row">
              <span>{t("betId")}: <b>{b.id}</b></span>
              <button type="button" onClick={() => copyTextValue(b.id, t)}>{t("copy")}</button>
            </div>
            <div className="bet-grid">
              <div><small>{t("ticket")}</small><b>{b.tickets}</b></div>
              <div><small>{t("share")}</small><b>{b.shares}</b></div>
              <div><small>{t("betAmount")}</small><b>{b.amount}</b></div>
              <div><small>{t("est")}</small><b>{b.estimated_win}</b></div>
            </div>
            <small>{b.created_at}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewardsPage({ t, lang = "en", festival, referral, walletHistory, missions, claimDepositMission, claimBetMission, claimDailyLogin }) {
  const copy = (text) => navigator.clipboard?.writeText(text);
  const confirmed = Number(festival?.total_deposit || 0);
  const progress = Math.min(100, Math.round(((confirmed % 100) / 100) * 100 || (confirmed >= 100 ? 100 : 0)));

  return (
    <div className="page">
      <div className="promo-panel rewards-promo">
        <div className="promo-left">
          <div className="gift-orb"><Coins size={28} /></div>
          <div>
            <span className="promo-kicker">{t("platformPromotion")}</span>
            <h3>{t("depositBonus")}</h3>
          </div>
        </div>
        <div className="promo-progress-row">
          <span>{confirmed % 100 || (confirmed >= 100 ? 100 : confirmed)}/100 {t("progress")}</span>
          <span>{progress}%</span>
        </div>
        <div className="promo-progress"><div style={{ width: `${progress}%` }} /></div>
      </div>

      <div className="premium-panel">
        <div className="panel-title premium-title"><Gift size={20} /> {t("missionCenter")}</div>

        <div className="mission-lock">{t("lockedTurnover")}: <b>{missions?.locked_turnover_remaining || "0.00"} USDT</b></div>

        <h3 className="mission-heading">{t("depositMission")}</h3>
        {(missions?.deposit_missions || []).map((m) => {
          const pct = Math.min(100, Math.round(Number(m.progress) / Number(m.target) * 100));
          return (
            <div className="mission-card" key={`dep-${m.milestone}`}>
              <div className="mission-top"><b>{t("depositTarget", { amount: Number(m.target).toFixed(0) })}</b><span>+{m.reward_usdt} USDT</span></div>
              <div className="mission-progress"><div style={{width: `${pct}%`}} /></div>
              <p>{m.progress}/{m.target} · {t("needMore", { amount: m.remaining })} · {t("turnoverRequired")}</p>
              <button disabled={!m.claimable} onClick={() => claimDepositMission(m.milestone)} className="red-button mission-btn">{m.claimed ? t("claimed") : m.claimable ? t("claimBonus") : t("notReady")}</button>
            </div>
          );
        })}

        <h3 className="mission-heading">{t("betMission")}</h3>
        {(missions?.bet_missions || []).map((m) => {
          const pct = Math.min(100, Math.round(Number(m.progress) / Number(m.target) * 100));
          return (
            <div className="mission-card" key={`bet-${m.milestone}`}>
              <div className="mission-top"><b>{t("betTarget", { amount: Number(m.target).toFixed(0) })}</b><span>+{m.reward_btc_share} BTC {t("share")}</span></div>
              <div className="mission-progress"><div style={{width: `${pct}%`}} /></div>
              <p>{m.progress}/{m.target} · {t("needMore", { amount: m.remaining })}</p>
              <button disabled={!m.claimable} onClick={() => claimBetMission(m.milestone)} className="blue-button mission-btn">{m.claimed ? t("claimed") : m.claimable ? t("claimBtcShare") : t("notReady")}</button>
            </div>
          );
        })}

        <h3 className="mission-heading">{t("inviteMission")}</h3>
        <div className="mission-card">
          <div className="mission-top"><b>{t("invitePlayer")}</b><span>+10 USDT + 5%</span></div>
          <p>{t("validInvites")}: {missions?.invite_mission?.valid_invites || 0}. {t("inviteRewardDesc")}</p>
        </div>

        <h3 className="mission-heading">{t("dailyLoginMission")}</h3>
        <div className="mission-card">
          <div className="mission-top"><b>{t("sevenDayLogin")}</b><span>{t("totalFive")}</span></div>
          <p>{t("nextDay", { day: missions?.daily_login?.next_day || 1 })}: +{missions?.daily_login?.next_reward_usdt || "0.30"} USDT {Number(missions?.daily_login?.next_reward_btc_share || 0) > 0 ? `+ ${missions.daily_login.next_reward_btc_share} BTC ${t("share")}` : ""}</p>
          <button disabled={missions?.daily_login?.claimed_today} onClick={claimDailyLogin} className="red-button mission-btn">{missions?.daily_login?.claimed_today ? t("claimedToday") : t("claimDailyLogin")}</button>
        </div>
      </div>

      <div className="premium-panel">
        <div className="panel-title premium-title"><Gift size={20} /> {t("rewardsCenter")}</div>
        <div className="reward-card amber"><b><Zap size={18} /> {t("firstDepositPack")}</b><p>{festival?.first_deposit_pack || t("notReady")}</p></div>
        <div className="reward-card blue"><b><Users size={18} /> {t("referralPartner")}</b><p>{t("invited")}: {referral?.invited_count || 0} / {t("rewards")}: {referral?.total_rewards || "0.00"} USDT</p></div>
        <button className="red-button wide-red-button" onClick={() => copy(referral?.invite_link || "")}><Copy size={16} /> {t("copyInviteLink")}</button>
        <div className="gray-box dark-gray"><span>{t("inviteLink")}</span><b className="tiny">{referral?.invite_link || "-"}</b></div>
      </div>



      <div className="premium-panel">
        <div className="panel-title premium-title"><History size={20} /> {t("walletHistory")}</div>
        {(walletHistory || []).length === 0 && <div className="notice-card dark-notice">{t("noWalletRecords")}</div>}
        {(walletHistory || []).map((x, i) => <div className="record-card dark-record" key={i}><b>{x.tx_type}</b><span>{x.amount_usdt} USDT</span><small>{x.balance_before} → {x.balance_after}</small><small>{x.remark}</small></div>)}
      </div>
    </div>
  );
}

function BetModal({ team, prizePool, onClose, placeBet, t }) {
  const [amount, setAmount] = useState("50");
  if (!team) return null;

  const cleanAmount = Math.max(0, Number(String(amount || "").replace(/[^0-9.]/g, "")) || 0);
  const isValidAmount = cleanAmount >= 10 && cleanAmount % 10 === 0;
  const ticket = Math.floor(cleanAmount / 10);
  const rate = Number(team.share_rate || 2);
  const newShare = ticket * rate;
  const currentTeamShare = Number(team.total_share || 0);
  const teamShareAfter = currentTeamShare + newShare;
  const percent = teamShareAfter > 0 ? newShare / teamShareAfter : 0;
  const basePool = Number(prizePool?.champion_base_pool || 500000);
  const livePool = Number(prizePool?.live_team_bet || prizePool?.live_team_bet_pool || prizePool?.total_pool || 0);
  const estBase = basePool * percent;
  const estLive = livePool * percent;
  const estTotal = estBase + estLive;

  const setPresetAmount = (v) => setAmount(String(v));
  const updateAmount = (v) => {
    const cleaned = String(v || "").replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    const normalized = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
    setAmount(normalized);
  };

  return (
    <div className="modal-bg bet-modal-bg" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ y: 300 }} animate={{ y: 0 }} className="modal premium-modal bet-premium-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <small>{t("championBet")}</small>
            <h2>{localTeamName(team.name, lang, team.names)}</h2>
          </div>
          <button type="button" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="amount-grid premium-amount-grid bet-amount-grid">
          {[50, 100, 300, 500].map((v) => (
            <button type="button" key={v} onClick={() => setPresetAmount(v)} className={Number(amount) === v ? "selected" : ""}>
              {v} USDT
            </button>
          ))}
        </div>

        <label className="bet-input-label">{t("amountMultiple") || "Amount, multiple of 10"}</label>
        <div className="bet-input-shell">
          <input
            className="dark-input bet-amount-input"
            type="text"
            inputMode="decimal"
            enterKeyHint="done"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            value={amount}
            onChange={(e) => updateAmount(e.target.value)}
            onInput={(e) => updateAmount(e.currentTarget.value)}
            onFocus={(e) => {
              try { e.currentTarget.select(); } catch (_) {}
              setTimeout(() => e.currentTarget.scrollIntoView({ block: "center", behavior: "smooth" }), 120);
            }}
            onClick={(e) => e.currentTarget.focus()}
            placeholder="10, 50, 100..."
          />
          <span>USDT</span>
        </div>
        {!isValidAmount && <div className="bet-input-warning">{t("amountMultiple") || "Amount must be a multiple of 10 USDT"}</div>}

        <div className="estimate-card">
          <b>{t("estimatedWin")}</b>
          <div className="estimate-big">{estTotal.toLocaleString(undefined, {maximumFractionDigits: 2})} USDT</div>
          <p>{t("share")}: {newShare.toFixed(2)} · {t("teamSharePercent")}: {(percent * 100).toFixed(2)}%</p>
          <small>{t("formula")}: {t("formulaBase")} + {t("formulaLive")} + {t("formulaBtc")}</small>
        </div>

        <div className="gray-box dark-gray">{t("ticketRule")}: {Number(team.share_rate || 2).toFixed(2)}x</div>
        <div className="modal-action-sticky bet-action-sticky">
          <button
            type="button"
            className="red-button wide-red-button"
            disabled={!isValidAmount}
            onClick={() => placeBet(team, String(cleanAmount))}
          >
            {t("confirmBet")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}










function BottomNav({ tab, setTab, t }) {
  const items = [
    ["pool", Trophy, t("pool") || "Pool"],
    ["deposit", Wallet, t("deposit") || "Deposit"],
    ["bets", Ticket, t("myBets") || "My Bets"],
    ["rewards", Gift, t("rewards") || "Rewards"],
  ];

  return (
    <nav className="bottom-nav premium-bottom-nav v6-four-bottom-nav" aria-label="Main navigation">
      {items.map(([key, Icon, label]) => (
        <button type="button" key={key} onClick={() => setTab(key)} className={tab === key ? "active" : ""} aria-label={label}>
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [tab, setTab] = useState("pool");
  const [lang, setLang] = useState(detectDefaultLang());
  const t = (key, vars = {}) => tr(lang, key, vars);
  const langDir = (LANGUAGES.find((x) => x.code === lang) || LANGUAGES[0]).dir;
  const [betTeam, setBetTeam] = useState(null);
  const [teamDetail, setTeamDetail] = useState(null);
  const [confirmBetData, setConfirmBetData] = useState(null);
  const { tgUser, initData } = useTelegramUser();
  const [me, setMe] = useState(null);
  const [teams, setTeams] = useState(fallbackTeams);
  const [prizePool, setPrizePool] = useState(null);
  const [myBets, setMyBets] = useState([]);
  const [festival, setFestival] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [withdraws, setWithdraws] = useState([]);
  const [referral, setReferral] = useState(null);
  const [walletHistory, setWalletHistory] = useState([]);
  const [btcDraw, setBtcDraw] = useState(null);
  const [missions, setMissions] = useState(null);
  const [depositMethods, setDepositMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [banners, setBanners] = useState({ announcement: "", items: [] });

  async function loadData() {
    setLoading(true);
    setApiError("");

    const tasks = [
      ["me", api("/api/me", { tgUser, initData })],
      ["teams", api("/api/teams", { tgUser, initData })],
      ["teamOdds", api("/api/team_odds", { tgUser, initData }).catch(() => ({ odds: {} }))],
      ["pool", api("/api/prize_pool", { tgUser, initData })],
      ["bets", api("/api/my_bets", { tgUser, initData })],
      ["festival", api("/api/deposit_festival", { tgUser, initData })],
      ["deposits", api("/api/deposits", { tgUser, initData })],
      ["withdraws", api("/api/withdraws", { tgUser, initData })],
      ["referral", api("/api/referral", { tgUser, initData })],
      ["ledger", api("/api/wallet_history", { tgUser, initData })],
      ["draw", api("/api/btc_draw", { tgUser, initData }).catch(() => ({ btc_draw_share: 0, total_draw_share: 0 }))],
      ["missions", api("/api/missions", { tgUser, initData })],
      ["depositMethods", api("/api/deposit/methods?amount=100", { tgUser, initData })],
      ["banners", api(`/api/banners?lang=${encodeURIComponent(lang)}`, { tgUser, initData }).catch(() => ({ announcement: "", items: [] }))],
    ];

    const results = await Promise.allSettled(tasks.map(([, promise]) => promise));
    const failed = [];
    let latestOdds = {};

    results.forEach((result, index) => {
      const name = tasks[index][0];

      if (result.status !== "fulfilled") {
        // BTC draw is optional. If this endpoint/network fails, do not block the app or show a red error.
        if (name !== "draw") {
          failed.push(`${name}: ${result.reason?.message || "failed"}`);
        }
        return;
      }

      const data = result.value;

      if (name === "me") setMe(data);
      if (name === "teamOdds") latestOdds = data.odds || {};
      if (name === "teams") {
        const serverTeams = data.teams || fallbackTeams;
        setTeams(serverTeams.map((tm) => {
          const live = latestOdds[tm.name] || tm.live_share_rate || tm.current_share_rate || tm.share_rate;
          return { ...tm, share_rate: live || tm.share_rate };
        }));
      }
      if (name === "pool") setPrizePool(data);
      if (name === "bets") setMyBets(data.bets || []);
      if (name === "festival") setFestival(data);
      if (name === "deposits") setDeposits(data.items || []);
      if (name === "withdraws") setWithdraws(data.items || []);
      if (name === "referral") setReferral(data);
      if (name === "ledger") setWalletHistory(data.items || []);
      if (name === "draw") setBtcDraw(data);
      if (name === "missions") setMissions(data);
      if (name === "depositMethods") setDepositMethods(data.methods || []);
      if (name === "banners") setBanners(data || { announcement: "", items: [] });
    });

    if (Object.keys(latestOdds || {}).length > 0) {
      setTeams((prev) => (prev || fallbackTeams).map((tm) => ({ ...tm, share_rate: latestOdds[tm.name] || tm.share_rate })));
    }

    if (failed.length > 0) {
      setApiError(`Some data failed: ${failed.join(" | ")}`);
      console.warn("SABA API partial load errors:", failed);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (tgUser?.id) loadData();
  }, [tgUser?.id, initData]);

  async function placeBet(team, amount) {
    try {
      const cleanAmount = Number(String(amount ?? "").replace(/[^\d.]/g, ""));
      if (!Number.isFinite(cleanAmount) || cleanAmount <= 0) throw new Error(t("amountUsdt") || "Invalid amount");
      const teamName = team?.name || team?.team || String(team || "");
      if (!teamName) throw new Error("Invalid team");

      const res = await api("/api/place_bet", {
        method: "POST",
        body: {
          team: teamName,
          amount: cleanAmount,
          amount_usdt: cleanAmount,
          bet_type: "champion",
        },
        tgUser,
        initData,
      });
      alert(t("betSuccess", { tickets: res.tickets, shares: res.shares }));
      setBetTeam(null);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function createDeposit(amount, method = "USDT_TRC20") {
    try {
      const res = await api("/api/deposit/create", { method: "POST", body: { amount, method }, tgUser, initData });
      await loadData();
      return res;
    } catch (err) {
      alert(err.message);
      return null;
    }
  }

  async function submitReceipt(order_no, file) {
    const image_base64 = await fileToBase64(file);
    await api("/api/deposit/receipt", {
      method: "POST",
      body: {
        order_no,
        filename: file.name,
        image_base64,
      },
      tgUser,
      initData,
    });
    await loadData();
  }

  async function cancelDeposit(order_no) {
    try {
      const res = await api("/api/deposit/cancel", { method: "POST", body: { order_no }, tgUser, initData });
      await loadData();
      return res;
    } catch (err) {
      alert(err.message);
      return null;
    }
  }

  async function claimDepositMission(milestone) {
    try {
      const res = await api("/api/mission/deposit/claim", { method: "POST", body: { milestone }, tgUser, initData });
      alert(`${t("claimBonus")}: ${res.reward_usdt} USDT\n${t("turnoverRequired")}: ${res.turnover_required} USDT`);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function claimBetMission(milestone) {
    try {
      const res = await api("/api/mission/bet/claim", { method: "POST", body: { milestone }, tgUser, initData });
      alert(`${t("claimBtcShare")}: +${res.reward_btc_share} BTC ${t("drawShare")}`);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function claimDailyLogin() {
    try {
      const res = await api("/api/daily_login/claim", { method: "POST", tgUser, initData });
      alert(`${t("dailyLoginMission")} ${res.day}: +${res.reward_usdt} USDT, +${res.reward_btc_share} BTC ${t("share")}`);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function createWithdraw(amount, address) {
    try {
      const res = await api("/api/withdraw/create", { method: "POST", body: { amount, address }, tgUser, initData });
      alert(`${t("createWithdraw")}: ${res.order_no}\n${t("youPay")}: ${res.receive} USDT`);
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className={`screen-bg premium-screen-bg lang-${lang}`} dir={langDir}>
      <div className="phone-shell premium-phone-shell">
        <AppHeader user={tgUser} />
        <LanguageSwitcher lang={lang} setLang={setLang} t={t} />
        <UserInfoCard user={tgUser} />
        <AnnouncementBanners banners={banners} t={t} />
        {tab === "pool" && <PoolPage onBet={setBetTeam} onDetail={setTeamDetail} setTab={setTab} me={me} teams={teams} prizePool={prizePool} festival={festival} loading={loading} error={apiError} t={t} lang={lang} />}
        {tab === "deposit" && <DepositPage t={t} festival={festival} deposits={deposits} withdraws={withdraws} myBets={myBets} walletHistory={walletHistory} createDeposit={createDeposit} cancelDeposit={cancelDeposit} submitReceipt={submitReceipt} btcDraw={btcDraw} depositMethods={depositMethods} tgUser={tgUser} initData={initData} lang={lang} />}
        {tab === "bets" && <MyBetsPage bets={myBets} t={t} lang={lang} />}
        {tab === "rewards" && <RewardsPage t={t} lang={lang} festival={festival} referral={referral} walletHistory={walletHistory} missions={missions} claimDepositMission={claimDepositMission} claimBetMission={claimBetMission} claimDailyLogin={claimDailyLogin} />}
        {tab === "rankings" && <RankingsPage t={t} tgUser={tgUser} initData={initData} lang={lang} />}
        {tab === "messages" && <MessagesPage t={t} lang={lang} tgUser={tgUser} initData={initData} />}
        {tab === "assets" && <AssetsPage t={t} tgUser={tgUser} initData={initData} lang={lang} deposits={deposits} withdraws={withdraws} myBets={myBets} />}
        <button type="button" className="v6-floating-ranking-button" onClick={() => setTab("rankings")}>🏆 {t("rankings") || "Rankings"}</button>
        <button type="button" className="v5-floating-assets-button" onClick={() => setTab("assets")}>💰 {t("assets") || "Assets"}</button>
        <BottomNav tab={tab} setTab={setTab} t={t} />
        <TeamDetailModal t={t} lang={lang} myBets={myBets} team={teamDetail} tgUser={tgUser} initData={initData} onClose={() => setTeamDetail(null)} onBet={(team) => setBetTeam(team)} />
        <BetModal team={betTeam} prizePool={prizePool} onClose={() => setBetTeam(null)} placeBet={(team, amount) => setConfirmBetData({ team, amount })} t={t} />
        {confirmBetData && (
          <div className="confirm-bet-bg">
            <div className="confirm-bet-card">
              <h3>{t("confirmBetTitle")}</h3>
              <p>{t("confirmBetDesc")}</p>
              <div className="confirm-line"><span>{t("team") || "Team"}</span><b>{localTeamName(confirmBetData.team?.name, lang, confirmBetData.team?.names)}</b></div>
              <div className="confirm-line"><span>{t("betAmount")}</span><b>{confirmBetData.amount} USDT</b></div>
              <div className="confirm-actions">
                <button onClick={() => setConfirmBetData(null)}>{t("cancel")}</button>
                <button className="red-button" onClick={async () => { const d = confirmBetData; setConfirmBetData(null); await placeBet(d.team, d.amount); }}>{t("confirm")}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// SABA_PLACE_BET_API_HOTFIX

// SABA_AUTH_HEADER_FINAL_FIX

// SABA_FINAL_BET_FETCH_ONE_TIME_FIX

// SABA_PUBLIC_RANKINGS_FRONTEND_ALIAS_FIX

// SABA_PUBLIC_RANKINGS_FRONTEND_V3_ROBUST_FIX
