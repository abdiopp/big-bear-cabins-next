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
