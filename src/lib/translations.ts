// ============================================================
// Centralized Translation Object
// Languages: mr (Marathi – default), hi (Hindi), en (English)
// ============================================================

export type Language = "mr" | "hi" | "en";

export type Translations = typeof mr;

// -----------------------------------------------------------
// MARATHI (default / fallback)
// -----------------------------------------------------------
const mr = {
    // --- Navbar ---
    navbar: {
        logoLine1: "भारतीय जनता पार्टी",
        logoLine2: "यवतमाळ जिल्हा",
        shareUrl: "URL शेअर करा",
        login: "लॉगिन",
        stateWebsites: "राज्य वेबसाइट्स",
        contactUs: "संपर्क करा",
        language: "भाषा",
        mediaResources: "मीडिया संसाधने",
        photoGallery: "फोटो गॅलरी",
        videoGallery: "व्हिडिओ गॅलरी",
        bjpLive: "BJP लाइव्ह",
        joinBjp: "BJP मध्ये सामील व्हा",
        join: "सामील व्हा",
        menu: "मेनू",
    },

    // --- Footer ---
    footer: {
        logoLine1: "भारतीय जनता पार्टी",
        logoLine2: "यवतमाळ जिल्हा",
        description:
            "माननीय पंतप्रधान श्री नरेंद्र मोदी यांच्या दूरदर्शी नेतृत्वाखाली यवतमाळ जिल्ह्याच्या सर्वांगीण विकास आणि प्रगतीसाठी समर्पित.",
        quickLinks: "त्वरित दुवे",
        quickLinkItems: [
            "मुख्यपृष्ठ",
            "BJP बद्दल",
            "आमचे कार्य",
            "उपलब्धी",
            "आमचे नेते",
            "यात्रेत सामील व्हा",
        ],
        media: "मीडिया",
        mediaItems: ["फोटो गॅलरी", "व्हिडिओ गॅलरी", "निवडणूक जाहीरनामा", "डाउनलोड्स"],
        contactUs: "संपर्क करा",
        address: "BJP जिल्हा कार्यालय,\nमुख्य रस्ता, यवतमाळ,\nमहाराष्ट्र ४४५००१",
        grievanceCell: "तक्रार निवारण कक्ष →",
        copyright: "© {year} BJP यवतमाळ. सर्व हक्क राखीव.",
        footerTagline: "भारतीय जनता पार्टी – यवतमाळ जिल्हा",
        privacyPolicy: "गोपनीयता धोरण",
        termsOfUse: "वापराच्या अटी",
    },

    // --- Marquee Strip ---
    marquee: {
        slogans: [
            "सबका साथ, सबका विकास, सबका विश्वास",
            "एक भारत, श्रेष्ठ भारत",
            "आत्मनिर्भर भारत",
            "वंदे मातरम",
            "जय श्री राम",
        ],
    },

    // --- Hero Slider ---
    hero: {
        district: "यवतमाळ जिल्हा · महाराष्ट्र",
        joinJourney: "यात्रेत सामील व्हा",
        ourWork: "आमचे कार्य",
        slides: [
            {
                slogan: "एक भारत श्रेष्ठ भारत",
                subtext: "यवतमाळ जिल्ह्याला अधिक मजबूत आणि आत्मनिर्भर बनवत आहे.",
            },
            {
                slogan: "सबका साथ सबका विकास",
                subtext: "जिल्ह्याच्या प्रत्येक कोपऱ्यापर्यंत सर्वांगीण विकास पोहोचवित आहे.",
            },
            {
                slogan: "आत्मनिर्भर यवतमाळ",
                subtext: "उज्ज्वल भविष्यासाठी युवा, महिला आणि शेतकऱ्यांना सक्षम बनवत आहे.",
            },
            {
                slogan: "वंदे मातरम",
                subtext: "राष्ट्राप्रती समर्पित, यवतमाळसाठी कटिबद्ध.",
            },
        ],
    },

    // --- Stats Section ---
    stats: {
        headingLine1: "आमचा प्रभाव",
        headingHighlight: "यवतमाळ जिल्ह्यात",
        description:
            "अनेक दशकांपासून, भारतीय जनता पार्टी यवतमाळच्या परिवर्तनामागील प्रेरणाशक्ती आहे. कृषी, युवा कल्याण आणि मजबूत पायाभूत सुविधांवर लक्ष केंद्रित आहे.",
        yearsOfService: "सेवेची वर्षे",
        beneficiaries: "लाभार्थी",
        developmentFunds: "विकास निधी",
        projectsCompleted: "पूर्ण झालेले प्रकल्प",
    },

    // --- Achievements Slider ---
    achievements: {
        label: "आमचे कार्य आणि उपलब्धी",
        title: "आम्ही काय दिले",
        titleHighlight: "दिले",
        items: [
            {
                title: "५०० किमी ग्रामीण रस्ते (PMGSY)",
                date: "डिसें. २०२३",
                desc: "यवतमाळ जिल्ह्यातील १२०+ दुर्गम गावे मुख्य महामार्गाशी जोडली.",
            },
            {
                title: "१२,००० PM आवास घरे",
                date: "२०१९-२०२४",
                desc: "पात्र कुटुंबांना पक्की घरे उपलब्ध करून देऊन सन्मान आणि निवारा सुनिश्चित केला.",
            },
            {
                title: "जल जीवन मिशन",
                date: "चालू",
                desc: "घरोघरी शुद्ध पेयजल पुरवण्यासाठी ८०,००० नळ जोडणी केली.",
            },
            {
                title: "PM-KISAN योजना",
                date: "२०२४",
                desc: "यवतमाळमधील २ लाखाहून अधिक शेतकऱ्यांना थेट उत्पन्न सहाय्य मिळाले.",
            },
            {
                title: "आयुष्मान भारत",
                date: "२०१८-२०२४",
                desc: "३.५ लाख कुटुंबे ₹५ लाखांपर्यंतच्या मोफत आरोग्य विम्यासाठी नोंदणीकृत.",
            },
            {
                title: "डिजिटल वर्गखोल्या",
                date: "२०२३",
                desc: "स्मार्ट बोर्ड आणि डिजिटल पायाभूत सुविधांसह ३०० जिल्हा परिषद शाळा आधुनिक केल्या.",
            },
        ],
    },

    // --- Leader Slider ---
    leaders: {
        readMore: "अधिक वाचा",
        slides: [
            { title: "पंतप्रधान", name: "श्री नरेंद्र मोदी" },
            { title: "मुख्यमंत्री", name: "श्री योगी आदित्यनाथ" },
        ],
    },

    // --- Gallery Grid ---
    gallery: {
        label: "मीडिया आणि आठवणी",
        title: "आमच्या प्रवासाच्या झलकी",
        titleHighlight: "झलकी",
    },

    // --- Join Section ---
    join: {
        heading: "यात्रेत सामील व्हा",
        subheading: "तुम्हाला जो बदल हवा आहे तो स्वतः व्हा.",
        joinBjp1: "सामील व्हा",
        joinBjpHighlight: "BJP",
        description:
            "BJP राष्ट्रांप्रती समर्पित आहे आणि एका मजबूत व विकसित भारताच्या निर्मितीसाठी वचनबद्ध आहे जे भारताच्या जनतेच्या विश्वास आणि अतूट समर्थनाशिवाय अशक्य आहे. आमच्यात सामील व्हा आणि समाजाच्या सर्व घटकांचे जीवन बदलणाऱ्या अभूतपूर्व परिवर्तनाचा भाग व्हा.",
        joinVolunteer: "स्वयंसेवक म्हणून\nसामील व्हा",
        becomeMember: "सदस्य\nबना",
    },

    // --- Home Page – About Section ---
    homePage: {
        aboutLabel: "BJP बद्दल",
        aboutTitle: "दशकांपासून यवतमाळची सेवा",
        aboutTitleHighlight: "दशकांपासून",
        aboutDescription:
            "भारतीय जनता पार्टी यवतमाळमधील विकासाचा आधारस्तंभ राहिली आहे. 'अंत्योदय' च्या तत्त्वज्ञानाने प्रेरित होऊन, आम्ही वंचितांच्या उत्थानासाठी आणि समाजातील शेवटच्या व्यक्तीपर्यंत समृद्धी पोहोचवण्यासाठी वचनबद्ध आहोत.",
        activeService: "सक्रिय सेवा",
        beneficiaries: "लाभार्थी",
        learnMore: "अधिक जाणून घ्या",
        journeyLabel: "आमचा प्रवास",
        journeyTitle: "समर्पण आणि सेवेची दशके",
        journeyDescription:
            "यवतमाळमध्ये लाखोंचा आवाज बनण्याच्या विनम्र सुरुवातीपासून, BJP चा प्रवास अटल वचनबद्धता, त्याग आणि या प्रदेशातील जनतेसाठी अथक सेवेचा आहे.",
        journeyReadMore: "अधिक वाचा",
    },

    // --- About Page ---
    aboutPage: {
        label: "पक्षाबद्दल",
        title: "विचारधारा आणि दृष्टी",
        para1:
            "भारतीय जनता पार्टी (BJP) 'एकात्म मानवदर्शन' आणि 'अंत्योदय' च्या तत्त्वज्ञानाने प्रेरित आहे, प्रत्येक व्यक्ती आणि राष्ट्राच्या सर्वांगीण विकासासाठी प्रयत्नशील आहे.",
        para2:
            "यवतमाळमध्ये, आमची जिल्हा समिती दुर्गम खेड्यांपर्यंत केंद्र आणि राज्य सरकारच्या योजनांचे फायदे पोहोचवण्यासाठी अविरत कार्यरत आहे. शेतकऱ्यांना सक्षम करण्यापासून जागतिक दर्जाच्या पायाभूत सुविधा उपलब्ध करण्यापर्यंत आणि युवा उद्योजकतेला प्रोत्साहन देण्यापर्यंत, आमची दृष्टी एक समृद्ध आणि आत्मनिर्भर यवतमाळ आहे.",
        nationFirst: "राष्ट्र प्रथम",
        corePrinciple: "मूळ तत्त्व",
        sabkaVikas: "सबका विकास",
        inclusiveGrowth: "सर्वसमावेशक विकास",
    },

    // --- Achievements Page ---
    achievementsPage: {
        heading: "यवतमाळचे रूपांतर करत आहे",
        description:
            "जिल्ह्यातील BJP शासनाखाली साध्य झालेल्या पायाभूत सुविधा, कृषी आणि सामाजिक-आर्थिक उपलब्धींचे सविस्तर दर्शन.",
    },

    // --- Contact Page ---
    contactPage: {
        label: "संपर्कात रहा",
        heading1: "आम्ही येथे आहोत",
        heading2: "ऐकण्यासाठी",
        headingHighlight: "ऐकण्यासाठी",
        visitUs: "आम्हाला भेट द्या",
        callUs: "आम्हाला कॉल करा",
        emailUs: "आम्हाला ईमेल करा",
        address: "BJP जिल्हा कार्यालय,\nमुख्य रस्ता, वार्ड क्र. ४,\nयवतमाळ, महाराष्ट्र ४४५००१",
        hours: "सोम-शनि: सकाळी १०:०० - सायंकाळी ६:००",
        formHeading: "संदेश पाठवा",
        nameLabel: "नाव",
        namePlaceholder: "उदा. अनिल पाटील",
        phoneLabel: "फोन",
        emailLabel: "ईमेल (पर्यायी)",
        emailPlaceholder: "name@domain.com",
        subjectLabel: "विषय",
        generalInquiry: "सामान्य चौकशी",
        grievance: "तक्रार / तक्रारी",
        mediaInquiry: "मीडिया चौकशी",
        other: "इतर",
        messageLabel: "संदेश",
        messagePlaceholder: "आम्ही तुम्हाला कशी मदत करू शकतो?",
        sendMessage: "संदेश पाठवा",
    },

    // --- Positions (display labels — DB values always stay Marathi) ---
    positions: {
        label: "पद",
        allPositions: "सर्व पदे",
        coreTeam: "कोर टीम",
        yuvaMorcha: "युवा मोर्चा",
        mahilaMorcha: "महिला मोर्चा",
        chemistFront: "केमिस्ट आघाडी",
        studentFront: "विद्यार्थी आघाडी",
        citySouth: "शहर दक्षिण",
        cityNorth: "शहर उत्तर",
        member: "सदस्य",
    },
};

