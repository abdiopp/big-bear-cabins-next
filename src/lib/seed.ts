import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const OFFERS_DATA = [
  {
    slug: "oktoberfest",
    badgeLabel: "15% Off",
    promoCode: "OKTOBERFEST",
    discount: "15% Off",
    icon: "Beer",
    heroImage: "https://images.unsplash.com/photo-1669778631871-7bb6d5411c4b?w=1200&h=600&fit=crop",
    offerImage: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
    offerTitle: "BIG BEAR OKTOBERFEST",
    offerSubtitle: "Traditional Celebration",
    offerDescription: "Join us for an authentic German celebration in the heart of Big Bear! Experience traditional Bavarian festivities with live music, delicious authentic foods, and craft brews.",
    longDescription: "Immerse yourself in the rich traditions of Oktoberfest without leaving the mountains. Our Big Bear Oktoberfest celebration brings authentic German culture to the San Bernardino Mountains with live oompah bands, traditional dancers, and a festive atmosphere that rivals Munich itself. Book your cabin now and enjoy exclusive savings while experiencing this unforgettable cultural event.",
    dates: "September 20-22, 2025",
    location: "Big Bear Village Convention Center",
    features: [
      "Live German oompah band performances",
      "Traditional Bavarian dancers and entertainment",
      "Authentic German cuisine and artisan sausages",
      "Premium craft beer selection from local and German breweries",
      "Family-friendly activities and games",
      "Costume contests with prizes",
      "Exclusive cabin guest discount vouchers",
      "Free shuttle service from participating cabins",
    ],
    inclusions: [
      "15% off cabin rental for event weekend",
      "2 complimentary event tickets per cabin",
      "Priority seating reservations",
      "Special breakfast package available",
    ],
    images: [
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1669778631871-7bb6d5411c4b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585803114088-cd027272106a?w=400&h=300&fit=crop",
    ]
  },
  {
    slug: "yoga-festival",
    badgeLabel: "Wellness Package",
    promoCode: "YOGABLISS",
    discount: "Wellness Package",
    icon: "Mountain",
    heroImage: "https://images.unsplash.com/photo-1641745143915-a433c508348d?w=1200&h=600&fit=crop",
    offerImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    offerTitle: "YOGA FESTIVAL",
    offerSubtitle: "10/4",
    offerDescription: "Find your zen in the mountains. Restore your mind, body, and soul with guided sessions surrounded by nature's beauty.",
    longDescription: "Escape to the tranquil mountains of Big Bear for a transformative yoga and wellness experience. Our annual Yoga Festival brings together renowned instructors, holistic practitioners, and wellness enthusiasts for a day of rejuvenation, meditation, and mountain-fresh inspiration. Practice sunrise yoga with panoramic lake views, attend workshops on mindfulness and healthy living, and connect with a community of like-minded souls.",
    dates: "October 4, 2025",
    location: "Big Bear Lake Waterfront Park",
    features: [
      "Multiple yoga sessions for all skill levels",
      "Guided meditation and breathwork classes",
      "Outdoor sessions with lake and mountain views",
      "Wellness workshops and seminars",
      "Healthy food vendors and smoothie bar",
      "Sound healing sessions",
      "Aromatherapy and essential oils station",
      "Sunset meditation on the lake",
    ],
    inclusions: [
      "Wellness package discount on cabin stays",
      "Complimentary festival admission",
      "Yoga mat and water bottle provided",
      "Healthy breakfast basket in cabin",
    ],
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1641745143915-a433c508348d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585803114088-cd027272106a?w=400&h=300&fit=crop",
    ]
  },
  {
    slug: "third-night-free",
    badgeLabel: "33% Savings",
    promoCode: "STAY3FREE",
    discount: "33% Savings",
    icon: "Gift",
    heroImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop",
    offerImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    offerTitle: "3RD NIGHT FREE!",
    offerSubtitle: "Extended Stay Special",
    offerDescription: "Stay 2 nights, get the 3rd absolutely FREE! Perfect for long weekends and extra relaxation time in your mountain retreat.",
    longDescription: "Why rush your mountain getaway? With our 3rd Night Free special, you can extend your stay and truly unwind without breaking the bank. This incredible offer gives you 33% off your total stay, allowing you more time to explore Big Bear's trails, enjoy the lake, and simply relax in your cozy cabin. Whether it's a romantic long weekend or a family adventure, this deal makes it easy to stay longer.",
    dates: "Valid Sunday-Thursday (excluding holidays)",
    location: "All participating Big Bear Cabins",
    features: [
      "Applicable to any cabin in our collection",
      "Valid for midweek stays (Sunday-Thursday)",
      "Can be combined with extended stays",
      "Flexible check-in and check-out times",
      "Access to all cabin amenities for 3 nights",
      "Welcome gift basket included",
      "Late checkout available on 3rd night",
      "Extra time to explore local attractions",
    ],
    inclusions: [
      "3rd night completely free",
      "All standard cabin amenities",
      "Complimentary firewood bundle",
      "Local activities guide and discount coupons",
    ],
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585803114088-cd027272106a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    ]
  },
  {
    slug: "midweek-discount",
    badgeLabel: "25% Off",
    promoCode: "MIDWEEK25",
    discount: "25% Off",
    icon: "Percent",
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop",
    offerImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    offerTitle: "25% OFF MIDWEEK",
    offerSubtitle: "Monday - Thursday",
    offerDescription: "Escape the crowds and enjoy peaceful mountain serenity. Midweek stays offer the perfect work-from-cabin experience.",
    longDescription: "Experience Big Bear at its most peaceful with our exclusive midweek discount. Skip the weekend crowds and enjoy a more serene mountain escape. Perfect for remote workers, digital nomads, or anyone seeking a quiet retreat, our cabins offer high-speed internet, comfortable workspaces, and all the amenities you need. Take advantage of emptier trails, quieter restaurants, and a more authentic mountain experience—all while saving 25%.",
    dates: "Year-round (Monday-Thursday arrivals)",
    location: "Select Big Bear Cabins",
    features: [
      "High-speed WiFi for remote work",
      "Dedicated workspace in cabin",
      "Peaceful environment with fewer tourists",
      "Easy access to hiking trails and nature",
      "Local restaurants less crowded",
      "Better availability and cabin selection",
      "Extended quiet hours",
      "Flexible check-in times",
    ],
    inclusions: [
      "25% off nightly rate Monday-Thursday",
      "Complimentary coffee and tea service",
      "Office supply kit available upon request",
      "Free upgrade to larger cabin (subject to availability)",
    ],
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1663850365903-2f6b8a6a29d3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585803114088-cd027272106a?w=400&h=300&fit=crop",
    ]
  },
  {
    slug: "kodiak-ultra",
    badgeLabel: "Runner Special",
    promoCode: "KODIAK2025",
    discount: "Runner Special",
    icon: "Dumbbell",
    heroImage: "https://images.unsplash.com/photo-1613953294671-977cfceec099?w=1200&h=600&fit=crop",
    offerImage: "https://images.unsplash.com/photo-1613953294671-977cfceec099?w=400&h=300&fit=crop",
    offerTitle: "KODIAK ULTRA MARATHON",
    offerSubtitle: "September Event",
    offerDescription: "Push your limits in the mountains! Book your recovery cabin for the ultimate ultra marathon experience. Rest and recharge after conquering the trails.",
    longDescription: "Prepare for the ultimate test of endurance with the Kodiak Ultra Marathon, set against Big Bear's stunning mountain backdrop. This challenging course takes runners through stunning alpine terrain, offering breathtaking views and serious elevation challenges. Book your cabin as your pre-race headquarters and post-race recovery sanctuary. We understand what athletes need—comfortable beds, hot tubs for recovery, and kitchens to fuel your performance.",
    dates: "September 13-15, 2025",
    location: "Big Bear Lake Trail System",
    features: [
      "50K, 50-mile, and 100-mile race options",
      "Scenic alpine trail courses",
      "Multiple aid stations throughout course",
      "Professional timing and medals",
      "Post-race celebration and awards",
      "Trained medical staff on course",
      "Spectacular mountain views",
      "Challenging elevation profile for serious runners",
    ],
    inclusions: [
      "Special runner's rate on cabin bookings",
      "Early check-in for pre-race prep",
      "Late checkout for recovery",
      "Complimentary race registration discount",
      "In-cabin recovery kit (foam roller, ice packs)",
      "Healthy meal delivery options available",
    ],
    images: [
      "https://images.unsplash.com/photo-1613953294671-977cfceec099?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1585803114088-cd027272106a?w=400&h=300&fit=crop",
    ]
  },
  {
    slug: "run-revel",
    badgeLabel: "Race Package",
    promoCode: "REVEL2025",
    discount: "Race Package",
    icon: "Waves",
    heroImage: "https://images.unsplash.com/photo-1617428436811-055267a14013?w=1200&h=600&fit=crop",
    offerImage: "https://images.unsplash.com/photo-1617428436811-055267a14013?w=400&h=300&fit=crop",
    offerTitle: "RUN REVEL BIG BEAR",
    offerSubtitle: "11/8",
    offerDescription: "Run the scenic downhill course through Big Bear! Secure your cabin for race weekend and enjoy the perfect mountain running experience.",
    longDescription: "Experience one of California's most scenic and fastest marathon courses with Run Revel Big Bear. This Boston-qualifying downhill marathon takes you through stunning mountain landscapes with over 4,500 feet of elevation loss. It's a runner's dream—breathtaking scenery, excellent organization, and the opportunity to achieve a PR. Book your cabin early for race weekend and make this event truly memorable.",
    dates: "November 8, 2025",
    location: "Big Bear to San Bernardino (point-to-point)",
    features: [
      "Boston-qualifying downhill marathon course",
      "Over 4,500 feet elevation loss",
      "Stunning mountain-to-valley scenery",
      "Half marathon option available",
      "Chip-timed with live tracking",
      "Finisher medals and awards",
      "Post-race party and food",
      "Free race photos for participants",
    ],
    inclusions: [
      "Race weekend cabin package discount",
      "Complimentary shuttle to race start",
      "Pre-race pasta dinner option",
      "Post-race recovery amenities in cabin",
      "$10 race registration discount code",
      "Runner's welcome basket",
    ],
    images: [
      "https://images.unsplash.com/photo-1617428436811-055267a14013?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1613953294671-977cfceec099?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    ]
  }
];

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { role: "admin" },
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("Admin user created/updated:", admin);

  // Seed HomeHero
  const homeHeroIdx = await prisma.homeHero.findFirst();
  if (!homeHeroIdx) {
    await prisma.homeHero.create({
      data: {
        heading: "Welcome to Big Bear Cabins",
        images: [
          { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" }
        ],
        links: [
          { url: "/cabins", text: "Book Now", icon: "https://example.com/icon.png" }
        ]
      }
    });
    console.log("HomeHero seeded");
  }

  // Seed CouponSection - Clear existing to avoid schema validation errors on old data
  await prisma.couponSection.deleteMany({});

  await prisma.couponSection.create({
    data: {
      carouselTitle: "Special Offers",
      viewAllBtnLabel: "View All Offers",
      viewAllBtnUrl: "/offers",
      offers: OFFERS_DATA
    }
  });
  console.log("CouponSection seeded (recreated)");

  // Seed ExperiencesPage (idempotent)
  const existingExpPage = await prisma.experiencesPage.findFirst();
  if (!existingExpPage) {
    const defaultFields = [
      { id: "f1", label: "Name", name: "name", type: "text", placeholder: "Your full name", required: true, options: [], order: 0 },
      { id: "f2", label: "Email", name: "email", type: "email", placeholder: "your.email@example.com", required: true, options: [], order: 1 },
      { id: "f3", label: "Reservation Number", name: "reservation_number", type: "text", placeholder: "Your cabin reservation number", required: true, options: [], order: 2 },
      { id: "f4", label: "Special Request", name: "special_request", type: "text", placeholder: "Any special requirements or requests", required: false, options: [], order: 3 },
    ];

    const popularCards = [
      { id: "p1", title: "Alpine Tour", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$95.00", date: "June 15, 2026", time: "9:00 am – 2:00 pm", includes: ["Guided alpine trail tour", "Professional photography session", "Picnic lunch at scenic overlook", "Transportation to/from cabin", "Souvenir trail map"], description: "Explore the stunning alpine trails of Big Bear with our expert guides! This full-day adventure takes you through breathtaking mountain scenery, past hidden waterfalls, and to panoramic viewpoints. Perfect for nature lovers and photography enthusiasts alike.", isPopular: true, isActive: true, order: 0, fields: defaultFields },
      { id: "p2", title: "Off-road Tours", image: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=600&h=400&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$120.00", date: "June 20, 2026", time: "10:00 am – 3:00 pm", includes: ["4x4 Jeep off-road adventure", "Professional trail guide", "Snacks & refreshments", "Photo opportunities at scenic stops", "Safety equipment provided"], description: "Buckle up for an adrenaline-pumping off-road adventure through the rugged terrain of Big Bear!", isPopular: true, isActive: true, order: 1, fields: defaultFields },
      { id: "p3", title: "Kayaking Tour", image: "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=600&h=400&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$75.00", date: "June 22, 2026", time: "8:00 am – 12:00 pm", includes: ["Kayak & paddle rental", "Life jacket & safety briefing", "Guided lake tour", "Waterproof camera bag", "Post-tour hot cocoa"], description: "Glide across the crystal-clear waters of Big Bear Lake on this guided kayaking tour!", isPopular: true, isActive: true, order: 2, fields: defaultFields },
    ];

    const allCards = [
      { id: "a1", title: "Jeep Off-Road Tours", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$120.00", date: "Available Daily", time: "10:00 am – 3:00 pm", includes: ["4x4 Jeep adventure", "Professional guide", "Snacks & drinks", "Safety gear provided"], description: "Navigate rugged mountain trails in our top-of-the-line 4x4 vehicles.", isPopular: false, isActive: true, order: 3, fields: defaultFields },
      { id: "a2", title: "Indoor Skydiving", image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$89.00", date: "Available Daily", time: "11:00 am – 5:00 pm", includes: ["Flight suit & gear", "Training session", "2 flight sessions", "Certificate of completion"], description: "Feel the rush of freefall without jumping from a plane!", isPopular: false, isActive: true, order: 4, fields: defaultFields },
      { id: "a3", title: "Horseback Riding", image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$95.00", date: "Available Daily", time: "9:00 am – 1:00 pm", includes: ["Gentle trail horse", "Experienced guide", "Scenic mountain trail", "Photo opportunities"], description: "Saddle up and explore Big Bear's beautiful mountain trails on horseback.", isPopular: false, isActive: true, order: 5, fields: defaultFields },
      { id: "a4", title: "Kayaking", image: "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$65.00", date: "Available Daily", time: "8:00 am – 6:00 pm", includes: ["Kayak & paddle", "Life jacket", "Safety briefing", "Lake access"], description: "Paddle across the crystal-clear waters of Big Bear Lake.", isPopular: false, isActive: true, order: 6, fields: defaultFields },
      { id: "a5", title: "Jet Ski Rental", image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$110.00", date: "Available Daily", time: "9:00 am – 5:00 pm", includes: ["Jet ski rental – 1 hr", "Safety briefing", "Life jacket", "Fuel included"], description: "Feel the thrill of speeding across Big Bear Lake on a jet ski!", isPopular: false, isActive: true, order: 7, fields: defaultFields },
      { id: "a6", title: "Zipline Tours", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$85.00", date: "Available Daily", time: "10:00 am – 4:00 pm", includes: ["Multiple zipline runs", "Safety harness & helmet", "Trained guide", "Treetop views"], description: "Soar through the treetops on our exciting zipline course!", isPopular: false, isActive: true, order: 8, fields: defaultFields },
      { id: "a7", title: "Sailing / Boat Rentals", image: "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$150.00", date: "Available Daily", time: "8:00 am – 6:00 pm", includes: ["Boat rental – half day", "Safety equipment", "Lake map", "Fishing rod (optional)"], description: "Set sail on Big Bear Lake!", isPopular: false, isActive: true, order: 9, fields: defaultFields },
      { id: "a8", title: "Nature Walks", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$45.00", date: "Available Daily", time: "7:00 am – 11:00 am", includes: ["Guided walk", "Wildlife spotting", "Plant identification", "Trail snacks"], description: "Join our naturalist guides for a peaceful walk through Big Bear's diverse ecosystems.", isPopular: false, isActive: true, order: 10, fields: defaultFields },
      { id: "a9", title: "Fly Fishing", image: "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$100.00", date: "Available Daily", time: "6:00 am – 12:00 pm", includes: ["Rod & tackle provided", "Expert fishing guide", "Waders & boots", "Catch & release gear"], description: "Cast your line in Big Bear's pristine streams and rivers.", isPopular: false, isActive: true, order: 11, fields: defaultFields },
      { id: "a10", title: "Mountain Biking", image: "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$80.00", date: "Available Daily", time: "8:00 am – 4:00 pm", includes: ["Mountain bike rental", "Helmet & gloves", "Trail map", "Repair kit"], description: "Hit the trails on two wheels!", isPopular: false, isActive: true, order: 12, fields: defaultFields },
      { id: "a11", title: "Alpine Slide", image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$35.00", date: "Available Daily", time: "10:00 am – 6:00 pm", includes: ["Unlimited slides – 2 hrs", "Scenic chairlift ride", "Safety briefing", "Fun for all ages"], description: "Race down the mountain on Big Bear's famous alpine slide!", isPopular: false, isActive: true, order: 13, fields: defaultFields },
      { id: "a12", title: "Rock Climbing", image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$90.00", date: "Available Daily", time: "9:00 am – 3:00 pm", includes: ["Climbing gear rental", "Certified instructor", "Multiple routes", "Belay support"], description: "Scale the granite faces of Big Bear's stunning rock formations.", isPopular: false, isActive: true, order: 14, fields: defaultFields },
      { id: "a13", title: "Paintball", image: "https://images.unsplash.com/photo-1565711561500-49678a10a63f?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$55.00", date: "Available Daily", time: "10:00 am – 5:00 pm", includes: ["Marker & mask rental", "200 paintballs", "Chest protector", "Forest battlefield access"], description: "Battle it out in Big Bear's outdoor paintball arena!", isPopular: false, isActive: true, order: 15, fields: defaultFields },
      { id: "a14", title: "Yoga Retreats", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$70.00", date: "Weekends", time: "7:00 am – 10:00 am", includes: ["Yoga mat provided", "Certified instructor", "Mountain-view session", "Herbal tea"], description: "Find your inner peace with a yoga session surrounded by Big Bear's magnificent mountain scenery.", isPopular: false, isActive: true, order: 16, fields: defaultFields },
      { id: "a15", title: "Snowshoeing", image: "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$60.00", date: "Winter Season", time: "9:00 am – 1:00 pm", includes: ["Snowshoe rental", "Guided trail tour", "Hot chocolate stop", "Winter wildlife spotting"], description: "Trek through Big Bear's winter wonderland on snowshoes!", isPopular: false, isActive: true, order: 17, fields: defaultFields },
      { id: "a16", title: "Wildlife Safaris", image: "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$85.00", date: "Available Daily", time: "6:00 am – 10:00 am", includes: ["Expert naturalist guide", "Binoculars provided", "Wildlife identification book", "Light breakfast"], description: "Discover Big Bear's amazing wildlife on a guided safari!", isPopular: false, isActive: true, order: 18, fields: defaultFields },
      { id: "a17", title: "Para Gliding", image: "https://images.unsplash.com/photo-1503416997304-7f8bf166c121?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$175.00", date: "Weather Permitting", time: "10:00 am – 4:00 pm", includes: ["Tandem flight with instructor", "All safety equipment", "GoPro video recording", "Certificate"], description: "Soar like an eagle over Big Bear!", isPopular: false, isActive: true, order: 19, fields: defaultFields },
      { id: "a18", title: "Star Gazing", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$50.00", date: "Clear Nights", time: "8:00 pm – 11:00 pm", includes: ["Professional telescope access", "Astronomy guide", "Star chart", "Hot beverages"], description: "Big Bear's high altitude and clear skies make it perfect for stargazing.", isPopular: false, isActive: true, order: 20, fields: defaultFields },
      { id: "a19", title: "Scenic Helicopter Rides", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$250.00", date: "Available Daily", time: "9:00 am – 5:00 pm", includes: ["20-minute scenic flight", "Pilot narration", "Window seat guaranteed", "Photo opportunities"], description: "See Big Bear from the sky on a breathtaking helicopter tour!", isPopular: false, isActive: true, order: 21, fields: defaultFields },
      { id: "a20", title: "Photography Tours", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop", subtitle: "Experience Package – Available with a Big Bear Vacations Cabin Rental", cost: "$95.00", date: "Available Daily", time: "6:00 am – 10:00 am", includes: ["Professional photographer guide", "Best scenic locations", "Tips & techniques", "Digital photo sharing"], description: "Capture Big Bear's stunning beauty with a professional photographer as your guide!", isPopular: false, isActive: true, order: 22, fields: defaultFields },
    ];

    await prisma.experiencesPage.create({
      data: {
        heroTitle: "We've got the",
        heroSubtitle: "Custom Experiences in Big Bear",
        heroTagline: "you're looking for!",
        heroDescription: "",
        heroImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&h=700&fit=crop",
        heroCtaText: "",
        heroCtaLink: "",
        heroIsActive: true,
        isPublished: true,
        formCards: [...popularCards, ...allCards],
      },
    });
    console.log("ExperiencesPage seeded with", popularCards.length + allCards.length, "cards");
  } else {
    console.log("ExperiencesPage already exists, skipping seed");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
