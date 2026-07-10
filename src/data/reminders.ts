export interface VerseOrHadith {
  text: string;
  reference: string;
  translation: string;
  type: 'quran' | 'hadith';
}

export interface ReflectionPrompt {
  id: string;
  question: string;
  category: 'sincerity' | 'generosity' | 'reflection' | 'gratitude';
}

export const versesAndHadiths: VerseOrHadith[] = [
  {
    text: "مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ أَضْعَافًا كَثِيرَةً",
    reference: "Surah Al-Baqarah, 245",
    translation: "Who is it that would loan Allah a goodly loan so He may multiply it for him many times over?",
    type: 'quran'
  },
  {
    text: "إِنَّ الْمُصَّدِّقِينَ وَالْمُصَّدِّقَاتِ وَأَقْرَضُوا اللَّهَ قَرْضًا حَسَنًا يُضَاعَفُ لَهُمْ وَلَهُمْ أَجْرٌ كَرِيمٌ",
    reference: "Surah Al-Hadid, 18",
    translation: "Indeed, the men who practice charity and the women who practice charity and [they who] have loaned Allah a goodly loan—it will be multiplied for them, and they will have a noble reward.",
    type: 'quran'
  },
  {
    text: "إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ إِلاَّ مِنْ صَدَقَةٍ جَارِيَةٍ أَوْ عِلْمٍ يُنْتَفَعُ بِهِ أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",
    reference: "Sahih Muslim 1631",
    translation: "When a human being dies, his good deeds come to an end except for three: continuous charity (Sadaqah Jariyah), beneficial knowledge, or a righteous child who prays for him.",
    type: 'hadith'
  },
  {
    text: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    reference: "Jami` at-Tirmidhi 1956",
    translation: "Your smiling in the face of your brother is charity for you.",
    type: 'hadith'
  },
  {
    text: "الرَّجُلُ فِي ظِلِّ صَدَقَتِهِ حَتَّى يُقْضَى بَيْنَ النَّاسِ",
    reference: "Musnad Ahmad 16882",
    translation: "The believer’s shade on the Day of Resurrection will be their charity.",
    type: 'hadith'
  },
  {
    text: "اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ",
    reference: "Sahih al-Bukhari 1417",
    translation: "Protect yourselves from the Fire, even if with half a date in charity.",
    type: 'hadith'
  }
];

export const reflectionPrompts: ReflectionPrompt[] = [
  {
    id: '1',
    question: "What is one small kindness you can hide from the world today, keeping it solely between you and your Creator?",
    category: 'sincerity'
  },
  {
    id: '2',
    question: "Think of someone who has tested your patience recently. Can you offer a silent prayer of ease for them today?",
    category: 'reflection'
  },
  {
    id: '3',
    question: "What is a blessing you enjoyed today that you often take for granted? How can you express gratitude for it?",
    category: 'gratitude'
  },
  {
    id: '4',
    question: "Sadaqah is not just wealth. Whose day can you make lighter today with a sincere smile, a kind word, or a helping hand?",
    category: 'generosity'
  }
];

export const corePhilosophy = {
  quote: "The acts of charity most beloved to Allah are those that are consistent, even if they are small.",
  quoteRef: "Prophet Muhammad (ﷺ), Sahih al-Bukhari",
  pillars: [
    {
      title: "Silent Devotion",
      description: "Cultivate an interior life. Mizan is designed to be a private ledger of your small daily acts of charity. No social sharing buttons, no public feeds. Just a quiet, personal space for sincerity."
    },
    {
      title: "Consistent Drops",
      description: "A single drop of water, over years, hollows out stone. Generosity is a muscle. By giving even a single cent, a smile, or a moment of help daily, you reshape your heart and build a lasting habit."
    },
    {
      title: "Sacred Rythms",
      description: "Integrate giving into your daily acts of worship. Receive gentle prompts during blessed hours—at Fajr before the world wakes, on Jumu'ah afternoons, or during the special days of the Islamic calendar."
    }
  ]
};