// -----------------------------------------------------------
// HINDI
// -----------------------------------------------------------
const hi: Partial<typeof mr> = {
    navbar: {
        logoLine1: "भारतीय जनता पार्टी",
        logoLine2: "यवतमाल जिला",
        shareUrl: "URL शेयर करें",
        login: "लॉगिन",
        stateWebsites: "राज्य वेबसाइटें",
        contactUs: "संपर्क करें",
        language: "भाषा",
        mediaResources: "मीडिया संसाधन",
        photoGallery: "फोटो गैलरी",
        videoGallery: "वीडियो गैलरी",
        bjpLive: "BJP लाइव",
        joinBjp: "BJP में शामिल हों",
        join: "जुड़ें",
        menu: "मेनू",
    },
    footer: {
        logoLine1: "भारतीय जनता पार्टी",
        logoLine2: "यवतमाल जिला",
        description:
            "माননीय प्रधानमंत्री श्री नरेंद्र मोदी के दूरदर्शी नेतृत्व में यवतमाल जिले के समग्र विकास एवं प्रगति के लिए समर्पित।",
        quickLinks: "त्वरित लिंक",
        quickLinkItems: ["होम", "BJP के बारे में", "हमारा काम", "उपलब्धियाँ", "हमारे नेता", "यात्रा में शामिल हों"],
        media: "मीडिया",
        mediaItems: ["फोटो गैलरी", "वीडियो गैलरी", "चुनाव घोषणापत्र", "डाउनलोड"],
        contactUs: "संपर्क करें",
        address: "BJP जिला कार्यालय,\nमुख्य सड़क, यवतमाल,\nमहाराष्ट्र ४४५००१",
        grievanceCell: "शिकायत निवारण कक्ष →",
        copyright: "© {year} BJP यवतमाल. सर्वाधिकार सुरक्षित।",
        footerTagline: "भारतीय जनता पार्टी – यवतमाल जिला",
        privacyPolicy: "गोपनीयता नीति",
        termsOfUse: "उपयोग की शर्तें",
    },
    marquee: {
        slogans: [
            "सबका साथ, सबका विकास, सबका विश्वास",
            "एक भारत, श्रेष्ठ भारत",
            "आत्मनिर्भर भारत",
            "वंदे मातरम",
            "जय श्री राम",
        ],
    },
    hero: {
        district: "यवतमाल जिला · महाराष्ट्र",
        joinJourney: "यात्रा में शामिल हों",
        ourWork: "हमारा काम",
        slides: [
            { slogan: "एक भारत श्रेष्ठ भारत", subtext: "यवतमाल जिले को अधिक मजबूत और आत्मनिर्भर बना रहे हैं।" },
            { slogan: "सबका साथ सबका विकास", subtext: "जिले के हर कोने तक समग्र विकास पहुँचाना सुनिश्चित कर रहे हैं।" },
            { slogan: "आत्मनिर्भर यवतमाल", subtext: "उज्ज्वल भविष्य के लिए युवाओं, महिलाओं और किसानों को सशक्त बना रहे हैं।" },
            { slogan: "वंदे मातरम", subtext: "राष्ट्र के प्रति समर्पित, यवतमाल के प्रति कर्तव्यबद्ध।" },
        ],
    },
    stats: {
        headingLine1: "हमारा प्रभाव",
        headingHighlight: "यवतमाल जिले में",
        description:
            "दशकों से, भारतीय जनता पार्टी यवतमाल के परिवर्तन की प्रेरणाशक्ति रही है। कृषि, युवा कल्याण और मजबूत बुनियादी ढाँचे पर ध्यान केंद्रित है।",
        yearsOfService: "सेवा के वर्ष",
        beneficiaries: "लाभार्थी",
        developmentFunds: "विकास निधि",
        projectsCompleted: "पूर्ण हुए प्रोजेक्ट",
    },
    achievements: {
        label: "हमारा काम और उपलब्धियाँ",
        title: "हमने क्या दिया",
        titleHighlight: "दिया",
        items: [
            {
                title: "५०० किमी ग्रामीण सड़कें (PMGSY)",
                date: "दिस. २०२३",
                desc: "यवतमाल जिले के १२०+ दूरदराज गाँवों को मुख्य राजमार्ग से जोड़ा।",
            },
            {
                title: "१२,००० PM आवास घर",
                date: "२०१९-२०२४",
                desc: "पात्र परिवारों को पक्के मकान उपलब्ध करा कर सम्मान और आश्रय सुनिश्चित किया।",
            },
            {
                title: "जल जीवन मिशन",
                date: "जारी",
                desc: "घर-घर शुद्ध पेयजल पहुँचाने के लिए ८०,००० नल कनेक्शन लगाए।",
            },
            {
                title: "PM-KISAN योजना",
                date: "२०२४",
                desc: "यवतमाल के २ लाख से अधिक किसानों को प्रत्यक्ष आय सहायता मिली।",
            },
            {
                title: "आयुष्मान भारत",
                date: "२०१८-२०२४",
                desc: "३.५ लाख परिवार ₹५ लाख तक के निःशुल्क स्वास्थ्य बीमे के लिए पंजीकृत।",
            },
            {
                title: "डिजिटल कक्षाएँ",
                date: "२०२३",
                desc: "स्मार्ट बोर्ड और डिजिटल बुनियादी ढाँचे के साथ ३०० जिला परिषद स्कूलों का आधुनिकीकरण किया।",
            },
        ],
    },
    leaders: {
        readMore: "और पढ़ें",
        slides: [
            { title: "प्रधानमंत्री", name: "श्री नरेंद्र मोदी" },
            { title: "मुख्यमंत्री", name: "श्री योगी आदित्यनाथ" },
        ],
    },
    gallery: {
        label: "मीडिया और यादें",
        title: "हमारी यात्रा की झलकियाँ",
        titleHighlight: "झलकियाँ",
    },
    join: {
        heading: "यात्रा में शामिल हों",
        subheading: "वह बदलाव बनें जो आप देखना चाहते हैं।",
        joinBjp1: "शामिल हों",
        joinBjpHighlight: "BJP",
        description:
            "BJP एक मजबूत और विकसित भारत के निर्माण के लिए समर्पित है जो भारत के लोगों के विश्वास और अटूट समर्थन के बिना असंभव है। हमसे जुड़ें और समाज के सभी वर्गों के जीवन को बदलने वाले अभूतपूर्व परिवर्तन का हिस्सा बनें।",
        joinVolunteer: "स्वयंसेवक के रूप में\nशामिल हों",
        becomeMember: "सदस्य\nबनें",
    },
    homePage: {
        aboutLabel: "BJP के बारे में",
        aboutTitle: "दशकों से यवतमाल की सेवा में",
        aboutTitleHighlight: "दशकों",
        aboutDescription:
            "भारतीय जनता पार्टी यवतमाल में विकास की आधारशिला रही है। 'अंत्योदय' के दर्शन से प्रेरित होकर, हम वंचितों के उत्थान और समाज के अंतिम व्यक्ति तक समृद्धि पहुँचाने के लिए प्रतिबद्ध हैं।",
        activeService: "सक्रिय सेवा",
        beneficiaries: "लाभार्थी",
        learnMore: "और जानें",
        journeyLabel: "हमारी यात्रा",
        journeyTitle: "समर्पण और सेवा के दशक",
        journeyDescription:
            "यवतमाल में लाखों लोगों की आवाज बनने की विनम्र शुरुआत से लेकर आज तक, BJP की यात्रा अटूट प्रतिबद्धता, त्याग और इस क्षेत्र की जनता के प्रति अथक सेवा की है।",
        journeyReadMore: "और पढ़ें",
    },
    aboutPage: {
        label: "पार्टी के बारे में",
        title: "विचारधारा और दृष्टि",
        para1:
            "भारतीय जनता पार्टी (BJP) 'एकात्म मानववाद' और 'अंत्योदय' के दर्शन से प्रेरित है, प्रत्येक व्यक्ति और राष्ट्र के समग्र विकास के लिए प्रयासरत है।",
        para2:
            "यवतमाल में, हमारी जिला समिति दूरदराज के गाँवों तक केंद्र और राज्य सरकार की योजनाओं के लाभ पहुँचाने के लिए अथक कार्य कर रही है। किसानों को सशक्त बनाने से लेकर विश्वस्तरीय बुनियादी ढाँचा प्रदान करने और युवा उद्यमिता को प्रोत्साहित करने तक, हमारी दृष्टि एक समृद्ध और आत्मनिर्भर यवतमाल है।",
        nationFirst: "राष्ट्र प्रथम",
        corePrinciple: "मूल सिद्धांत",
        sabkaVikas: "सबका विकास",
        inclusiveGrowth: "समावेशी विकास",
    },
    achievementsPage: {
        heading: "यवतमाल का परिवर्तन",
        description:
            "जिले में BJP शासन के तहत प्राप्त बुनियादी ढाँचे, कृषि और सामाजिक-आर्थिक उपलब्धियों पर एक विस्तृत नज़र।",
    },
    contactPage: {
        label: "संपर्क में रहें",
        heading1: "हम यहाँ हैं",
        heading2: "सुनने के लिए",
        headingHighlight: "सुनने",
        visitUs: "हमसे मिलें",
        callUs: "हमें कॉल करें",
        emailUs: "हमें ईमेल करें",
        address: "BJP जिला कार्यालय,\nमुख्य सड़क, वार्ड नं. ४,\nयवतमाल, महाराष्ट्र ४४५००१",
        hours: "सोम-शनि: सुबह १०:०० - शाम ६:००",
        formHeading: "संदेश भेजें",
        nameLabel: "नाम",
        namePlaceholder: "उदा. अनिल पाटिल",
        phoneLabel: "फोन",
        emailLabel: "ईमेल (वैकल्पिक)",
        emailPlaceholder: "name@domain.com",
        subjectLabel: "विषय",
        generalInquiry: "सामान्य पूछताछ",
        grievance: "शिकायत / अभियोग",
        mediaInquiry: "मीडिया पूछताछ",
        other: "अन्य",
        messageLabel: "संदेश",
        messagePlaceholder: "हम आपकी कैसे सहायता कर सकते हैं?",
        sendMessage: "संदेश भेजें",
    },
    positions: {
        label: "पद",
        allPositions: "सभी पद",
        coreTeam: "कोर टीम",
        yuvaMorcha: "युवा मोर्चा",
        mahilaMorcha: "महिला मोर्चा",
        chemistFront: "केमिस्ट फ्रंट",
        studentFront: "छात्र फ्रंट",
        citySouth: "शहर दक्षिण",
        cityNorth: "शहर उत्तर",
        member: "सदस्य",
    },
};

