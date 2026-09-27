export interface FaqItem {
  question: string;
  answer: string;
  ownerReview?: boolean;
}

export const FAQS: FaqItem[] = [
  {
    question: "What is Finder Girls Near Me?",
    answer: "Finder Girls Near Me is a location-based directory that helps adults browse independent profile listings by city and area. The site provides discovery and contact tools; it is not a party to private arrangements.",
  },
  {
    question: "Which cities and areas are covered?",
    answer: "Coverage is based on the live locations shown in the menu and Browse by Location section. Select a city to see its currently listed areas and profiles.",
  },
  {
    question: "How do I browse profiles near me?",
    answer: "Choose a city or area from the location menu, or use the homepage location selector. On location pages, search by profile name, city, or area to narrow the visible results.",
  },
  {
    question: "Do I need to register?",
    answer: "Browsing public listings and using the displayed contact buttons does not require an account. Administrative access is separate and is not available to ordinary visitors.",
  },
  {
    question: "How do I contact a listed profile?",
    answer: "Use the Call or WhatsApp button shown on a profile card or detail page. Confirm the number and all relevant details directly before making any decision.",
  },
  {
    question: "Should I call or use WhatsApp?",
    answer: "Use whichever contact method you are comfortable with. WhatsApp opens a chat and Call starts a phone call; neither action submits a registration form on this website.",
  },
  {
    question: "Does the directory charge a browsing fee?",
    answer: "The public directory does not display a fee for browsing profiles. Any private pricing, availability, or arrangement must be confirmed directly and is not set by the directory.",
    ownerReview: true,
  },
  {
    question: "Are listing photos and details verified?",
    answer: "Listings may be reviewed for completeness, but visitors should independently confirm identity, availability, photos, and claims. No online directory can guarantee that every detail remains current.",
    ownerReview: true,
  },
  {
    question: "How often are profiles updated?",
    answer: "Profiles can change as listing information is updated. Check the profile directly and report information that appears outdated or inaccurate.",
  },
  {
    question: "What is the difference between incall and outcall?",
    answer: "These terms generally describe where an independently arranged meeting may take place. Availability and meaning can vary, so confirm details directly and follow all local laws and venue rules.",
    ownerReview: true,
  },
  {
    question: "How is my privacy protected when browsing?",
    answer: "You can browse public pages without creating a visitor account. When contacting a listing through an external phone or messaging service, that provider's privacy terms also apply.",
  },
  {
    question: "What personal information should I avoid sharing?",
    answer: "Do not share passwords, one-time codes, banking credentials, identity documents, or unnecessary personal details. Stop communicating if anyone pressures you to disclose sensitive information.",
  },
  {
    question: "What safety steps should I take before contacting someone?",
    answer: "Confirm details independently, keep control of your transport and finances, tell a trusted person where you are going, and avoid advance transfers to unknown parties. Leave any situation that feels unsafe.",
  },
  {
    question: "How do I report an inaccurate or concerning profile?",
    answer: "Use the site's published contact route and include the profile URL plus a concise description of the issue. Do not include sensitive personal data in a report unless it is necessary.",
  },
  {
    question: "Can a profile owner request an update or removal?",
    answer: "A profile owner can contact the site with the exact listing URL and the requested correction or removal. The owner may be asked for reasonable information to prevent unauthorized changes.",
    ownerReview: true,
  },
  {
    question: "Is this website for adults only?",
    answer: "Yes. The directory is intended only for adults aged 18 or older. Do not use the site if you are under 18, and report any content that may involve a minor immediately.",
    ownerReview: true,
  },
  {
    question: "Does the website guarantee availability?",
    answer: "No. Listing visibility does not guarantee that a person is available or that the contact details are unchanged. Confirm availability directly.",
  },
  {
    question: "Why can an area have no profiles?",
    answer: "Availability varies and some areas may not have an active listing at the moment. Try the parent city, a nearby area, or return later for updated results.",
  },
  {
    question: "How do I search for an area with dots or special characters?",
    answer: "Type the area as it appears, such as B.T.M. The search accepts punctuation and matches names without changing the area's existing URL slug.",
  },
  {
    question: "Are listings and private arrangements legal everywhere?",
    answer: "Laws and local rules vary, and this website does not provide legal advice. Adults are responsible for checking applicable law, acting voluntarily, and avoiding exploitation, coercion, or illegal activity.",
    ownerReview: true,
  },
];

