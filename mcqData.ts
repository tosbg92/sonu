
import { Question } from './types';

interface BlockData {
  title: string;
  questions?: Question[];
  sets?: { title: string; questions: Question[]; }[];
}

export const EMPLOYABILITY_SKILLS_DATA: BlockData[] = [
  {
    title: "1. Introduction to Employability Skills",
    questions: [
        { id: "es-b1-q1", text: "1. Which of the options is not an Employability Skill? / इनमें से कौन सा विकल्प रोजगार योग्यता कौशल नहीं है?", options: ["Good runner / अच्छा धावक", "Good interview skill / अच्छा साक्षात्कार कौशल", "Good communication skills / अच्छा संचार कौशल", "Quick learning / जल्द सीखना"], correctAnswerIndex: 0 },
        { id: "es-b1-q2", text: "2. An employee is someone who ______. / कर्मचारी वह होता है जो ______ होता है।", options: ["Goes to school to study / स्कूल में पढ़ने जाता है", "Does not work / काम नहीं करता है", "Works for a salary / वेतन के लिए काम करता है", "Goes to play / खेलने जाता है"], correctAnswerIndex: 2 },
        { id: "es-b1-q3", text: "3. Which are the two skills needed for good career growth? / अच्छे करियर ग्रोथ के लिए कौन से दो कौशल आवश्यक हैं?", options: ["Singing / गायन", "Dancing / नृत्य", "Gardening / बागवानी", "Technical Skills & Employability Skills / तकनीकी कौशल और रोजगार कौशल"], correctAnswerIndex: 3 },
        { id: "es-b1-q4", text: "4. Gopi is always willing to learn and improve in his work. He has _____. / गोपी अपने काम में सीखने और सुधार करने के लिए हमेशा इच्छुक रहते हैं। उसके पास _____.", options: ["Love / प्यार", "Certificates / प्रमाण पत्र", "Growth mindset / विकास की मानसिकता", "Markscard / मार्क्सकार्ड"], correctAnswerIndex: 2 },
        { id: "es-b1-q5", text: "5. The meaning of Employability Skills are _____. / रोजगार योग्यता कौशल का अर्थ ______ है।", options: ["Skills to get a job / नौकरी पाने के लिए कौशल", "Skills to be a good employee / एक अच्छा कर्मचारी बनने के गुण", "Skills for good communication / अच्छे संचार के लिए कौशल", "All of the above / ऊपर के सभी"], correctAnswerIndex: 3 },
        { id: "es-b1-q6", text: "6. When we learn something online, it is called ______. / जब हम ऑनलाइन कुछ सीखते हैं तो उसे ______ कहते हैं।", options: ["Unlearning / अनसीखना", "Teaching / शिक्षण", "E-learning / ई-सीखना", "Marketing / विपनन"], correctAnswerIndex: 2 },
        { id: "es-b1-q7", text: "7. The benefits of learning online are ______. / ऑनलाइन सीखने के फायदे _____ हैं।", options: ["We can learn any time and from anywhere / हम कभी भी और कहीं से भी सीख सकते हैं", "Become friends with our classmates / हमारे सहपाठियों के दोस्त बनें", "Go home fast / जल्दी घर जाओ", "See the library / पुस्तकालय देखें"], correctAnswerIndex: 0 },
        { id: "es-b1-q8", text: "8. Which of these is an employability skills portal? / इनमें से कौन सा एक रोजगार कौशल पोर्टल है?", options: ["Facebook", "Bharat skills", "Netflix", "Hotstar"], correctAnswerIndex: 1 },
        { id: "es-b1-q9", text: "9. Ram works as a fitter in a company. He wants to upgrade his trade skills and employability skills in his free time. What should he do? / राम एक कंपनी में फिटर का काम करता है। वह अपने खाली समय में अपने व्यापार कौशल और रोजगार कौशल को अपग्रेड करना चाहता है। वह क्या करे?", options: ["Play sports / खेल-कूद खेलना", "Watch news / समाचार देखें", "Find courses: online or offline / पाठ्यक्रम खोजें: ऑनलाइन या ऑफलाइन", "Quit job / नौकरी छोड़ें"], correctAnswerIndex: 2 },
        { id: "es-b1-q10", text: "10. Zeena wants to enroll for e-learning course. The most important thing she needs are ___. / ज़ीना ई-लर्निंग कोर्स में दाखिला लेना चाहती है। उसे सबसे महत्वपूर्ण चीज़ की आवश्यकता है ___.", options: ["Books / किताबें", "Paper & Pen / कागज और कलम", "Mobile phone or Computer / मोबाइल फोन या कंप्यूटर", "New clothes / नए कपड़े"], correctAnswerIndex: 2 },
        { id: "es-b1-q11", text: "11. In today’s times, _________ skills has become a basic skill requirement in many jobs. / आज के समय में, कई नौकरियों में _________ कौशल एक बुनियादी कौशल आवश्यकता बन गई है।", options: ["Acting / अभिनय", "Digital / डिजिटल", "Painting / चित्रकारी", "Dancing / नृत्य"], correctAnswerIndex: 1 },
        { id: "es-b1-q12", text: "12. “______ jobs help to reduce pollution, preserve the environment and the planet.” / \"______ नौकरियाँ प्रदूषण को कम करने, पर्यावरण और ग्रह को संरक्षित करने में मदद करती हैं।\"", options: ["Software / सॉफ्टवेयर", "Hardware / हार्डवेयर", "Green / ग्रीन", "Carpenter / बढ़ई"], correctAnswerIndex: 2 },
        { id: "es-b1-q13", text: "13. Jobs are important because _____. / नौकरियाँ महत्वपूर्ण हैं क्योंकि ____।", options: ["They help protect the environment / वे पर्यावरण की रक्षा में मदद करते हैं", "They make more pollution / वे अधिक प्रदूषण करते हैं", "It is easy to do / यह करना आसान है", "It is for city employees / यह शहर के कर्मचारियों के लिए है"], correctAnswerIndex: 0 },
        { id: "es-b1-q14", text: "14. Geetha has just completed her education. She joined a basic English course to improve her ____ skills. / गीता ने अभी-अभी अपनी शिक्षा पूरी की है। वह अपने ______ कौशल को सुधारने के लिए एक बुनियादी अंग्रेजी पाठ्यक्रम में शामिल हुई।", options: ["Dancing / नृत्य", "Fighting / लड़ाई करना", "Communication / संचार", "None / कोई नहीं"], correctAnswerIndex: 2 },
        { id: "es-b1-q15", text: "15. Ram is planning to start his own business. Which option would you suggest? / राम अपना खुद का व्यवसाय शुरू करने की योजना बना रहा है। आप कौन सा विकल्प सुझाएंगे?", options: ["Online retail / ऑनलाइन खुदरा", "Audio cassette shop / ऑडियो कैसेट की दुकान", "Film video rental / फिल्म видео रेंटल", "Xerox shop / ज़ेरॉक्स की दुकान"], correctAnswerIndex: 0 }
    ]
  },
  {
    title: "2. Constitutional values - Citizenship",
    questions: [
        { id: "es-b2-q16", text: "16. Values and ethics help us to build good _____. / मूल्य और नैतिकता हमें अच्छा _____ बनाने में मदद करती है।", options: ["Games / खेल", "Behavior / व्यवहार", "Studies / अध्ययन करते हैं", "Rent / किराया"], correctAnswerIndex: 1 },
        { id: "es-b2-q17", text: "17. Values decide the ______ of a person. / मूल्य किसी व्यक्ति का ______ तय करते हैं।", options: ["Character / चरित्र", "Laptop / लैपटॉप", "Home / घर", "System / प्रणाली"], correctAnswerIndex: 0 },
        { id: "es-b2-q18", text: "18. It is not good to forward ______ on social media. / सोशल मीडिया पर ______ फॉरवर्ड करना अच्छा नहीं है।", options: ["Fake news / फेक न्यूज", "Messages / संदेशों", "Greetings / अभिवादन", "Songs / गीत"], correctAnswerIndex: 0 },
        { id: "es-b2-q19", text: "19. A person who respects and follows the law of a country is a _______. / जो व्यक्ति किसी देश के कानून का सम्मान करता है और उसका पालन करता है वह _______ होता है।", options: ["Businessperson / व्यापारिक व्यक्ति", "Bad Employee / बुरा कर्मचारी", "Responsible Citizen / जिम्मेदार नागरिक", "Small Kid / छोटा बच्चा"], correctAnswerIndex: 2 },
        { id: "es-b2-q20", text: "20. Rita found someone’s purse in the office. She gives it to the office manager. This shows that she has _______. / रीता को ऑफिस में किसी का पर्स मिला। वह इसे कार्यालय प्रबंधक को देती है। इससे पता चलता है कि उसके पास _______ है।", options: ["Pillar / स्तंभ", "Honesty / ईमानदारी", "Anger / गुस्सा", "Friendship / दोस्ती"], correctAnswerIndex: 1 },
        { id: "es-b2-q21", text: "21. The Constitution of India is also called _____. / संविधान को _____ भी कहा जाता है।", options: ["Bharatiya Academy / भारतीय अकादमी", "Bhartiya Samvidhan / भारतीय संविधान", "Novel / उपन्यास", "Newspaper / अखबार"], correctAnswerIndex: 1 },
        { id: "es-b2-q22", text: "22. India is a Sovereign country. That means it can make its own ______. / भारत एक संप्रभु देश है। इसका मतलब है कि यह अपना ______ बना सकता है।", options: ["Money / धन", "State / राज्य", "Election / चुनाव", "Rules and Decisions / नियम और निर्णय"], correctAnswerIndex: 3 },
        { id: "es-b2-q23", text: "23. Indian constitution is a set of _______ of our country. / भारतीय संविधान हमारे देश के _______ का एक समूह है।", options: ["Laws and rules / कानून और नियम", "Keys / चाबियां", "Tools / औजार", "Watch / घड़ी"], correctAnswerIndex: 0 },
        { id: "es-b2-q24", text: "24. Mr. Johnson wants to employ an 8-year-old girl for household work. In India, we prohibit that because it is ______. / मिस्टर जॉनसन एक 8 साल की लड़की को घरेलू काम के लिए नियुक्त करना चाहते हैं। भारत में हम इसे प्रतिबंधित करते हैं क्योंकि यह ______ है।", options: ["Neutral / तटस्थ", "General / सामान्य", "Right against exploitation / शोषण के विरुद्ध अधिकार", "Police / पुलिस"], correctAnswerIndex: 2 },
        { id: "es-b2-q25", text: "25. We have freedom to go to temple, church, or mosque for prayer. This pillar of character is called _____. / हमें प्रार्थना के लिए मंदिर, चर्च या मस्जिद में जाने की आजादी है। चरित्र के इस स्तंभ को _____ कहा जाता है।", options: ["Responsibility / जिम्मेदारी", "Cheating / बेईमानी करना", "Honesty / ईमानदारी", "Respect / आदर"], correctAnswerIndex: 3 },
        { id: "es-b2-q26", text: "26. Addition of harmful smoke, gases, and chemicals to the environment in large quantities is called _____. / पर्यावरण में बड़ी मात्रा में हानिकारक धुआं, गैसों और रसायनों का शामिल होना _____ कहलाता है।", options: ["Air / वायु", "Pollution / प्रदूषण", "Wind / हवा", "Storm / आंधी"], correctAnswerIndex: 1 },
        { id: "es-b2-q27", text: "27. Cutting down of trees for farming and housing purposes is called ______. / खेती और आवास प्रयोजन के लिए पेड़ों की कटाई को ______ कहा जाता है।", options: ["Deforestation / वनों की कटाई", "Land / भूमि", "Forest / जंगल", "Destiny / तकदीर"], correctAnswerIndex: 0 },
        { id: "es-b2-q28", text: "28. Releasing chemicals, waste, plastics into water is called ______. / रसायन, अपशिष्ट, प्लास्टिक को पानी में छोड़ना ______ कहलाता है।", options: ["Sound pollution / ध्वनि प्रदूषण", "Land pollution / धरा प्रदूषण", "Water Pollution / जल प्रदूषण", "Air pollution / वायु प्रदूषण"], correctAnswerIndex: 2 },
        { id: "es-b2-q29", text: "29. Scientists are warning us that the rise in earth’s temperature causes ______. / वैज्ञानिक हमें चेतावनी दे रहे हैं कि पृथ्वी के तापमान में वृद्धि ______ का कारण बनती है।", options: ["Destroy / नष्ट करना", "Land sliding / लैंड स्लाइडिंग", "Warm / गर्म", "Global warming / ग्लोबल वार्मिंग"], correctAnswerIndex: 3 },
        { id: "es-b2-q30", text: "30. Shyam avoids the use of plastic and chemical fertilizers. He is following ______. / श्याम प्लास्टिक और रासायनिक उर्वरकों के इस्तेमाल से बचते हैं। वह ______ का अनुसरण कर रहा है।", options: ["Green lifestyle / हरी जीवन शैली", "Modern lifestyle / आधुनिक जीवनशैली", "Busy lifestyle / व्यस्त जीवनशैली", "None / कोई नहीं"], correctAnswerIndex: 0 }
    ]
  },
  {
    title: "3. Becoming a Professional in the 21st Century",
    questions: [
        { id: "es-b3-q31", text: "31. Major changes took place in the manufacturing world with ____. / विनिर्माण जगत में ____ के साथ बड़े परिवर्तन हुए।", options: ["Green revolution / हरित क्रांति", "Milk revolution / दुग्ध क्रांति", "Industrial revolution / औद्योगिक क्रांति", "White revolution / श्वेत क्रांति"], correctAnswerIndex: 2 },
        { id: "es-b3-q32", text: "32. The process of manufacturing has changed due to technology and _____ development. / प्रौद्योगिकी और _____ विकास के कारण विनिर्माण की प्रक्रिया बदल गई है।", options: ["Training / प्रशिक्षण", "Scientific / वैज्ञानिक", "Teaching / शिक्षण", "Facilitation / सुविधा"], correctAnswerIndex: 1 },
        { id: "es-b3-q33", text: "33. Regular assessment of skills is necessary for the growth of _______. / ________ की वृद्धि के लिए कौशल का नियमित मूल्यांकन आवश्यक है।", options: ["Career / आजीविका", "Interview / साक्षात्कार", "Job / कार्य", "Skill / कौशल"], correctAnswerIndex: 0 },
        { id: "es-b3-q34", text: "34. Neetu has excellent storytelling skills. What type of intelligence is it? / नीतू के पास कहानी कहने का बेहतरीन कौशल है। यह किस प्रकार की बुद्धिमत्ता है?", options: ["Picture Smart / पिक्चर स्मार्ट", "Logic Smart / लॉजिक स्मार्ट", "Body Smart / बॉडी स्मार्ट", "Word Smart / वर्ड स्मार्ट"], correctAnswerIndex: 3 },
        { id: "es-b3-q35", text: "35. Swaraj is looking for internet-based/data entry jobs. What is the most important skill he needs? / स्वराज इंटरनेट आधारित/डेटा एंट्री नौकरियों की तलाश में है। उसे किस सबसे महत्वपूर्ण कौशल की आवश्यकता है?", options: ["Basic computer skills / बुनियादी कंप्यूटर कौशल", "Entrepreneurial skills / उद्यमिता कौशल", "Beautician skills / ब्यूटीशियन कौशल", "Wood cutting skills / लकड़ी काटने का कौशल"], correctAnswerIndex: 0 }
    ]
  },
  {
    title: "4. Basic English Skills",
    sets: [
      {
        title: "Noun & Parts of Speech",
        questions: [
            { id: "es-b4-q1", text: "1. English is a ______ language. / अंग्रेजी एक ______ भाषा है।", options: ["Common / सामान्य", "Day / दिन", "Night / रात", "Evening / शाम"], correctAnswerIndex: 0 },
            { id: "es-b4-q2", text: "2. Using Internet is easy if we learn _______. / अगर हम _______ सीख लें तो इंटरनेट का उपयोग करना आसान है।", options: ["Sports / खेल", "English / अंग्रेजी", "Math's / गणित", "Science / विज्ञान"], correctAnswerIndex: 1 },
            { id: "es-b4-q3", text: "3. We can learn English by _______. / हम _______ द्वारा अंग्रेजी सीख सकते हैं।", options: ["Cooking / खाना बनाना", "Playing / खेलना", "Reading newspaper / समाचार पत्र पढ़ रहा है", "None / कोई नहीं"], correctAnswerIndex: 2 }
        ]
      }
    ]
  },
  {
    title: "5. Career Development & Goal Setting",
    questions: [
        { id: "es-b5-q1", text: "1. An occupation undertaken for a long period and with opportunities for progress is called. / लंबे समय तक किया गया और उन्नति के अवसरों वाला व्यवसाय कहलाता है।", options: ["Job / काम", "Career / आजीविका", "Work / काम", "None / कोई नहीं"], correctAnswerIndex: 1 },
        { id: "es-b5-q2", text: "2. Everything that we do outside work is ___. / हम जो कुछ भी काम के बाहर करते हैं वह ___ है।", options: ["Personal life / व्यक्तिगत जीवन", "Professional life / पेशेवर जिंदगी", "Tuition / ट्यूशन", "Dislikes / नापसंद के"], correctAnswerIndex: 0 }
    ]
  },
  {
    title: "6. Communication Skills",
    questions: [
        { id: "es-b6-q1", text: "1. We can share our thoughts, ideas, and feelings through ______. / हम अपने विचारों, विचारों और भावनाओं को ______ के माध्यम से साझा कर सकते हैं।", options: ["Communication / संचार", "Reading / अध्ययन", "Watching / देख रहे", "Hearing / सुनाई"], correctAnswerIndex: 0 },
        { id: "es-b6-q2", text: "2. Effective communication needs to be ______. / प्रभावी संचार होना जरूरी है ______.", options: ["Simple / सरल", "Clear / साफ़", "Complete / पूरा", "All of the above / ऊपर के सभी"], correctAnswerIndex: 3 }
    ]
  },
  { title: "7. Diversity & Inclusion", questions: [] },
  {
    title: "8. Financial and Legal Literacy",
    sets: [
        {
            title: "Financial Planning",
            questions: [
                { id: "es-b8-q1", text: "1. Financial literacy is understanding the way money is…… / वित्तीय साक्षरता का मतलब यह समझना है कि पैसा कैसा है", options: ["Saved / बचाया", "Spent / खर्च किया", "Invested / निवेश", "All of them / उन सभी को"], correctAnswerIndex: 3 },
                { id: "es-b8-q2", text: "2. Costly things that are not essential for our survival are…… / महंगी चीजें जो हमारे अस्तित्व के लिए आवश्यक नहीं हैं", options: ["Needs / ज़रूरत", "Wants / चाहता है", "Luxuries / विलासिता", "Savings / जमा पूँजी"], correctAnswerIndex: 2 }
            ]
        }
    ]
  },
  { title: "9. Essential Digital Skills", questions: [] },
  { title: "10. Entrepreneurship", questions: [] },
  { title: "11. Customer Service", questions: [] },
  { title: "12. Getting Ready for Apprenticeship & Jobs", questions: [] }
];