// -----------------------------------------------------------
// ENGLISH
// -----------------------------------------------------------
const en: Partial<typeof mr> = {
    navbar: {
        logoLine1: "Bharatiya Janata Party",
        logoLine2: "Yavatmal District",
        shareUrl: "Share URL",
        login: "Login",
        stateWebsites: "State Websites",
        contactUs: "Contact Us",
        language: "Language",
        mediaResources: "Media Resources",
        photoGallery: "Photo Gallery",
        videoGallery: "Video Gallery",
        bjpLive: "BJP Live",
        joinBjp: "Join BJP",
        join: "Join",
        menu: "Menu",
    },
    footer: {
        logoLine1: "Bharatiya Janata Party",
        logoLine2: "Yavatmal District",
        description:
            "Dedicated to the holistic development and progress of Yavatmal district under the visionary leadership of Hon. Prime Minister Narendra Modi.",
        quickLinks: "Quick Links",
        quickLinkItems: ["Home", "About BJP", "Our Work", "Achievements", "Our Leaders", "Join The Journey"],
        media: "Media",
        mediaItems: ["Photo Gallery", "Video Gallery", "Election Manifesto", "Downloads"],
        contactUs: "Contact Us",
        address: "BJP District Office,\nMain Road, Yavatmal,\nMaharashtra 445001",
        grievanceCell: "Grievance Cell →",
        copyright: "© {year} BJP Yavatmal. All rights reserved.",
        footerTagline: "Bharatiya Janata Party – Yavatmal District",
        privacyPolicy: "Privacy Policy",
        termsOfUse: "Terms of Use",
    },
    marquee: {
        slogans: [
            "Together For All, Development For All, Trust For All",
            "One India, Greatest India",
            "Self-Reliant India",
            "Vande Mataram",
            "Jai Shri Ram",
        ],
    },
    hero: {
        district: "Yavatmal District · Maharashtra",
        joinJourney: "Join the Journey",
        ourWork: "Our Work",
        slides: [
            { slogan: "Ek Bharat Shreshtha Bharat", subtext: "Building a stronger, self-reliant Yavatmal district." },
            { slogan: "Sabka Saath Sabka Vikas", subtext: "Ensuring holistic development reaching every corner of the district." },
            { slogan: "Atmanirbhar Yavatmal", subtext: "Empowering youth, women, and farmers for a brighter future." },
            { slogan: "Vande Mataram", subtext: "Committed to the nation, dedicated to Yavatmal." },
        ],
    },
    stats: {
        headingLine1: "Our Impact Across",
        headingHighlight: "Yavatmal District",
        description:
            "For decades, the Bharatiya Janata Party has been the driving force behind Yavatmal's transformation, focusing on agriculture, youth welfare, and robust infrastructure.",
        yearsOfService: "Years of Service",
        beneficiaries: "Beneficiaries",
        developmentFunds: "Development Funds",
        projectsCompleted: "Projects Completed",
    },
    achievements: {
        label: "Our Work & Achievements",
        title: "What We've Delivered",
        titleHighlight: "Delivered",
        items: [
            {
                title: "500KM Rural Roads (PMGSY)",
                date: "Dec 2023",
                desc: "Connected 120+ remote villages in Yavatmal district to the main highway network.",
            },
            {
                title: "12,000 PM Awas Houses",
                date: "2019-2024",
                desc: "Provided pucca houses to eligible families, ensuring dignity and shelter.",
            },
            {
                title: "Jal Jeevan Mission",
                date: "Ongoing",
                desc: "Installed 80,000 tap connections providing clean drinking water to households.",
            },
            {
                title: "PM-KISAN Scheme",
                date: "2024",
                desc: "Over 2 Lakh farmers in Yavatmal received direct income support.",
            },
            {
                title: "Ayushman Bharat",
                date: "2018-2024",
                desc: "3.5 Lakh families registered for free health insurance up to ₹5 Lakh.",
            },
            {
                title: "Digital Classrooms",
                date: "2023",
                desc: "Modernized 300 Zilla Parishad schools with smart boards and digital infrastructure.",
            },
        ],
    },
    leaders: {
        readMore: "Read More",
        slides: [
            { title: "Prime Minister", name: "Shri Narendra Modi" },
            { title: "Chief Minister", name: "Shri Yogi Adityanath" },
        ],
    },
    gallery: {
        label: "Media & Memories",
        title: "Glimpses of Our Journey",
        titleHighlight: "Journey",
    },
    join: {
        heading: "JOIN THE JOURNEY",
        subheading: "Be the change you want to see.",
        joinBjp1: "JOIN",
        joinBjpHighlight: "BJP",
        description:
            "BJP is devoutly committed to building a strong and developed India which is unimaginable without the trust and the unflinching support of the people of India. Join us and be part of the unprecedented transformation that is changing the lives of all sections of society for better.",
        joinVolunteer: "JOIN AS\nVOLUNTEER",
        becomeMember: "BECOME A\nMEMBER",
    },
    homePage: {
        aboutLabel: "ABOUT BJP",
        aboutTitle: "Serving Yavatmal Since Decades",
        aboutTitleHighlight: "Decades",
        aboutDescription:
            "The Bharatiya Janata Party has been the cornerstone of development in Yavatmal. Driven by the philosophy of \"Antyodaya,\" we are committed to uplifting the marginalized and ensuring prosperity reaches the last person in society.",
        activeService: "Active Service",
        beneficiaries: "Beneficiaries",
        learnMore: "Learn More",
        journeyLabel: "OUR JOURNEY",
        journeyTitle: "Decades of Dedication & Service",
        journeyDescription:
            "From humble beginnings to becoming the voice of millions in Yavatmal, the BJP's journey is one of unwavering commitment, sacrifice, and relentless service to the people of this region.",
        journeyReadMore: "Read More",
    },
    aboutPage: {
        label: "ABOUT THE PARTY",
        title: "Ideology & Vision",
        para1:
            "The Bharatiya Janata Party (BJP) is driven by the philosophy of \"Integral Humanism\" and \"Antyodaya,\" striving for the holistic development of every individual and the nation.",
        para2:
            "In Yavatmal, our district committee has been tirelessly working to bring the benefits of both Central and State government schemes to the most remote villages. From empowering our farmers to providing world-class infrastructure and encouraging youth entrepreneurship, our vision is a prosperous and self-reliant Yavatmal.",
        nationFirst: "NATION FIRST",
        corePrinciple: "Core Principle",
        sabkaVikas: "SABKA VIKAS",
        inclusiveGrowth: "Inclusive Growth",
    },
    achievementsPage: {
        heading: "Transforming Yavatmal",
        description:
            "A detailed look at the infrastructure, agricultural, and socio-economic milestones achieved under the BJP's governance in the district.",
    },
    contactPage: {
        label: "GET IN TOUCH",
        heading1: "We are here",
        heading2: "to Listen",
        headingHighlight: "Listen",
        visitUs: "Visit Us",
        callUs: "Call Us",
        emailUs: "Email Us",
        address: "BJP District Office,\nMain Road, Ward No. 4,\nYavatmal, Maharashtra 445001",
        hours: "Mon-Sat: 10:00 AM - 6:00 PM",
        formHeading: "Send a Message",
        nameLabel: "Name",
        namePlaceholder: "Ex. Anil Patil",
        phoneLabel: "Phone",
        emailLabel: "Email (Optional)",
        emailPlaceholder: "name@domain.com",
        subjectLabel: "Subject",
        generalInquiry: "General Inquiry",
        grievance: "Grievance / Complaint",
        mediaInquiry: "Media Inquiry",
        other: "Other",
        messageLabel: "Message",
        messagePlaceholder: "How can we help you?",
        sendMessage: "Send Message",
    },
    positions: {
        label: "Position",
        allPositions: "All Positions",
        coreTeam: "Core Team",
        yuvaMorcha: "Youth Wing",
        mahilaMorcha: "Women's Wing",
        chemistFront: "Chemist Front",
        studentFront: "Student Front",
        citySouth: "City South",
        cityNorth: "City North",
        member: "Member",
    },
};

// -----------------------------------------------------------
// Export
// -----------------------------------------------------------
export const translations: Record<Language, typeof mr> = {
    mr,
    hi: { ...mr, ...hi } as typeof mr,
    en: { ...en, ...mr } as typeof mr,
};

// Deep merge – en and hi override mr at nested level properly
function deepMerge<T>(base: T, override: Partial<T>): T {
    const result = { ...base };
    for (const key in override) {
        const k = key as keyof T;
        if (
            override[k] !== undefined &&
            typeof override[k] === "object" &&
            !Array.isArray(override[k]) &&
            typeof base[k] === "object" &&
            !Array.isArray(base[k])
        ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            result[k] = deepMerge(base[k] as any, override[k] as any);
        } else if (override[k] !== undefined) {
            result[k] = override[k] as T[keyof T];
        }
    }
    return result;
}

export const allTranslations: Record<Language, typeof mr> = {
    mr,
    hi: deepMerge(mr, hi),
    en: deepMerge(mr, en),
};
