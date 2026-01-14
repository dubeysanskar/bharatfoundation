import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
    en: {
        nav: {
            history: "History",
            members: "Members",
            projects: "Projects",
            gallery: "Gallery",
            contact: "Contact",
            donors: "Donors",
            donateNow: "Donate Now"
        },
        hero: {
            title: "A Legacy of Service",
            subtitle: "Dedicated to cultural preservation, community welfare, and sustainable living across India.",
            knowMore: "Click to Know More",
            donateToday: "Donate Today",
            bgText: "Bharat Foundation Serving India"
        },
        history: {
            title: "Our History",
            content: "The Bharat Foundation was established two decades ago with a simple yet profound vision: to uplift local communities and preserve India's timeless cultural heritage. Starting from a small community kitchen, we have grown into a multi-faceted organization touching thousands of lives.\n\nOur journey began in the heart of Prayagraj, where a group of dedicated volunteers came together with a shared dream of creating meaningful change. What started as distributing food to the needy has evolved into a comprehensive mission encompassing spiritual development, animal welfare, and community empowerment.\n\nOver the years, we have built strong partnerships with local communities, religious institutions, and like-minded organizations. Our Gaushala provides sanctuary to over 50 rescued cattle, while our Shiv Mandir project is creating a spiritual center that will serve generations to come.\n\nToday, the Bharat Foundation stands as a testament to the power of collective action and the enduring spirit of seva (selfless service). We continue to expand our reach, guided by the principles of compassion, integrity, and dedication to the greater good."
        },
        wall: {
            title: "The Wall of Gratitude",
            subtitle: "Thank you to all who contribute. Your support is the foundation of our work.",
            loading: "Loading donor list..."
        },
        moments: {
            title: "Moments of Impact",
            mandir: "Mandir Construction",
            gaushala: "Gaushala Care",
            event: "Community Event",
            volunteers: "Volunteers"
        },
        projects: {
            title: "Our Current Projects",
            viewDonate: "View Project & Donate",
            gaushalaTitle: "Gaushala (Cow Shelter)",
            gaushalaDesc: "Our Gaushala provides compassionate care and a safe haven for rescued and geriatric cattle. Focused on ethical, non-commercial sustainability and promoting the sanctity of bovine life.",
            mandirTitle: "Shiv Mandir (Temple)",
            mandirDesc: "A vibrant community center and spiritual refuge, the Shiv Mandir facilitates worship, cultural education, and charitable activities for all community members."
        },
        team: {
            title: "Meet the Team",
            m1Role: "Founder & Chairman",
            m1Desc: "Visionary leader driving all major strategic initiatives and long-term planning.",
            m2Role: "Operations Head",
            m2Desc: "Manages the daily operations of all projects, ensuring efficiency and compliance.",
            m3Role: "Financial Controller",
            m3Desc: "Oversees financial integrity, resource allocation, and donor reporting.",
            m4Role: "Community Liaison",
            m4Desc: "Connects with beneficiaries and ensures our projects meet local community needs."
        },
        donation: {
            title: "Invest in Our Mission",
            cardTitle: "General Foundation Donation",
            cardDesc: "Your general donation helps us maintain all facilities, cover administrative costs, and respond to immediate community needs.",
            namePlaceholder: "Your Full Name (For Donor List)",
            amountPlaceholder: "Donation Amount (e.g., 5000)",
            oneTime: "One-Time Donation",
            monthly: "Monthly Donation",
            submit: "Donate to Bharat Foundation"
        },
        contact: {
            title: "Get In Touch",
            details: "Our Details",
            connect: "Connect",
            namePlaceholder: "Your Name",
            emailPlaceholder: "Your Email",
            msgPlaceholder: "Your Message",
            send: "Send Message"
        }
    },
    hi: {
        nav: {
            history: "इतिहास",
            members: "सदस्य",
            projects: "परियोजनाएं",
            gallery: "गैलरी",
            contact: "संपर्क",
            donors: "दानदाता",
            donateNow: "दान करें"
        },
        hero: {
            title: "सेवा की एक विरासत",
            subtitle: "भारत भर में सांस्कृतिक संरक्षण, सामुदायिक कल्याण और सतत जीवन के लिए समर्पित।",
            knowMore: "अधिक जानने के लिए क्लिक करें",
            donateToday: "आज ही दान करें",
            bgText: "भारत फाउंडेशन भारत की सेवा में"
        },
        history: {
            title: "हमारा इतिहास",
            content: "भारत फाउंडेशन की स्थापना दो दशक पहले एक सरल लेकिन गहन दृष्टि के साथ की गई थी: स्थानीय समुदायों का उत्थान करना और भारत की कालातीत सांस्कृतिक विरासत को संरक्षित करना। एक छोटी सामुदायिक रसोई से शुरू होकर, हम हजारों लोगों के जीवन को छूने वाले एक बहुआयामी संगठन बन गए हैं।\n\nहमारी यात्रा प्रयागराज के केंद्र में शुरू हुई, जहाँ समर्पित स्वयंसेवकों का एक समूह सार्थक परिवर्तन लाने के साझा सपने के साथ एक साथ आया। जो जरूरतमंदों को भोजन वितरित करने से शुरू हुआ, वह आध्यात्मिक विकास, पशु कल्याण और सामुदायिक सशक्तिकरण को शामिल करते हुए एक व्यापक मिशन में विकसित हो गया है।\n\nवर्षों में, हमने स्थानीय समुदायों, धार्मिक संस्थानों और समान विचारधारा वाले संगठनों के साथ मजबूत साझेदारी बनाई है। हमारी गौशाला 50 से अधिक बचाए गए मवेशियों को आश्रय प्रदान करती है, जबकि हमारी शिव मंदिर परियोजना एक आध्यात्मिक केंद्र बना रही है जो आने वाली पीढ़ियों की सेवा करेगा।\n\nआज, भारत फाउंडेशन सामूहिक कार्रवाई की शक्ति और सेवा की स्थायी भावना का प्रमाण है। हम करुणा, अखंडता और अधिक अच्छे के प्रति समर्पण के सिद्धांतों द्वारा निर्देशित होकर अपनी पहुंच का विस्तार करना जारी रखते हैं।"
        },
        wall: {
            title: "आभार की दीवार",
            subtitle: "योगदान देने वाले सभी लोगों को धन्यवाद। आपका समर्थन हमारे काम की नींव है।",
            loading: "दानदाताओं की सूची लोड हो रही है..."
        },
        moments: {
            title: "प्रभाव के क्षण",
            mandir: "मंदिर निर्माण",
            gaushala: "गौशाला सेवा",
            event: "सामुदायिक कार्यक्रम",
            volunteers: "स्वयंसेवक"
        },
        projects: {
            title: "हमारी वर्तमान परियोजनाएं",
            viewDonate: "परियोजना देखें और दान करें",
            gaushalaTitle: "गौशाला (गाय आश्रय)",
            gaushalaDesc: "हमारी गौशाला बचाए गए और बुजुर्ग मवेशियों के लिए दयालु देखभाल और सुरक्षित आश्रय प्रदान करती है। नैतिक, गैर-व्यावसायिक स्थिरता और गोजातीय जीवन की पवित्रता को बढ़ावा देने पर केंद्रित है।",
            mandirTitle: "शिव मंदिर",
            mandirDesc: "एक जीवंत सामुदायिक केंद्र और आध्यात्मिक शरण, शिव मंदिर सभी समुदाय के सदस्यों के लिए पूजा, सांस्कृतिक शिक्षा और धर्मार्थ गतिविधियों की सुविधा प्रदान करता है।"
        },
        team: {
            title: "टीम से मिलें",
            m1Role: "संस्थापक और अध्यक्ष",
            m1Desc: "सभी प्रमुख रणनीतिक पहलों और दीर्घकालिक योजना को चलाने वाले दूरदर्शी नेता।",
            m2Role: "संचालन प्रमुख",
            m2Desc: "दक्षता और अनुपालन सुनिश्चित करते हुए सभी परियोजनाओं के दैनिक संचालन का प्रबंधन करता है।",
            m3Role: "वित्तीय नियंत्रक",
            m3Desc: "वित्तीय अखंडता, संसाधन आवंटन और दाता रिपोर्टिंग की देखरेख करता है।",
            m4Role: "सामुदायिक संपर्क",
            m4Desc: "लाभार्थियों के साथ जुड़ता है और सुनिश्चित करता है कि हमारी परियोजनाएं स्थानीय सामुदायिक आवश्यकताओं को पूरा करती हैं।"
        },
        donation: {
            title: "हमारे मिशन में निवेश करें",
            cardTitle: "सामान्य फाउंडेशन दान",
            cardDesc: "आपका सामान्य दान हमें सभी सुविधाओं को बनाए रखने, प्रशासनिक लागतों को कवर करने और तत्काल सामुदायिक आवश्यकताओं का जवाब देने में मदद करता है।",
            namePlaceholder: "आपका पूरा नाम (दाता सूची के लिए)",
            amountPlaceholder: "दान राशि (जैसे, 5000)",
            oneTime: "एकमुश्त दान",
            monthly: "मासिक दान",
            submit: "भारत फाउंडेशन को दान करें"
        },
        contact: {
            title: "संपर्क में रहें",
            details: "हमारा विवरण",
            connect: "जुड़ें",
            namePlaceholder: "आपका नाम",
            emailPlaceholder: "आपका ईमेल",
            msgPlaceholder: "आपका संदेश",
            send: "संदेश भेजें"
        }
    }
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
