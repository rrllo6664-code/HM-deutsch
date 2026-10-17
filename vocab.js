/*
 * بيانات التطبيق: الدروس والكلمات وعامية الشارع الألماني.
 * أضف دروسًا جديدة بنفس البنية. يجب أن يكون id لكل كلمة فريدًا لأن التقدم يُحفظ بناءً عليه.
 */
window.HM_DATA = {
  lessons: [
    {
      id: "greetings",
      title: "التحية والتعارف",
      icon: "👋",
      level: "A1",
      words: [
        { id: "hallo", de: "Hallo", ar: "مرحبًا", emoji: "👋", example: "Hallo, ich heiße Lina.", exampleAr: "مرحبًا، اسمي لينا." },
        { id: "tschuess", de: "Tschüss", ar: "مع السلامة", emoji: "🙋", example: "Tschüss, bis morgen!", exampleAr: "مع السلامة، إلى الغد!" },
        { id: "danke", de: "Danke", ar: "شكرًا", emoji: "🙏", example: "Danke für dein Buch.", exampleAr: "شكرًا على كتابك." },
        { id: "bitte", de: "Bitte", ar: "من فضلك / عفوًا", emoji: "🥛", example: "Ein Wasser, bitte.", exampleAr: "كوب ماء من فضلك." },
        { id: "ja", de: "Ja", ar: "نعم", emoji: "✅", example: "Ja, das ist gut.", exampleAr: "نعم، هذا جيد." },
        { id: "nein", de: "Nein", ar: "لا", emoji: "❌", example: "Nein, danke.", exampleAr: "لا، شكرًا." }
      ]
    },
    {
      id: "things",
      title: "الحيوانات والأشياء",
      icon: "🐶",
      level: "A1",
      words: [
        { id: "hund", de: "der Hund", ar: "الكلب", emoji: "🐶", example: "Der Hund spielt im Park.", exampleAr: "الكلب يلعب في الحديقة." },
        { id: "katze", de: "die Katze", ar: "القطة", emoji: "🐱", example: "Die Katze schläft.", exampleAr: "القطة نائمة." },
        { id: "haus", de: "das Haus", ar: "البيت", emoji: "🏠", example: "Das Haus ist groß.", exampleAr: "البيت كبير." },
        { id: "ball", de: "der Ball", ar: "الكرة", emoji: "⚽", example: "Ich habe einen Ball.", exampleAr: "عندي كرة." },
        { id: "buch", de: "das Buch", ar: "الكتاب", emoji: "📖", example: "Das Buch ist interessant.", exampleAr: "الكتاب مشوّق." },
        { id: "baum", de: "der Baum", ar: "الشجرة", emoji: "🌳", example: "Der Baum ist hoch.", exampleAr: "الشجرة عالية." },
        { id: "sonne", de: "die Sonne", ar: "الشمس", emoji: "☀️", example: "Die Sonne scheint.", exampleAr: "الشمس مشرقة." },
        { id: "apfel", de: "der Apfel", ar: "التفاحة", emoji: "🍎", example: "Der Apfel ist rot.", exampleAr: "التفاحة حمراء." }
      ]
    },
    {
      id: "numbers",
      title: "الأرقام من 1 إلى 5",
      icon: "🔢",
      level: "A1",
      words: [
        { id: "eins", de: "eins", ar: "واحد", emoji: "1️⃣", example: "Eins, zwei, drei, los!", exampleAr: "واحد، اثنان، ثلاثة، هيا!" },
        { id: "zwei", de: "zwei", ar: "اثنان", emoji: "2️⃣", example: "Ich habe zwei Katzen.", exampleAr: "عندي قطتان." },
        { id: "drei", de: "drei", ar: "ثلاثة", emoji: "3️⃣", example: "Drei Bücher, bitte.", exampleAr: "ثلاثة كتب من فضلك." },
        { id: "vier", de: "vier", ar: "أربعة", emoji: "4️⃣", example: "Es ist vier Uhr.", exampleAr: "الساعة الرابعة." },
        { id: "fuenf", de: "fünf", ar: "خمسة", emoji: "5️⃣", example: "Ich bin fünf Jahre alt.", exampleAr: "عمري خمس سنوات." }
      ]
    }
  ],

  /* عامية الشارع الألماني: كلمات غير رسمية يستخدمها الشباب في ألمانيا */
  slang: [
    { term: "Digga", meaning: "يا أخي / يا صاحبي (مناداة ودية)", tone: "شبابي", example: "Digga, was geht?", exampleAr: "يا أخي، شو الأخبار؟", note: "تُستخدم بين الأصدقاء فقط، ولا تُقال لكبار السن أو في العمل." },
    { term: "Alter!", meaning: "يا رجل! (تعجب أو مناداة)", tone: "شبابي", example: "Alter, das glaube ich nicht!", exampleAr: "يا رجل، لا أصدق ذلك!", note: "معناها يتغير حسب النبرة، فقد تكون تعجبًا أو مناداة." },
    { term: "geil", meaning: "رائع / ممتاز", tone: "شبابي", example: "Das Konzert war geil!", exampleAr: "كانت الحفلة رائعة!", note: "شائعة جدًا، لكنها غير مناسبة للكتابة الرسمية." },
    { term: "krass", meaning: "مذهل / قوي / غريب (حسب السياق)", tone: "عام", example: "Das ist echt krass!", exampleAr: "هذا فعلًا مذهل!", note: "تأتي بمعنى إعجاب أو صدمة حسب النبرة." },
    { term: "mega", meaning: "هائل / جدًا", tone: "عام", example: "Ich bin mega müde.", exampleAr: "أنا متعب جدًا.", note: "" },
    { term: "voll", meaning: "جدًا (للتأكيد)", tone: "عام", example: "Das ist voll gut.", exampleAr: "هذا جيد جدًا.", note: "تُضاف قبل الصفة لتقويتها." },
    { term: "Ey", meaning: "يا! / هيه! (لفت الانتباه)", tone: "شبابي", example: "Ey, warte mal!", exampleAr: "هيه، انتظر لحظة!", note: "" },
    { term: "Hä?", meaning: "شو؟ ما فهمت", tone: "عام", example: "Hä? Was hast du gesagt?", exampleAr: "شو؟ ماذا قلت؟", note: "" },
    { term: "Was geht?", meaning: "شو الأخبار؟ / كيفك؟", tone: "شبابي", example: "Was geht, Digga?", exampleAr: "شو الأخبار يا أخي؟", note: "تحية شائعة بين الشباب." },
    { term: "Läuft bei dir?", meaning: "كيف الأمور معك؟", tone: "عام", example: "Läuft bei dir alles?", exampleAr: "كل شيء تمام معك؟", note: "" },
    { term: "Ich hab keinen Bock.", meaning: "ما عندي رغبة / ما بدي", tone: "شبابي", example: "Ich hab keinen Bock auf Schule.", exampleAr: "ما عندي رغبة بالمدرسة.", note: "Bock haben = أن يكون لديك رغبة بالشيء." },
    { term: "Ich bin pleite.", meaning: "أنا مفلس / ليس معي مال", tone: "عام", example: "Heute bin ich pleite.", exampleAr: "ليس معي مال اليوم.", note: "" },
    { term: "Ich check das nicht.", meaning: "لم أفهم الموضوع", tone: "شبابي", example: "Ich check das nicht, erklär mal.", exampleAr: "لم أفهم ذلك، اشرحه لي.", note: "" },
    { term: "Schon klar.", meaning: "طبعًا / مفهوم", tone: "عام", example: "Schon klar, ich komme gleich.", exampleAr: "طبعًا، آتي حالًا.", note: "" },
    { term: "Mach keinen Stress.", meaning: "لا تقلق / لا تتوتر", tone: "عام", example: "Mach keinen Stress, alles gut.", exampleAr: "لا تقلق، كل شيء على ما يرام.", note: "" },
    { term: "Chill mal.", meaning: "اهدأ / خذ راحتك", tone: "شبابي", example: "Chill mal, Alter!", exampleAr: "اهدأ يا رجل!", note: "" },
    { term: "Lass gut sein.", meaning: "خلاص، لا عليك", tone: "عام", example: "Lass gut sein, war nicht so wichtig.", exampleAr: "لا عليك، لم يكن مهمًا.", note: "" },
    { term: "Nö.", meaning: "لا (غير رسمي)", tone: "شبابي", example: "Nö, keine Lust.", exampleAr: "لا، لا أرغب.", note: "الشكل الرسمي هو Nein." },
    { term: "Ne?", meaning: "صحيح؟ أليس كذلك؟", tone: "شبابي", example: "Das war gut, ne?", exampleAr: "كان جيدًا، صحيح؟", note: "اختصار لـ nicht wahr." },
    { term: "Ich bin dabei!", meaning: "أنا معك / أنا موافق", tone: "شبابي", example: "Party heute? Ich bin dabei!", exampleAr: "حفلة اليوم؟ أنا معك!", note: "" }
  ],

  /* لهجة برلين (Berlinerisch): تُكتب بطريقة مختلفة عن الألمانية الفصحى */
  berlinerisch: [
    { term: "ick", standard: "ich", meaning: "أنا", example: "Ick bin müde.", exampleAr: "أنا متعب." },
    { term: "dit", standard: "das", meaning: "هذا / ذاك", example: "Dit is jut.", exampleAr: "هذا جيد." },
    { term: "wat", standard: "was", meaning: "شو / ماذا", example: "Wat is los?", exampleAr: "ماذا يحدث؟" },
    { term: "ick weeß nich", standard: "ich weiß nicht", meaning: "لا أعرف", example: "Ick weeß nich, echt.", exampleAr: "لا أعرف، فعلًا." },
    { term: "keene Ahnung", standard: "keine Ahnung", meaning: "ما عندي فكرة", example: "Keene Ahnung, Digga.", exampleAr: "ما عندي فكرة يا أخي." },
    { term: "jut", standard: "gut", meaning: "جيد / تمام", example: "Jut, bis später!", exampleAr: "تمام، إلى اللقاء لاحقًا!" },
    { term: "nu", standard: "nun", meaning: "الآن / هيا", example: "Nu komm!", exampleAr: "هيا الآن!" }
  ]
};
