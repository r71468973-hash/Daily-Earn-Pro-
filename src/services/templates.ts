import { CaptionItem, Language } from '../types';

interface TemplateDef {
  category: string;
  en: {
    hook: string;
    body: (topic: string) => string;
    cta: string;
    hashtags: string[];
  }[];
  hi: {
    hook: string;
    body: (topic: string) => string;
    cta: string;
    hashtags: string[];
  }[];
}

export const CAPTION_TEMPLATES: Record<string, TemplateDef> = {
  motivation: {
    category: 'motivation',
    en: [
      {
        hook: '🚀 Success starts with the decision to try.',
        body: (topic) => `When you focus on ${topic}, remember that every small effort compounds over time. Consistency beats intensity every single day. Don't wait for the perfect moment—start where you are with what you have.`,
        cta: '💬 Drop a "100" if you are committed to your growth today!',
        hashtags: ['#DailyMotivation', '#GrowthMindset', '#SuccessHabits', '#NeverGiveUp', '#Focus', '#Discipline', '#MindsetMatters'],
      },
      {
        hook: '⚡ Stop doubting yourself and take massive action.',
        body: (topic) => `The only thing standing between you and mastery in ${topic} is consistent repetition. The winners in life aren't the ones with zero doubts; they are the ones who show up even when doubts whisper.`,
        cta: '🔥 Double tap if you needed this reminder today!',
        hashtags: ['#MotivationQuotes', '#ActionTakers', '#SelfBelief', '#HustleHard', '#DailyInspiration', '#RiseAndShine'],
      },
      {
        hook: '💡 Your future is created by what you do today, not tomorrow.',
        body: (topic) => `Mastering ${topic} is not an overnight sprint, it's a marathon. Celebrate your micro-wins, stay humble, and keep building your skills with pride.`,
        cta: '👉 Save this post to read when you feel like quitting.',
        hashtags: ['#FutureSelf', '#Consistency', '#GoalGetter', '#MindsetDaily', '#ProductivityHacks'],
      },
    ],
    hi: [
      {
        hook: '🔥 सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।',
        body: (topic) => `जब आप ${topic} पर काम करते हैं, तो याद रखें कि हर दिन की गई छोटी-सी मेहनत ही आगे चलकर बड़ी कामयाबी बनती है। रुकावटें तो आएंगी, लेकिन आपको अपनी रफ्तार धीमी नहीं करनी है।`,
        cta: '💬 अगर आप अपने लक्ष्य के प्रति समर्पित हैं, तो कमेंट में "YES" लिखें!',
        hashtags: ['#मोटिवेशन', '#सफलता', '#सुविचार', '#मेहनत', '#लक्ष्य', '#DailyMotivationHindi', '#HindiQuotes'],
      },
      {
        hook: '⚡ खुद पर विश्वास रखो, दुनिया का हर रास्ता तुम्हारे लिए खुल जाएगा!',
        body: (topic) => `${topic} के सफर में कभी हार मत मानो। जब तक आप कोशिश करना नहीं छोड़ते, तब तक कोई भी आपको हरा नहीं सकता। अपने हुनर को निखारें और आगे बढ़ें।`,
        cta: '❤️ इस पोस्ट को लाइक करें और अपने दोस्तों के साथ शेयर करें!',
        hashtags: ['#सकारात्मक_सोच', '#आत्मविश्वास', '#संघर्ष', '#प्रेरणादायक', '#HindiMotivation'],
      },
      {
        hook: '🌟 शुरुआत हमेशा मुश्किल लगती है, लेकिन नतीजा हमेशा खूबसूरत होता है।',
        body: (topic) => `${topic} में महारत हासिल करने के लिए रोजाना अभ्यास जरूरी है। आज किया गया एक छोटा कदम कल आपकी सबसे बड़ी ताकत बनेगा।`,
        cta: '👉 इस पोस्ट को सेव कर लें ताकि जब भी हौसला टूटे, यह आपको याद दिलाए।',
        hashtags: ['#मेहनत_रंग_लाएगी', '#विश्वास', '#जिंदगी_की_सीख', '#हिम्मत', '#सफलता_की_राह'],
      },
    ],
  },
  business: {
    category: 'business',
    en: [
      {
        hook: '🎉 Big Announcement! Quality meets affordability right here.',
        body: (topic) => `Looking for premium quality in ${topic}? We are here to deliver exceptional value that exceeds your expectations. Check out our exclusive collection with unmatched durability and trusted service.`,
        cta: '📲 Send us a DM or WhatsApp message to claim your exclusive discount today!',
        hashtags: ['#SmallBusiness', '#SpecialOffer', '#CustomerFirst', '#QualityMatters', '#ShopLocal', '#DiscountsAndDeals'],
      },
      {
        hook: '✨ Upgrade your experience with our latest offerings.',
        body: (topic) => `We know how important ${topic} is for you. That is why our team worked tirelessly to bring you the best options at competitive prices. Trusted by hundreds of happy clients!`,
        cta: '🛒 Tap the link in bio to explore our latest catalog.',
        hashtags: ['#BusinessGrowth', '#NewArrivals', '#CustomerDelight', '#ValueForMoney', '#LocalBusinessPride'],
      },
      {
        hook: '⏳ Limited Time Deal: Don’t miss out on this!',
        body: (topic) => `Get the best value on ${topic} this week only. Limited stock available. Perfect for personal use and gifting!`,
        cta: '📞 Call us or visit our store today before stock runs out!',
        hashtags: ['#LimitedTimeOffer', '#SaleAlert', '#ExclusiveDeal', '#GrabItNow', '#ShopSmart'],
      },
    ],
    hi: [
      {
        hook: '🎉 धमाकेदार ऑफर! बेहतरीन क्वालिटी, सबसे किफायती दामों में।',
        body: (topic) => `क्या आप ${topic} के लिए सबसे भरोसेमंद जगह ढूंढ रहे हैं? हम आपके लिए लेकर आए हैं प्रीमियम क्वालिटी और खास डिस्काउंट। हमारे सभी प्रोडक्ट्स पर ग्राहकों का 100% भरोसा है।`,
        cta: '📲 अभी व्हाट्सएप या कॉल करके अपना ऑफर बुक करें! लिमिटेड स्टॉक।',
        hashtags: ['#स्पेशल_ऑफर', '#दुकान_का_ऑफर', '#लोकल_मार्केट', '#छूट', '#कस्टमर_फर्स्ट', '#BusinessHindi'],
      },
      {
        hook: '✨ आपकी पसंद और आपकी सुविधा, हमारी पहली प्राथमिकता!',
        body: (topic) => `${topic} की विस्तृत रेंज अब उपलब्ध है। चाहे नया स्टॉक हो या खास डिस्काउंट, हम आपको देते हैं सबसे सही दाम और सबसे शानदार सेवा।`,
        cta: '📍 आज ही हमारी दुकान पर आएं या अधिक जानकारी के लिए DM करें!',
        hashtags: ['#नया_स्टॉक', '#विश्वसनीय_दुकान', '#ग्राहकों_की_पसंद', '#ऑफर', '#शॉपिंग'],
      },
      {
        hook: '💥 सिर्फ इस हफ्ते के लिए: सीमित समय डिस्काउंट!',
        body: (topic) => `${topic} पर पाएं आकर्षक छूट। ऐसा मौका बार-बार नहीं मिलता। अभी ऑर्डर करें और बचत का फायदा उठाएं।`,
        cta: '📞 अभी कॉल करें और अपना ऑर्डर कन्फर्म करें!',
        hashtags: ['#बंपर_छूट', '#लिमिटेड_ऑफर', '#किफायती_दाम', '#दुकान', '#खुशहाल_ग्राहक'],
      },
    ],
  },
  freelance: {
    category: 'freelance',
    en: [
      {
        hook: '🎨 Need eye-catching designs that actually convert?',
        body: (topic) => `Your brand deserves visuals that stop the scroll. I specialize in ${topic}, creating high-converting social media posters, YouTube thumbnails, and marketing creatives that attract real customers. Fast turnaround and 100% satisfaction guaranteed.`,
        cta: '📩 Send me a DM with "PROJECT" for a free consultation and portfolio preview!',
        hashtags: ['#GraphicDesigner', '#ThumbnailDesigner', '#FreelanceCreator', '#VisualIdentity', '#CreativeServices', '#SocialMediaDesign'],
      },
      {
        hook: '📈 Good design is good business.',
        body: (topic) => `Are your social posts not getting views or clicks? 90% of the audience judges credibility by visual presentation. Let's revamp your ${topic} with clean, modern, and engaging graphic assets.`,
        cta: '💬 Message me today to discuss monthly design retainer packages.',
        hashtags: ['#FreelanceLife', '#DesignMatters', '#SocialMediaBranding', '#CreativeStudio', '#ClientSuccess'],
      },
    ],
    hi: [
      {
        hook: '🎨 क्या आपकी दुकान या यूट्यूब चैनल के लिए आकर्षक पोस्टर और थंबनेल चाहिए?',
        body: (topic) => `सोशल मीडिया पर वही बिकता है जो सबसे अलग दिखता है। मैं ${topic} के लिए हाई-क्वालिटी पोस्टर, थंबनेल और बैनर तैयार करता हूँ जिससे आपके बिजनेस को ज्यादा ग्राहक और व्यूज मिलें। समय पर काम और पूरी ईमानदारी की गारंटी।`,
        cta: '📩 अपना प्रोजेक्ट शुरू करने के लिए मुझे तुरंत DM या व्हाट्सएप करें!',
        hashtags: ['#ग्राफिक_डिजाइनर', '#फ्रीलांसर', '#पोस्टर_डिजाइन', '#थंबनेल_मेकर', '#क्रिएटिव_वर्क', '#FreelanceHindi'],
      },
      {
        hook: '💼 अपने बिजनेस को सोशल मीडिया पर दें एक नया और प्रोफेशनल लुक!',
        body: (topic) => `अगर आप अपनी दुकान, कोचिंग या यूट्यूब चैनल के लिए ${topic} पर बेहतरीन डिजाइन चाहते हैं, तो मैं आपकी मदद कर सकता हूँ। बेहद किफायती चार्ज में प्रीमियम काम।`,
        cta: '📲 डेमो देखने के लिए मुझे अभी संपर्क करें!',
        hashtags: ['#डिजिटल_बिजनेस', '#सोशल_मीडिया_मार्केटिंग', '#ब्रांडिंग', '#फ्रीलांसिंग'],
      },
    ],
  },
  festival: {
    category: 'festival',
    en: [
      {
        hook: '✨ Wishing you joy, prosperity, and endless blessings!',
        body: (topic) => `May this festive occasion of ${topic} bring warmth to your home, success to your work, and laughter to your loved ones. Celebrate together with hope and gratitude.`,
        cta: '🙏 Tag someone special and share the festive warmth!',
        hashtags: ['#FestivalVibes', '#Celebration', '#FestiveSeason', '#Blessings', '#JoyAndPeace', '#Tradition'],
      },
      {
        hook: '🪔 Light, love, and happiness to you and your family.',
        body: (topic) => `Sending heartfelt greetings on the auspicious occasion of ${topic}. May all your endeavors prosper and your days be filled with harmony.`,
        cta: '🌟 Wishing you a joyous celebration from all of us!',
        hashtags: ['#FestiveGreetings', '#Celebrations', '#GoodVibesOnly', '#HappyFestivals'],
      },
    ],
    hi: [
      {
        hook: '✨ आप सभी को इस पावन पर्व की हार्दिक शुभकामनाएं!',
        body: (topic) => `${topic} के शुभ अवसर पर आपके जीवन में सुख, शांति, समृद्धि और अपार खुशियाँ आएं। आपका हर दिन मंगलमय हो और आपके परिवार पर ईश्वर की कृपा सदैव बनी रहे।`,
        cta: '🙏 अपने प्रियजनों के साथ यह शुभकामना संदेश शेयर करें!',
        hashtags: ['#शुभकामनाएं', '#त्योहार', '#पवित्र_पर्व', '#मंगलमय', '#खुशियां', '#FestivalHindi'],
      },
      {
        hook: '🌸 दीपों और खुशियों का उजाला आपके जीवन में सदैव रहे।',
        body: (topic) => `${topic} के पावन पर्व पर हमारे पूरे परिवार/टीम की ओर से आपको और आपके परिजनों को ढेरों मंगलकामनाएं।`,
        cta: '❤️ कमेंट में "जय श्री राम" या शुभकामना संदेश लिखकर आशीर्वाद दें!',
        hashtags: ['#त्योहार_की_बधाई', '#शुभ_पर्व', '#उमंग_और_उत्साह', '#संस्कृति', '#बधाई_संदेश'],
      },
    ],
  },
  youtube: {
    category: 'youtube',
    en: [
      {
        hook: '🔴 NEW VIDEO IS LIVE! (Watch till the end)',
        body: (topic) => `We just dropped a complete masterclass on ${topic}. If you've been struggling to get real results, this breakdown will change how you look at the entire process. No fluff, only actionable value!`,
        cta: '▶️ Click the link in bio to watch full video on YouTube right now!',
        hashtags: ['#NewVideoAlert', '#YouTubeCreator', '#LearnAndEarn', '#Tutorial', '#VideoMarketing', '#WatchNow'],
      },
      {
        hook: '😱 You won\'t believe this result! (Complete breakdown)',
        body: (topic) => `Here is the step-by-step strategy for ${topic} that most people keep secret. We covered practical examples, mistakes to avoid, and exact resources to use.`,
        cta: '🔔 Subscribe and turn on notifications so you never miss an update!',
        hashtags: ['#MustWatch', '#YouTubeTips', '#HowToGuide', '#ViralVideo', '#CreatorEconomy'],
      },
    ],
    hi: [
      {
        hook: '🔴 नया वीडियो आ गया है! (पूरा जरूर देखें)',
        body: (topic) => `${topic} पर हमारा सबसे नया और डिटेल वीडियो यूट्यूब चैनल पर अपलोड हो चुका है। इसमें हमने स्टेप-बाय-स्टेप सब कुछ बहुत ही आसान भाषा में समझाया है। अगर आप सच में सीखना चाहते हैं तो यह वीडियो मिस मत करना!`,
        cta: '▶️ बायो में दिए गए लिंक पर क्लिक करके अभी वीडियो देखें!',
        hashtags: ['#यूट्यूब_वीडियो', '#नया_वीडियो', '#हिंदी_ट्यूटोरियल', '#सीखें_और_कमाएं', '#यूट्यूब_क्रिएटर'],
      },
      {
        hook: '🔥 यह तरीका 100% काम करता है! लाइव प्रूफ के साथ।',
        body: (topic) => `अगर आप ${topic} को लेकर परेशान थे, तो आज का वीडियो आपके सारे डाउट्स क्लियर कर देगा। कमेंट करके बताएं आपको कौन सा पार्ट सबसे अच्छा लगा।`,
        cta: '🔔 चैनल को सब्सक्राइब करना न भूलें और घंटी वाला बटन जरूर दबाएं!',
        hashtags: ['#यूट्यूब_हिंदी', '#टिप्स_और_ट्रिक्स', '#वायरल_वीडियो', '#ज्ञान'],
      },
    ],
  },
  tech: {
    category: 'tech',
    en: [
      {
        hook: '💡 3 Game-Changing Digital Hacks You Need Today',
        body: (topic) => `Technology evolves fast, especially around ${topic}. Using the right tools saves you hours of tedious work and lets you deliver 10x output. Here is how you can implement this in your daily workflow.`,
        cta: '📌 Bookmark this post and share it with someone in tech!',
        hashtags: ['#TechTips', '#DigitalTools', '#ProductivityHacks', '#SmartWork', '#TechTrends', '#FutureOfWork'],
      },
    ],
    hi: [
      {
        hook: '⚡ टेक्नोलॉजी का यह नया तरीका आपका घंटों का समय बचाएगा!',
        body: (topic) => `${topic} में आज के समय स्मार्ट वर्क ही सबसे जरूरी है। सही टूल्स और मोबाइल ऐप्स की मदद से आप कम समय में दोगुना काम कर सकते हैं। इसे अपनी दिनचर्या में जरूर अपनाएं।`,
        cta: '📌 इस पोस्ट को सेव करें और अपने साथी दोस्तों को भेजें!',
        hashtags: ['#टेक्नोलॉजी', '#डिजिटल_भारत', '#स्मार्ट_वर्क', '#मोबाइल_टिप्स', '#टेक_ज्ञान'],
      },
    ],
  },
};

export function getLocalCaptions(topic: string, category: string, lang: Language): CaptionItem[] {
  const safeCat = CAPTION_TEMPLATES[category] ? category : 'motivation';
  const def = CAPTION_TEMPLATES[safeCat];
  const list = def[lang] || def.en;

  const cleanTopic = topic.trim() || (lang === 'hi' ? 'सफलता और काम' : 'Success and Work');

  return list.map((item, index) => {
    const fullCaption = `${item.hook}\n\n${item.body(cleanTopic)}\n\n${item.cta}`;
    return {
      id: `caption_${safeCat}_${lang}_${index}_${Date.now()}`,
      category: safeCat,
      topic: cleanTopic,
      title: item.hook.slice(0, 32) + '...',
      caption: fullCaption,
      hashtags: item.hashtags,
      language: lang,
      source: 'template',
    };
  });
}
