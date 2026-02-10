export const SERVICE_CATEGORIES = {
    BEAUTY: 'Beauty & Personal Care',
    HOME: 'Home Services',
    HEALTH: 'Health & Wellness',
    AUTO: 'Automotive',
    TECH: 'Technology',
    EDUCATION: 'Education & Training',
    EVENTS: 'Events & Entertainment',
    BUSINESS: 'Business Services',
    FOOD: 'Food & Catering',
    FITNESS: 'Fitness & Sports',
    CREATIVE: 'Creative Services',
    REPAIR: 'Repair & Maintenance',
};

export const SERVICES_LIST = [
    // Beauty & Personal Care
    { id: 1, name: 'Hair Salon', category: 'BEAUTY' },
    { id: 2, name: 'Barber Shop', category: 'BEAUTY' },
    { id: 3, name: 'Nail Salon', category: 'BEAUTY' },
    { id: 4, name: 'Makeup Artist', category: 'BEAUTY' },
    { id: 5, name: 'Spa Services', category: 'BEAUTY' },
    { id: 6, name: 'Massage Therapy', category: 'BEAUTY' },
    { id: 7, name: 'Facial Treatment', category: 'BEAUTY' },
    { id: 8, name: 'Waxing Services', category: 'BEAUTY' },
    { id: 9, name: 'Eyebrow Threading', category: 'BEAUTY' },
    { id: 10, name: 'Eyelash Extensions', category: 'BEAUTY' },

    // Home Services
    { id: 11, name: 'House Cleaning', category: 'HOME' },
    { id: 12, name: 'Plumbing', category: 'HOME' },
    { id: 13, name: 'Electrician', category: 'HOME' },
    { id: 14, name: 'Carpentry', category: 'HOME' },
    { id: 15, name: 'Painting', category: 'HOME' },
    { id: 16, name: 'Landscaping', category: 'HOME' },
    { id: 17, name: 'Pest Control', category: 'HOME' },
    { id: 18, name: 'HVAC Services', category: 'HOME' },
    { id: 19, name: 'Roofing', category: 'HOME' },
    { id: 20, name: 'Interior Design', category: 'HOME' },

    // Health & Wellness
    { id: 21, name: 'Physiotherapy', category: 'HEALTH' },
    { id: 22, name: 'Nutritionist', category: 'HEALTH' },
    { id: 23, name: 'Yoga Instructor', category: 'HEALTH' },
    { id: 24, name: 'Mental Health Counseling', category: 'HEALTH' },
    { id: 25, name: 'Chiropractor', category: 'HEALTH' },
    { id: 26, name: 'Acupuncture', category: 'HEALTH' },
    { id: 27, name: 'Home Nursing', category: 'HEALTH' },

    // Automotive
    { id: 28, name: 'Car Wash', category: 'AUTO' },
    { id: 29, name: 'Auto Repair', category: 'AUTO' },
    { id: 30, name: 'Car Detailing', category: 'AUTO' },
    { id: 31, name: 'Tire Services', category: 'AUTO' },
    { id: 32, name: 'Oil Change', category: 'AUTO' },
    { id: 33, name: 'Car Towing', category: 'AUTO' },

    // Technology
    { id: 34, name: 'Computer Repair', category: 'TECH' },
    { id: 35, name: 'Phone Repair', category: 'TECH' },
    { id: 36, name: 'Web Development', category: 'TECH' },
    { id: 37, name: 'Graphic Design', category: 'TECH' },
    { id: 38, name: 'IT Support', category: 'TECH' },
    { id: 39, name: 'Software Development', category: 'TECH' },
    { id: 40, name: 'Social Media Management', category: 'TECH' },

    // Education & Training
    { id: 41, name: 'Private Tutoring', category: 'EDUCATION' },
    { id: 42, name: 'Music Lessons', category: 'EDUCATION' },
    { id: 43, name: 'Language Classes', category: 'EDUCATION' },
    { id: 44, name: 'Dance Classes', category: 'EDUCATION' },
    { id: 45, name: 'Art Classes', category: 'EDUCATION' },
    { id: 46, name: 'Driving Lessons', category: 'EDUCATION' },

    // Events & Entertainment
    { id: 47, name: 'Event Planning', category: 'EVENTS' },
    { id: 48, name: 'Photography', category: 'EVENTS' },
    { id: 49, name: 'Videography', category: 'EVENTS' },
    { id: 50, name: 'DJ Services', category: 'EVENTS' },
    { id: 51, name: 'Catering', category: 'EVENTS' },
    { id: 52, name: 'Party Decoration', category: 'EVENTS' },
    { id: 53, name: 'Live Music', category: 'EVENTS' },

    // Business Services
    { id: 54, name: 'Accounting', category: 'BUSINESS' },
    { id: 55, name: 'Legal Services', category: 'BUSINESS' },
    { id: 56, name: 'Marketing Consulting', category: 'BUSINESS' },
    { id: 57, name: 'Virtual Assistant', category: 'BUSINESS' },
    { id: 58, name: 'Translation Services', category: 'BUSINESS' },

    // Food & Catering
    { id: 59, name: 'Personal Chef', category: 'FOOD' },
    { id: 60, name: 'Meal Prep Services', category: 'FOOD' },
    { id: 61, name: 'Baking Services', category: 'FOOD' },
    { id: 62, name: 'Food Delivery', category: 'FOOD' },

    // Fitness & Sports
    { id: 63, name: 'Personal Trainer', category: 'FITNESS' },
    { id: 64, name: 'Sports Coaching', category: 'FITNESS' },
    { id: 65, name: 'Swimming Instructor', category: 'FITNESS' },

    // Creative Services
    { id: 66, name: 'Content Writing', category: 'CREATIVE' },
    { id: 67, name: 'Video Editing', category: 'CREATIVE' },
    { id: 68, name: 'Voice Over', category: 'CREATIVE' },
    { id: 69, name: 'Animation', category: 'CREATIVE' },

    // Repair & Maintenance
    { id: 70, name: 'Appliance Repair', category: 'REPAIR' },
    { id: 71, name: 'Phone Screen Repair', category: 'REPAIR' },
    { id: 72, name: 'Furniture Repair', category: 'REPAIR' },
    { id: 73, name: 'Watch Repair', category: 'REPAIR' },
    { id: 74, name: 'Shoe Repair', category: 'REPAIR' },
    { id: 75, name: 'Tailoring & Alterations', category: 'REPAIR' },
];

export const getServicesByCategory = (category) => {
    return SERVICES_LIST.filter(service => service.category === category);
};

export const getServiceById = (id) => {
    return SERVICES_LIST.find(service => service.id === id);
};

export const getServiceByName = (name) => {
    return SERVICES_LIST.find(service => service.name.toLowerCase() === name.toLowerCase());
};
