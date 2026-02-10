// Prohibited and unethical services that are not allowed on SkillSling
export const PROHIBITED_KEYWORDS = [
    // Adult/Sexual services
    'prostitution', 'escort', 'massage parlor', 'adult entertainment', 'strip', 'exotic dance',
    'sexual', 'intimate', 'sensual massage', 'happy ending', 'erotic',

    // Illegal activities
    'drug', 'marijuana', 'cannabis', 'cocaine', 'heroin', 'meth', 'narcotics',
    'weapon', 'gun', 'firearm', 'ammunition', 'explosive',
    'counterfeit', 'fake id', 'fake document', 'forgery',
    'hacking', 'hack', 'ddos', 'phishing', 'scam',
    'stolen', 'theft', 'robbery', 'burglary',

    // Harmful services
    'hitman', 'assassin', 'murder', 'violence',
    'pyramid scheme', 'ponzi', 'mlm scam',
    'human trafficking', 'slavery',

    // Gambling (in most jurisdictions)
    'illegal gambling', 'underground casino',

    // Other unethical
    'plagiarism', 'essay writing service', 'exam cheating',
    'fake review', 'bot', 'spam service'
];

export const validateServiceName = (serviceName) => {
    const lowerService = serviceName.toLowerCase();

    for (const keyword of PROHIBITED_KEYWORDS) {
        if (lowerService.includes(keyword)) {
            return {
                isValid: false,
                reason: `This service is not allowed on SkillSling. We prohibit services related to: ${keyword}`
            };
        }
    }

    return { isValid: true };
};

export const ETHICAL_GUIDELINES = `
SkillSling Ethical Service Guidelines:

✅ ALLOWED SERVICES:
- Professional services (plumbing, electrical, cleaning, etc.)
- Beauty and wellness (salons, barbers, spas)
- Education and tutoring
- Home services and repairs
- Technology and IT services
- Creative services (photography, design, etc.)
- Event planning and catering
- Fitness and personal training
- Business and consulting services
- Any legal, ethical professional service

❌ PROHIBITED SERVICES:
- Adult entertainment or sexual services
- Illegal drugs or controlled substances
- Weapons, firearms, or explosives
- Counterfeit goods or fake documents
- Hacking or illegal computer services
- Stolen goods or illegal activities
- Violence or harmful services
- Pyramid schemes or scams
- Human trafficking or exploitation
- Any illegal or unethical activities

⚠️ CONSEQUENCES:
- Accounts offering prohibited services will be permanently banned
- Services will be reported to authorities if illegal
- No refunds for banned accounts

By using SkillSling, you agree to only offer and request legal, ethical services.
`;
