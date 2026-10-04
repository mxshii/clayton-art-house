// Clayton Art House — High-Fidelity Local Persistent Store
// Seeds realistic Alexandria Kafr Abdo data and enforces atomic capacity logic
// Synchronized with localStorage so all admin and customer actions persist.

import {
  Workshop,
  Session,
  Booking,
  Customer,
  Payment,
  PrivateEventInquiry,
  GalleryImage,
  SiteSettings,
  BookingCreationInput,
  BookingCreationResult,
  AdminUserRecord
} from '../types';

const STORAGE_KEY_PREFIX = 'clayton_arthouse_v3_';

const initialSettings: SiteSettings = {
  id: '11111111-1111-1111-1111-111111111111',
  venueName: 'Clayton Art House',
  tagline: 'A Creative Workshop Space in Kafr Abdo',
  addressLine1: '14 Rue Ahmed Zulfikar, Kafr Abdo',
  city: 'Alexandria',
  country: 'Egypt',
  phone: '042780500',
  email: 'hello@claytonarthouse.com',
  instagram: '@clayton.arthouse',
  facebook: 'facebook.com/claytonarthouse',
  openingHours: 'Tuesday – Sunday: 10:00 AM – 10:00 PM (Closed Mondays)',
  bookingLeadHours: 4,
  cancellationPolicy: 'Cancellations made 24 hours prior to the session start receive a 100% venue credit or reschedule. No-shows are non-refundable.',
  updatedAt: new Date().toISOString()
};

const initialAdmins: AdminUserRecord[] = [
  {
    id: '22222222-2222-2222-2222-222222222222',
    username: 'superadmin',
    email: 'admin@claytonarthouse.com',
    role: 'super_admin',
    status: 'active',
    fullName: 'Clayton Studio Director',
    lastSignInAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222223',
    username: 'nour.ceramics',
    email: 'nour@claytonarthouse.com',
    role: 'admin',
    status: 'active',
    fullName: 'Nour El-Din (Studio Manager)',
    lastSignInAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  }
];

const initialWorkshops: Workshop[] = [
  {
    "id": "33333333-3333-3333-3333-000000000001",
    "title": "Pottery session",
    "slug": "pottery-session",
    "category": "Pottery & Ceramics",
    "shortDescription": "Shape organic vessels on the electric pottery wheel with hands-on mentor guidance.",
    "description": "🏺 Pottery Workshop — Shape, Create & Connect Get your hands into the clay and let your creativity take shape. In this hands-on pottery workshop, you’ll discover the beauty of working with clay, learn the basics of shaping and forming, and create your own unique handmade piece. No previous experience is needed — just come with an open mind, get your hands dirty, and enjoy the simple, grounding experience of creating something from nothing. ✨ **What you’ll experience:** * Learn the basics of working with clay * Explore shaping, molding, and hand-building techniques * Create your own unique pottery piece * Enjoy a slow, mindful, hands-on creative experience * Take home something made by your own hands **Touch the earth. Shape your ideas. Create something that’s yours. 🤎**",
    "priceEgp": 350,
    "durationMinutes": 59,
    "capacityPerSession": 5,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/f02e4d00-ac2b-4cb4-91d1-5ec0d0f832e8-01M0YMGJ7DZM4VEP9B4WN7CFJ5.webp",
    "additionalImages": [
      "/assets/clayton/workshops/f02e4d00-ac2b-4cb4-91d1-5ec0d0f832e8-01M0YMGJ7DZM4VEP9B4WN7CFJ5.webp"
    ],
    "isPublished": true,
    "isFeatured": true,
    "sortOrder": 1,
    "serviceId": 1,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000003",
    "title": "Painting",
    "slug": "painting",
    "category": "Painting & Drawing",
    "shortDescription": "Express your creative ideas on canvas with acrylics and mixed media in an inspiring setting.",
    "description": "Painting Workshop Introduction: Welcome to our painting workshop, where creativity has no limits. This workshop is a great opportunity to explore different painting techniques, express your ideas, and discover your artistic talent in a fun and inspiring environment. Whether you are a beginner or an experienced artist, everyone is welcome to enjoy the process of creating art.",
    "priceEgp": 240,
    "durationMinutes": 120,
    "capacityPerSession": 10,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/eae30be2-a30d-4786-8ee5-099a04ff3099-01M0N3H3D6CCK1B78A4WMFTQ5G.webp",
    "additionalImages": [
      "/assets/clayton/workshops/eae30be2-a30d-4786-8ee5-099a04ff3099-01M0N3H3D6CCK1B78A4WMFTQ5G.webp",
      "/assets/clayton/workshops/a6479471-c832-4b0a-aca8-c72a721b6caf-01M0TKE6SSJWPK9C5E252FS8Q2.webp",
      "/assets/clayton/workshops/f31cdec2-d1f2-42e5-9cd9-d80c3e74dca1-01M0TKE7YB49G1X42ECHCF1GE1.webp",
      "/assets/clayton/workshops/130456fd-f0d6-4d67-9763-470760b869b3-01M0TKE93TXTDQA0SNGH3AQ95P.webp",
      "/assets/clayton/workshops/e4f45cf2-edfc-4069-9c20-5fabcc4042cc-01M0TKE9Y741XHRAPMN2RYWH5M.webp",
      "/assets/clayton/workshops/0be2314f-783d-4dec-8de1-95aac1ef79be-01M0TKEB5EZGKHQYATFZBKPJBE.webp",
      "/assets/clayton/workshops/7d6a421d-6bcc-41b6-86c4-0fc8fe6108a8-01M0TKEBZD669NDFA8KJKE42AS.webp",
      "/assets/clayton/workshops/59d9edaa-8011-400c-9ad4-a4b00a3d3ea4-01M0TKECXZSXK4FJ6YXP8D3YEP.webp",
      "/assets/clayton/workshops/99b89665-7a8d-452d-924d-9733041f80ba-01M0TKEE6S7D6HXTT7CANS6331.webp"
    ],
    "isPublished": true,
    "isFeatured": true,
    "sortOrder": 2,
    "serviceId": 3,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000004",
    "title": "Candle Workshop",
    "slug": "candle-workshop",
    "category": "Candle Craft",
    "shortDescription": "Blend pure fragrance oils with natural wax and hand-pour your custom scented candle.",
    "description": "🕯️ Candle Making Workshop — Pour, Create & Glow Slow down, get creative, and discover the art of making your own candle from scratch. In this hands-on workshop, you’ll explore the basics of candle making, choose your favorite scents, experiment with colors and details, and create a candle that reflects your own style. No previous experience is needed — just bring your creativity and let the process unfold. ✨ **What you’ll experience:** * Learn the basics of candle making * Explore different scents and fragrances * Choose your own colors and creative details * Create your own handmade candle * Enjoy a relaxing and mindful creative experience * Take home a candle made by you **Pour your creativity. Light your senses. Take home your glow. 🕯️✨**",
    "priceEgp": 600,
    "durationMinutes": 120,
    "capacityPerSession": 10,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/ff2ccc5c-7a33-4f65-8b93-b73022766d5d-01M11CKAD8CW9639K0FH4KQN9B.webp",
    "additionalImages": [
      "/assets/clayton/workshops/ff2ccc5c-7a33-4f65-8b93-b73022766d5d-01M11CKAD8CW9639K0FH4KQN9B.webp"
    ],
    "isPublished": true,
    "isFeatured": true,
    "sortOrder": 3,
    "serviceId": 4,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000005",
    "title": "Crochet Workshop",
    "slug": "crochet-workshop",
    "category": "Fiber & Textiles",
    "shortDescription": "Discover foundational crochet stitches and create a handmade textile piece.",
    "description": "🧶 Crochet Workshop — Create, Stitch & Unwind Slow down, get creative, and discover the art of crochet in a warm and inspiring hands-on workshop. Whether you’re a complete beginner or already familiar with the basics, this session is all about learning, creating, and enjoying the process. You’ll explore simple crochet techniques, learn how to work with yarn and hooks, and create your own handmade piece to take home. No experience is needed — just bring your curiosity and let your hands do the creating. ✨ **What you’ll experience:** * Learn the basics of crochet * Explore stitches, patterns, and techniques * Create your own handmade piece * Enjoy a relaxing, mindful creative experience * Take home something made entirely by you **Come as you are. Leave with something you created. 🧶✨**",
    "priceEgp": 550,
    "durationMinutes": 180,
    "capacityPerSession": 15,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/15116663-4dd6-45e5-86bb-0ff6d2a7fb8b-01M18PP0NRG3G6KAS8CKJ8AM62.webp",
    "additionalImages": [
      "/assets/clayton/workshops/15116663-4dd6-45e5-86bb-0ff6d2a7fb8b-01M18PP0NRG3G6KAS8CKJ8AM62.webp"
    ],
    "isPublished": true,
    "isFeatured": true,
    "sortOrder": 4,
    "serviceId": 5,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000006",
    "title": "Rhinestones Workshop",
    "slug": "rhinestones-workshop",
    "category": "Jewelry & Craft",
    "shortDescription": "Customize and embellish creative pieces with sparkling precision-placed rhinestones.",
    "description": "✨ Rhinestones Workshop — Sparkle, Create & Express Turn something simple into something uniquely yours. In this hands-on rhinestone workshop, you’ll explore the art of decorating with crystals and rhinestones, experiment with colors, shapes, and patterns, and create your own sparkling piece. Whether you want to add a little sparkle or go all out, this workshop is about self-expression, creativity, and having fun with the details. ✨ **What you’ll experience:** * Learn basic rhinestone decorating techniques * Explore colors, shapes, and creative patterns * Design and customize your own piece * Experiment with sparkle and texture * Enjoy a fun, expressive creative experience * Take home something uniquely yours **Add a little sparkle. Make it yours. ✨**",
    "priceEgp": 600,
    "durationMinutes": 180,
    "capacityPerSession": 20,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/26674ff0-507b-4f77-ace6-562851272f50-01M18QT4RJPR6ZFYGEVA8DGGWY.webp",
    "additionalImages": [
      "/assets/clayton/workshops/26674ff0-507b-4f77-ace6-562851272f50-01M18QT4RJPR6ZFYGEVA8DGGWY.webp"
    ],
    "isPublished": true,
    "isFeatured": true,
    "sortOrder": 5,
    "serviceId": 6,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000007",
    "title": "Flower Workshop",
    "slug": "flower-workshop",
    "category": "Floral & Botanical",
    "shortDescription": "Learn floral arrangement basics, color harmony, and craft a fresh botanical centerpiece.",
    "description": "🌸 Flower Workshop — Create, Arrange & Bloom Reconnect with nature and explore the beauty of flowers through a hands-on creative experience. In this workshop, you’ll learn the basics of flower arranging, discover how to combine colors, textures, and shapes, and create your own beautiful floral arrangement to take home. No previous experience is needed — just bring your creativity and let the flowers guide you. 🌿✨ **What you’ll experience:** * Learn the basics of floral arranging * Explore colors, textures, and flower combinations * Create your own unique floral arrangement * Enjoy a calming and mindful creative experience * Take home your handmade creation **Gather. Arrange. Bloom. 🌸**",
    "priceEgp": 550,
    "durationMinutes": 120,
    "capacityPerSession": 20,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/7bf1ff6d-e264-44b0-92cc-961f40673750-01M0ZEZMPMW62ERQGABZXPHY2N.webp",
    "additionalImages": [
      "/assets/clayton/workshops/7bf1ff6d-e264-44b0-92cc-961f40673750-01M0ZEZMPMW62ERQGABZXPHY2N.webp",
      "/assets/clayton/workshops/e24d9281-ff57-4068-853b-915d7bca85c3-01M0ZEZNFBMEGFH4VHH31K70FM.webp"
    ],
    "isPublished": true,
    "isFeatured": true,
    "sortOrder": 6,
    "serviceId": 7,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000008",
    "title": "Macrame Workshop",
    "slug": "macrame-workshop",
    "category": "Fiber & Textiles",
    "shortDescription": "Master knotting techniques to produce a textured bohemian macramé wall hanging.",
    "description": "🪢 Macramé Workshop — Knot, Create & Connect Step away from the rush and let your hands create. In this hands-on macramé workshop, you’ll discover the beautiful art of knotting while creating your own unique handmade piece. Learn the basic knots, explore different patterns and textures, and turn simple cords into something meaningful and beautiful. No previous experience is needed — just bring your curiosity, creativity, and a willingness to slow down and enjoy the process. ✨ **What you’ll experience:** * Learn the basic macramé knots and techniques * Explore patterns, textures, and creative combinations * Create your own handmade macramé piece * Enjoy a calming, mindful creative experience * Take home something made by your own hands **Tie a knot. Take a breath. Create something beautiful. 🤍**",
    "priceEgp": 450,
    "durationMinutes": 120,
    "capacityPerSession": 20,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/7b62d08d-37b9-4b08-9621-085c56143e91-01M18PKB4Q7A7D43YC09PCZV1Z.webp",
    "additionalImages": [
      "/assets/clayton/workshops/7b62d08d-37b9-4b08-9621-085c56143e91-01M18PKB4Q7A7D43YC09PCZV1Z.webp"
    ],
    "isPublished": true,
    "isFeatured": false,
    "sortOrder": 7,
    "serviceId": 8,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000009",
    "title": "Hand Building",
    "slug": "hand-building",
    "category": "Pottery & Ceramics",
    "shortDescription": "Learn pinching, coiling, and soft slab sculpting to craft your own unique ceramic piece.",
    "description": "🏺 Hand-Building Workshop — Shape, Feel & Create Slow down, connect with the clay, and let your hands bring your imagination to life. In this hands-on pottery workshop, you’ll discover the art of hand-building without a pottery wheel. Learn simple techniques such as pinching, coiling, and slab building to shape clay into your own unique piece. No previous experience is needed — just come ready to get your hands dirty, experiment, and enjoy the grounding experience of creating something from the earth. ✨ **What you’ll experience:** * Learn the basics of hand-building with clay * Explore pinching, coiling, and slab techniques * Shape and design your own unique piece * Enjoy a slow, mindful, hands-on creative experience * Create something personal to take home **Start with a piece of clay. End with a piece of you. 🤎**",
    "priceEgp": 350,
    "durationMinutes": 120,
    "capacityPerSession": 5,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/65898fbe-7a5e-485a-acb9-4407d0b47c96-01M0ZG60Z3ZCCXCE4SYFD0R72N.webp",
    "additionalImages": [
      "/assets/clayton/workshops/65898fbe-7a5e-485a-acb9-4407d0b47c96-01M0ZG60Z3ZCCXCE4SYFD0R72N.webp"
    ],
    "isPublished": true,
    "isFeatured": false,
    "sortOrder": 8,
    "serviceId": 9,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000010",
    "title": "Beading",
    "slug": "beading",
    "category": "Jewelry & Craft",
    "shortDescription": "String unique bead patterns, charms, and textures into custom wearable jewelry.",
    "description": "### 🧿 Beading Workshop — String, Create & Express Slow down, get creative, and turn tiny beads into something uniquely yours. In this hands-on workshop, you’ll explore the art of beading, experiment with colors, shapes, textures, and patterns, and create your own handmade piece. From choosing your favorite combinations to putting every detail together, you’ll have the freedom to make something that reflects your personal style. No previous experience is needed — just bring your creativity and enjoy the process. ✨ **What you’ll experience:** * Learn basic beading techniques * Explore colors, shapes, and patterns * Design and create your own handmade piece * Experiment with different materials and combinations * Enjoy a relaxing and mindful creative experience * Take home something made entirely by you **One bead at a time. One idea at a time. Create something that’s yours. ✨**",
    "priceEgp": 250,
    "durationMinutes": 180,
    "capacityPerSession": 20,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/4678cd8c-dd90-47b1-948b-8a6443980933-01M11CGS5GSM0QGPQRGRXT7JE1.webp",
    "additionalImages": [
      "/assets/clayton/workshops/4678cd8c-dd90-47b1-948b-8a6443980933-01M11CGS5GSM0QGPQRGRXT7JE1.webp"
    ],
    "isPublished": true,
    "isFeatured": false,
    "sortOrder": 9,
    "serviceId": 10,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000011",
    "title": "Cake Decorating",
    "slug": "cake-decorating",
    "category": "Cake Decorating",
    "shortDescription": "Learn piping, frosting textures, and decorative finishing to create an edible masterpiece.",
    "description": "### 🎂 Cake Decorating Workshop — Decorate, Create & Indulge Turn a simple cake into your own edible masterpiece. In this hands-on workshop, you’ll explore the creative side of cake decorating, learning how to work with frosting, colors, textures, and decorative details to create a cake that’s as beautiful as it is delicious. No previous experience is needed — just bring your creativity, have fun with the details, and enjoy the sweet process of creating something from scratch. ✨ **What you’ll experience:** * Learn the basics of cake decorating * Explore frosting techniques, colors, and textures * Practice creative decoration and finishing touches * Design and decorate your own cake * Enjoy a fun, playful, hands-on experience * Take home your own edible creation **Create something beautiful. Make it sweet. 🍰✨**",
    "priceEgp": 600,
    "durationMinutes": 120,
    "capacityPerSession": 20,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/386c9674-c1aa-4508-b4fe-e079158dcaed-01M0ZG8EPV0WR5XQYWEJS5V19P.webp",
    "additionalImages": [
      "/assets/clayton/workshops/386c9674-c1aa-4508-b4fe-e079158dcaed-01M0ZG8EPV0WR5XQYWEJS5V19P.webp"
    ],
    "isPublished": true,
    "isFeatured": false,
    "sortOrder": 10,
    "serviceId": 11,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000012",
    "title": "Canvas Cake",
    "slug": "canvas-cake",
    "category": "Painting & Drawing",
    "shortDescription": "Sculpt dimensional faux-cake acrylic textures on stretched artist canvas.",
    "description": "No description provided.",
    "priceEgp": 450,
    "durationMinutes": 120,
    "capacityPerSession": 10,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/f02e4d00-ac2b-4cb4-91d1-5ec0d0f832e8-01M0YMGJ7DZM4VEP9B4WN7CFJ5.webp",
    "additionalImages": [],
    "isPublished": true,
    "isFeatured": false,
    "sortOrder": 11,
    "serviceId": 12,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000014",
    "title": "Accessories workshop",
    "slug": "beadies-workshop",
    "category": "Jewelry & Craft",
    "shortDescription": "Design personalized bracelets, necklaces, and statement charms using mixed materials.",
    "description": "### ✨ Accessories Workshop — Design, Create & Express Turn your ideas into something you can wear. In this hands-on workshop, you’ll explore the creative world of handmade accessories, experimenting with beads, charms, colors, textures, and different materials to design pieces that reflect your personal style. From bracelets and necklaces to unique charms and statement pieces, you’ll have the freedom to mix, match, and create something completely your own. **What you’ll experience:** * Explore different materials, beads, charms, and textures * Learn simple techniques for creating handmade accessories * Design and personalize your own pieces * Experiment with colors and combinations * Enjoy a fun, creative, hands-on experience * Take home accessories made by you **Create it. Wear it. Make it yours. ✨**",
    "priceEgp": 350,
    "durationMinutes": 120,
    "capacityPerSession": 10,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/17168fde-61df-44c3-9b76-051e76576b52-01M18RS0K1SG7JMJKMDJGRX9QB.webp",
    "additionalImages": [
      "/assets/clayton/workshops/17168fde-61df-44c3-9b76-051e76576b52-01M18RS0K1SG7JMJKMDJGRX9QB.webp"
    ],
    "isPublished": true,
    "isFeatured": false,
    "sortOrder": 12,
    "serviceId": 14,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000018",
    "title": "Leather journal",
    "slug": "leather-journal",
    "category": "Leather & Bookbinding",
    "shortDescription": "Craft and stitch a personal genuine leather journal from scratch to carry your thoughts.",
    "description": "### 📖 Leather Journal Workshop — Craft, Create & Tell Your Story Slow down, work with your hands, and create a journal that feels truly yours. In this hands-on workshop, you’ll discover the art of crafting a leather journal from scratch. Explore the textures and character of leather, learn simple bookbinding and finishing techniques, and personalize your journal with details that reflect your style. No previous experience is needed — just bring your creativity and let your hands turn simple materials into something meaningful. ✨ **What you’ll experience:** * Learn the basics of leather crafting and journal making * Explore simple binding and stitching techniques * Choose and personalize your journal details * Create a unique handmade leather journal * Enjoy a slow, mindful creative experience * Take home a journal made by you **Make a place for your thoughts. Give your stories a cover. 🤎**",
    "priceEgp": 600,
    "durationMinutes": 60,
    "capacityPerSession": 50,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/039ebbba-8f04-444d-8ec4-72aa0e81114d-01M11CF4CJA311XRX188PQSQNN.webp",
    "additionalImages": [
      "/assets/clayton/workshops/039ebbba-8f04-444d-8ec4-72aa0e81114d-01M11CF4CJA311XRX188PQSQNN.webp"
    ],
    "isPublished": true,
    "isFeatured": false,
    "sortOrder": 13,
    "serviceId": 18,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000020",
    "title": "Flower lamps",
    "slug": "flower-lamps",
    "category": "Floral & Botanical",
    "shortDescription": "Create a warm illuminated flower lamp combining botanical shapes and ambient lighting.",
    "description": "No description provided.",
    "priceEgp": 550,
    "durationMinutes": 120,
    "capacityPerSession": 10,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/f02e4d00-ac2b-4cb4-91d1-5ec0d0f832e8-01M0YMGJ7DZM4VEP9B4WN7CFJ5.webp",
    "additionalImages": [],
    "isPublished": true,
    "isFeatured": false,
    "sortOrder": 14,
    "serviceId": 20,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000021",
    "title": "Sun catcher",
    "slug": "sun-catcher",
    "category": "Floral & Botanical",
    "shortDescription": "Design a luminous window suncatcher with crystals and beads that catches the natural light.",
    "description": "### 🌈 Suncatcher Workshop — Create, Reflect & Glow Capture the light and turn it into something beautiful. In this hands-on workshop, you’ll create your own unique suncatcher using crystals, beads, and decorative elements. Explore colors, shapes, and patterns as you design a piece that catches the sunlight and fills your space with beautiful reflections. No previous experience is needed — just bring your creativity and let the light inspire you. ✨ **What you’ll experience:** * Learn the basics of suncatcher making * Explore crystals, beads, colors, and textures * Design your own unique piece * Create something beautiful for your space * Enjoy a calming and mindful creative experience * Take home your handmade suncatcher **Catch the light. Reflect the beauty. Let it shine. 🌈✨**",
    "priceEgp": 500,
    "durationMinutes": 120,
    "capacityPerSession": 10,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/54e494c6-3a89-4d95-b52a-f44c418d1c4f-01M11CM9873V979KN7BQDKER2Q.webp",
    "additionalImages": [
      "/assets/clayton/workshops/54e494c6-3a89-4d95-b52a-f44c418d1c4f-01M11CM9873V979KN7BQDKER2Q.webp",
      "/assets/clayton/workshops/7e7a3d7f-9ad6-4c18-9eec-3fea5ce05abd-01M18SC7C9KS80BGNQQQ4G6N6R.webp",
      "/assets/clayton/workshops/699625f3-6510-4b06-ab90-58e0a566a4bd-01M18SC80K2R4H77MJQT9GNHGW.webp",
      "/assets/clayton/workshops/0eb48ceb-ad8a-4eca-9311-f485a3d4871b-01M18SC8TSPSY43DQ3VE6JNS1A.webp"
    ],
    "isPublished": true,
    "isFeatured": false,
    "sortOrder": 15,
    "serviceId": 21,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000022",
    "title": "Collage poster",
    "slug": "collage-poster",
    "category": "Arts & Crafts",
    "shortDescription": "Layer vintage typography, prints, and textures into an expressive poster composition.",
    "description": "No description provided.",
    "priceEgp": 550,
    "durationMinutes": 150,
    "capacityPerSession": 10,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/f02e4d00-ac2b-4cb4-91d1-5ec0d0f832e8-01M0YMGJ7DZM4VEP9B4WN7CFJ5.webp",
    "additionalImages": [],
    "isPublished": true,
    "isFeatured": false,
    "sortOrder": 16,
    "serviceId": 22,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  },
  {
    "id": "33333333-3333-3333-3333-000000000023",
    "title": "String art",
    "slug": "string-art",
    "category": "Arts & Crafts",
    "shortDescription": "Weave colored geometric thread patterns across pinned wooden art boards.",
    "description": "No description provided.",
    "priceEgp": 500,
    "durationMinutes": 60,
    "capacityPerSession": 10,
    "difficulty": "All Levels (Beginner Friendly)",
    "whatIsIncluded": [
      "All workshop materials & specialized tools",
      "Dedicated guidance from resident studio mentors",
      "Take-home finished handmade piece",
      "Complimentary studio refreshments"
    ],
    "requirements": "No prior experience needed. Wear comfortable clothes.",
    "coverImage": "/assets/clayton/workshops/f02e4d00-ac2b-4cb4-91d1-5ec0d0f832e8-01M0YMGJ7DZM4VEP9B4WN7CFJ5.webp",
    "additionalImages": [],
    "isPublished": true,
    "isFeatured": false,
    "sortOrder": 17,
    "serviceId": 23,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
];

// Helper to make future dates
const getFutureDate = (daysAhead: number, hours: number, minutes: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

const initialSessions: Session[] = [
  {
    "id": "44444444-4444-4444-4444-444444444401",
    "workshopId": "33333333-3333-3333-3333-000000000001",
    "startTime": "2026-10-06T17:00:00.000Z",
    "endTime": "2026-10-06T18:00:00.000Z",
    "capacity": 5,
    "bookedSeats": 2,
    "status": "scheduled",
    "instructorName": "Nour El-Din (Studio Ceramist)",
    "roomOrSpace": "Clayton Pottery Wheel Room",
    "notes": "Wheel pottery session with clay and tools provided",
    "createdAt": "2026-10-04T01:00:14.124Z"
  },
  {
    "id": "44444444-4444-4444-4444-444444444402",
    "workshopId": "33333333-3333-3333-3333-000000000001",
    "startTime": "2026-10-08T18:00:00.000Z",
    "endTime": "2026-10-08T19:00:00.000Z",
    "capacity": 5,
    "bookedSeats": 5,
    "status": "full",
    "instructorName": "Nour El-Din (Studio Ceramist)",
    "roomOrSpace": "Clayton Pottery Wheel Room",
    "notes": "Evening session",
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "44444444-4444-4444-4444-444444444403",
    "workshopId": "33333333-3333-3333-3333-000000000001",
    "startTime": "2026-10-10T12:00:00.000Z",
    "endTime": "2026-10-10T13:00:00.000Z",
    "capacity": 5,
    "bookedSeats": 1,
    "status": "scheduled",
    "instructorName": "Salma Raouf",
    "roomOrSpace": "Clayton Pottery Wheel Room",
    "notes": "Weekend afternoon session",
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "44444444-4444-4444-4444-444444444404",
    "workshopId": "33333333-3333-3333-3333-000000000008",
    "startTime": "2026-10-07T16:00:00.000Z",
    "endTime": "2026-10-07T18:00:00.000Z",
    "capacity": 5,
    "bookedSeats": 1,
    "status": "scheduled",
    "instructorName": "Nour El-Din",
    "roomOrSpace": "Clayton Courtyard Studio",
    "notes": "Hand-building & slab sculpting",
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "44444444-4444-4444-4444-444444444405",
    "workshopId": "33333333-3333-3333-3333-000000000002",
    "startTime": "2026-10-06T15:00:00.000Z",
    "endTime": "2026-10-06T17:00:00.000Z",
    "capacity": 10,
    "bookedSeats": 3,
    "status": "scheduled",
    "instructorName": "Mariam Adel",
    "roomOrSpace": "Painting Studio",
    "notes": "Canvas and acrylic paints included",
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "44444444-4444-4444-4444-444444444406",
    "workshopId": "33333333-3333-3333-3333-000000000002",
    "startTime": "2026-10-09T17:00:00.000Z",
    "endTime": "2026-10-09T19:00:00.000Z",
    "capacity": 10,
    "bookedSeats": 4,
    "status": "scheduled",
    "instructorName": "Mariam Adel",
    "roomOrSpace": "Painting Studio",
    "notes": "Weekend creative painting session",
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "44444444-4444-4444-4444-444444444407",
    "workshopId": "33333333-3333-3333-3333-000000000003",
    "startTime": "2026-10-07T18:00:00.000Z",
    "endTime": "2026-10-07T20:00:00.000Z",
    "capacity": 10,
    "bookedSeats": 4,
    "status": "scheduled",
    "instructorName": "Hana Zaki",
    "roomOrSpace": "Clayton Studio Table 1",
    "notes": "Scent blending and wax pouring",
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "44444444-4444-4444-4444-444444444408",
    "workshopId": "33333333-3333-3333-3333-000000000015",
    "startTime": "2026-10-08T15:00:00.000Z",
    "endTime": "2026-10-08T17:00:00.000Z",
    "capacity": 10,
    "bookedSeats": 2,
    "status": "scheduled",
    "instructorName": "Salma Raouf",
    "roomOrSpace": "Sunlit Conservatory",
    "notes": "Crystals, glass beads, and wire framing",
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "44444444-4444-4444-4444-444444444409",
    "workshopId": "33333333-3333-3333-3333-000000000006",
    "startTime": "2026-10-09T14:00:00.000Z",
    "endTime": "2026-10-09T16:00:00.000Z",
    "capacity": 20,
    "bookedSeats": 6,
    "status": "scheduled",
    "instructorName": "Farida Mansour",
    "roomOrSpace": "Garden Studio Terrace",
    "notes": "Fresh flowers and arrangement vessels provided",
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "44444444-4444-4444-4444-444444444410",
    "workshopId": "33333333-3333-3333-3333-000000000004",
    "startTime": "2026-10-10T15:00:00.000Z",
    "endTime": "2026-10-10T18:00:00.000Z",
    "capacity": 15,
    "bookedSeats": 3,
    "status": "scheduled",
    "instructorName": "Dina Youssef",
    "roomOrSpace": "Main Studio Table 2",
    "notes": "Yarn, hooks, and stitch patterns included",
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "44444444-4444-4444-4444-444444444411",
    "workshopId": "33333333-3333-3333-3333-000000000013",
    "startTime": "2026-10-11T16:00:00.000Z",
    "endTime": "2026-10-11T17:00:00.000Z",
    "capacity": 50,
    "bookedSeats": 8,
    "status": "scheduled",
    "instructorName": "Karim Fouad",
    "roomOrSpace": "Craft Workshop Hall",
    "notes": "Leather cutting, binding, and embossing",
    "createdAt": "2026-10-04T01:00:14.125Z"
  }
];

const initialCustomers: Customer[] = [
  {
    id: '55555555-5555-5555-5555-555555555501',
    fullName: 'Mariam Shenouda',
    email: 'mariam.shenouda@gmail.com',
    phone: '+20 100 123 4567',
    notes: 'Prefers corner wheel in pottery studio',
    totalBookings: 2,
    totalSpentEgp: 1500,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: '55555555-5555-5555-5555-555555555502',
    fullName: 'Omar El-Sayed',
    email: 'omar.elsayed@alexu.edu.eg',
    phone: '+20 111 987 6543',
    notes: 'Architecture enthusiast, attended oil painting twice',
    totalBookings: 1,
    totalSpentEgp: 850,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: '55555555-5555-5555-5555-555555555503',
    fullName: 'Layla Kabbani',
    email: 'layla.kabbani@outlook.com',
    phone: '+20 122 456 7890',
    notes: 'Booked for bridal sister gathering',
    totalBookings: 1,
    totalSpentEgp: 1240,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
  }
];

const initialBookings: Booking[] = [
  {
    id: '66666666-6666-6666-6666-666666666601',
    bookingNumber: 'CLY-261001-A92F',
    sessionId: '44444444-4444-4444-4444-444444444401',
    workshopId: '33333333-3333-3333-3333-333333333301',
    customerId: '55555555-5555-5555-5555-555555555501',
    attendeesCount: 2,
    totalAmountEgp: 1500,
    bookingStatus: 'confirmed',
    paymentStatus: 'paid',
    specialRequests: 'Celebrating an anniversary',
    confirmationCode: 'A92F47BC',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: '66666666-6666-6666-6666-666666666602',
    bookingNumber: 'CLY-261002-C381',
    sessionId: '44444444-4444-4444-4444-444444444406',
    workshopId: '33333333-3333-3333-3333-333333333303',
    customerId: '55555555-5555-5555-5555-555555555502',
    attendeesCount: 1,
    totalAmountEgp: 850,
    bookingStatus: 'confirmed',
    paymentStatus: 'paid',
    specialRequests: 'Left-handed palette knife grip requested',
    confirmationCode: 'C38189D2',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: '66666666-6666-6666-6666-666666666603',
    bookingNumber: 'CLY-261003-E550',
    sessionId: '44444444-4444-4444-4444-444444444404',
    workshopId: '33333333-3333-3333-3333-333333333302',
    customerId: '55555555-5555-5555-5555-555555555503',
    attendeesCount: 2,
    totalAmountEgp: 1240,
    bookingStatus: 'confirmed',
    paymentStatus: 'pending',
    specialRequests: 'Allergic to synthetic fragrance',
    confirmationCode: 'E550A411',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const initialPayments: Payment[] = [
  {
    id: '77777777-7777-7777-7777-777777777701',
    bookingId: '66666666-6666-6666-6666-666666666601',
    amountEgp: 1500,
    currency: 'EGP',
    provider: 'paymob',
    paymentStatus: 'paid',
    paymentMethod: 'Visa / Mastercard',
    transactionRef: 'PAYMOB-TXN-884912',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: '77777777-7777-7777-7777-777777777702',
    bookingId: '66666666-6666-6666-6666-666666666602',
    amountEgp: 850,
    currency: 'EGP',
    provider: 'instapay',
    paymentStatus: 'paid',
    paymentMethod: 'InstaPay Direct',
    transactionRef: 'INSTA-REF-302914',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: '77777777-7777-7777-7777-777777777703',
    bookingId: '66666666-6666-6666-6666-666666666603',
    amountEgp: 1240,
    currency: 'EGP',
    provider: 'cash',
    paymentStatus: 'pending',
    paymentMethod: 'Pay at Venue Reception',
    transactionRef: 'CASH-PEND-491021',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const initialGallery: GalleryImage[] = [
  {
    "id": "88888888-8888-8888-8888-888888888801",
    "title": "Clayton Pottery Wheel Studio",
    "category": "Pottery",
    "imageUrl": "/assets/clayton/workshops/f02e4d00-ac2b-4cb4-91d1-5ec0d0f832e8-01M0YMGJ7DZM4VEP9B4WN7CFJ5.webp",
    "caption": "Hands-on pottery shaping on the electric wheel in Kafr Abdo",
    "aspectRatio": "square",
    "isFeatured": true,
    "sortOrder": 1,
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "88888888-8888-8888-8888-888888888802",
    "title": "Painting Workshop at Clayton",
    "category": "Painting",
    "imageUrl": "/assets/clayton/workshops/eae30be2-a30d-4786-8ee5-099a04ff3099-01M0N3H3D6CCK1B78A4WMFTQ5G.webp",
    "caption": "Expressive acrylic painting session on canvas",
    "aspectRatio": "portrait",
    "isFeatured": true,
    "sortOrder": 2,
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "88888888-8888-8888-8888-888888888803",
    "title": "Studio Creative Space",
    "category": "Garden & Villa",
    "imageUrl": "/assets/clayton/studio/97266409-abdd-4158-a09d-0f527697fd51-01KZZ03KH3V4S4R787VE93M9BW.webp",
    "caption": "The warm and welcoming studio interior in Kafr Abdo",
    "aspectRatio": "landscape",
    "isFeatured": true,
    "sortOrder": 3,
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "88888888-8888-8888-8888-888888888804",
    "title": "Clayton at Raabta Wellness Festival",
    "category": "Private Events",
    "imageUrl": "/assets/clayton/events/d0e97474-5e5b-4df7-8b28-3e4415e191ab-01KZYYZ3Z22V0BF8KFP94C95ST.webp",
    "caption": "Hosting interactive open-air art workshops at Raabta Festival in El Gouna",
    "aspectRatio": "landscape",
    "isFeatured": true,
    "sortOrder": 4,
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "88888888-8888-8888-8888-888888888805",
    "title": "Hand-Building Ceramics",
    "category": "Pottery",
    "imageUrl": "/assets/clayton/workshops/65898fbe-7a5e-485a-acb9-4407d0b47c96-01M0ZG60Z3ZCCXCE4SYFD0R72N.webp",
    "caption": "Sculpting clay forms with pinch and slab hand-building techniques",
    "aspectRatio": "square",
    "isFeatured": true,
    "sortOrder": 5,
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "88888888-8888-8888-8888-888888888806",
    "title": "Handmade Suncatcher Crafts",
    "category": "Sensory & Tea",
    "imageUrl": "/assets/clayton/workshops/54e494c6-3a89-4d95-b52a-f44c418d1c4f-01M11CM9873V979KN7BQDKER2Q.webp",
    "caption": "Luminous light-catching crystal and bead creations",
    "aspectRatio": "portrait",
    "isFeatured": false,
    "sortOrder": 6,
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "88888888-8888-8888-8888-888888888807",
    "title": "Floral Arranging Table",
    "category": "Garden & Villa",
    "imageUrl": "/assets/clayton/workshops/7bf1ff6d-e264-44b0-92cc-961f40673750-01M0ZEZMPMW62ERQGABZXPHY2N.webp",
    "caption": "Fresh flowers and bespoke centerpiece creations",
    "aspectRatio": "landscape",
    "isFeatured": false,
    "sortOrder": 7,
    "createdAt": "2026-10-04T01:00:14.125Z"
  },
  {
    "id": "88888888-8888-8888-8888-888888888808",
    "title": "Candle Pouring Workshop",
    "category": "Sensory & Tea",
    "imageUrl": "/assets/clayton/workshops/ff2ccc5c-7a33-4f65-8b93-b73022766d5d-01M11CKAD8CW9639K0FH4KQN9B.webp",
    "caption": "Hand-pouring scented natural wax candles with custom fragrance blends",
    "aspectRatio": "portrait",
    "isFeatured": true,
    "sortOrder": 8,
    "createdAt": "2026-10-04T01:00:14.125Z"
  }
];

const initialInquiries: PrivateEventInquiry[] = [
  {
    id: '99999999-9999-9999-9999-999999999901',
    eventType: 'Corporate Retreat',
    preferredDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    guestCount: 18,
    budgetRange: '15,000 - 20,000 EGP',
    name: 'Dina Mostafa (Creative Agency Alexandria)',
    phone: '+20 109 876 5432',
    email: 'dina@creativealex.eg',
    notes: 'Looking for a team pottery & coffee morning session in the courtyard garden.',
    status: 'quoted',
    adminNotes: 'Quotation sent via email on Tuesday.',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: '99999999-9999-9999-9999-999999999902',
    eventType: 'Birthday Celebration',
    preferredDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
    guestCount: 12,
    budgetRange: '8,000 - 12,000 EGP',
    name: 'Zeina Kassab',
    phone: '+20 120 765 4321',
    email: 'zeina.kassab@gmail.com',
    notes: 'Surprise 30th birthday candle crafting workshop with cake and beverage setup.',
    status: 'new',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

// Local Storage Helper with In-Memory Fallback for Node/SSR/Testing
class LocalStore {
  private memCache: Record<string, string> = {};

  private get<T>(key: string, defaultVal: T): T {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_PREFIX + key);
        return stored ? JSON.parse(stored) : defaultVal;
      }
      const mem = this.memCache[STORAGE_KEY_PREFIX + key];
      return mem ? JSON.parse(mem) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private set<T>(key: string, val: T): void {
    try {
      const serialized = JSON.stringify(val);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_PREFIX + key, serialized);
      }
      this.memCache[STORAGE_KEY_PREFIX + key] = serialized;
    } catch (e) {
      console.error('LocalStore set error:', e);
    }
  }

  // Work with Workshops
  getWorkshops(): Workshop[] {
    return this.get<Workshop[]>('workshops', initialWorkshops);
  }

  saveWorkshops(workshops: Workshop[]): void {
    this.set('workshops', workshops);
  }

  getWorkshopById(id: string): Workshop | undefined {
    return this.getWorkshops().find(w => w.id === id || w.slug === id);
  }

  createWorkshop(data: Omit<Workshop, 'id' | 'createdAt' | 'slug'>): Workshop {
    const workshops = this.getWorkshops();
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newWorkshop: Workshop = {
      ...data,
      id: crypto.randomUUID(),
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    workshops.unshift(newWorkshop);
    this.saveWorkshops(workshops);
    return newWorkshop;
  }

  updateWorkshop(id: string, updates: Partial<Workshop>): Workshop {
    const workshops = this.getWorkshops();
    const index = workshops.findIndex(w => w.id === id);
    if (index === -1) throw new Error('Workshop not found');
    workshops[index] = { ...workshops[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveWorkshops(workshops);
    return workshops[index];
  }

  deleteWorkshop(id: string): void {
    const workshops = this.getWorkshops().filter(w => w.id !== id);
    this.saveWorkshops(workshops);
  }

  // Work with Sessions
  getSessions(): Session[] {
    return this.get<Session[]>('sessions', initialSessions);
  }

  saveSessions(sessions: Session[]): void {
    this.set('sessions', sessions);
  }

  getSessionsByWorkshopId(workshopId: string): Session[] {
    return this.getSessions().filter(s => s.workshopId === workshopId);
  }

  getSessionById(id: string): Session | undefined {
    return this.getSessions().find(s => s.id === id);
  }

  createSession(data: Omit<Session, 'id' | 'bookedSeats' | 'status' | 'createdAt'>): Session {
    const sessions = this.getSessions();
    const newSession: Session = {
      ...data,
      id: crypto.randomUUID(),
      bookedSeats: 0,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    sessions.push(newSession);
    this.saveSessions(sessions);
    return newSession;
  }

  updateSession(id: string, updates: Partial<Session>): Session {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Session not found');

    const updated = { ...sessions[index], ...updates, updatedAt: new Date().toISOString() };
    // Automatically recalculate status if capacity changed
    if (updated.bookedSeats >= updated.capacity) {
      updated.status = 'full';
    } else if (updated.status === 'full' && updated.bookedSeats < updated.capacity) {
      updated.status = 'scheduled';
    }

    sessions[index] = updated;
    this.saveSessions(sessions);
    return updated;
  }

  deleteSession(id: string): void {
    const sessions = this.getSessions().filter(s => s.id !== id);
    this.saveSessions(sessions);
  }

  // Work with Customers
  getCustomers(): Customer[] {
    return this.get<Customer[]>('customers', initialCustomers);
  }

  saveCustomers(customers: Customer[]): void {
    this.set('customers', customers);
  }

  // Work with Bookings (Atomic calculation)
  getBookings(): Booking[] {
    const bookings = this.get<Booking[]>('bookings', initialBookings);
    const workshops = this.getWorkshops();
    const sessions = this.getSessions();
    const customers = this.getCustomers();
    const payments = this.getPayments();

    return bookings.map(b => ({
      ...b,
      workshop: workshops.find(w => w.id === b.workshopId),
      session: sessions.find(s => s.id === b.sessionId),
      customer: customers.find(c => c.id === b.customerId),
      payment: payments.find(p => p.bookingId === b.id)
    }));
  }

  saveBookings(bookings: Booking[]): void {
    // Only store flat booking records to avoid recursion
    const flat = bookings.map(({ workshop, session, customer, payment, ...rest }) => rest);
    this.set('bookings', flat);
  }

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id || b.bookingNumber === id || b.confirmationCode === id);
  }

  // ATOMIC RESERVATION LOGIC:
  // Strictly verifies capacity - bookedSeats, updates session seats, manages customer, records payment
  createBookingAtomic(input: BookingCreationInput): BookingCreationResult {
    // 1. Fetch sessions
    const sessions = this.getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === input.sessionId);
    if (sessionIndex === -1) {
      return { success: false, error: 'The selected workshop session does not exist.' };
    }

    const session = sessions[sessionIndex];
    if (session.status === 'cancelled') {
      return { success: false, error: 'This session has been cancelled.' };
    }
    if (session.status === 'completed') {
      return { success: false, error: 'This session has already ended.' };
    }

    const availableSeats = session.capacity - session.bookedSeats;
    if (input.attendeesCount > availableSeats) {
      return {
        success: false,
        error: availableSeats <= 0
          ? 'This session is fully booked. Please select another date.'
          : `Only ${availableSeats} seat(s) remaining for this session; requested ${input.attendeesCount}.`
      };
    }

    // 2. Fetch workshop to get authoritative price
    const workshops = this.getWorkshops();
    const workshop = workshops.find(w => w.id === session.workshopId);
    if (!workshop) {
      return { success: false, error: 'Workshop details not found.' };
    }

    const totalAmountEgp = workshop.priceEgp * input.attendeesCount;

    // 3. Customer Upsert
    const customers = this.getCustomers();
    let customer = customers.find(c => c.email.toLowerCase() === input.customerEmail.toLowerCase().trim());
    if (!customer) {
      customer = {
        id: crypto.randomUUID(),
        fullName: input.customerName.trim(),
        email: input.customerEmail.toLowerCase().trim(),
        phone: input.customerPhone.trim(),
        totalBookings: 1,
        totalSpentEgp: totalAmountEgp,
        createdAt: new Date().toISOString()
      };
      customers.push(customer);
    } else {
      customer.fullName = input.customerName.trim();
      customer.phone = input.customerPhone.trim();
      customer.totalBookings += 1;
      customer.totalSpentEgp += totalAmountEgp;
      customer.updatedAt = new Date().toISOString();
    }
    this.saveCustomers(customers);

    // 4. Update session seats
    session.bookedSeats += input.attendeesCount;
    if (session.bookedSeats >= session.capacity) {
      session.status = 'full';
    }
    sessions[sessionIndex] = session;
    this.saveSessions(sessions);

    // 5. Generate identifiers
    const dateStamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingNumber = `CLY-${dateStamp}-${randCode}`;
    const confirmationCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const bookingId = crypto.randomUUID();
    const newBooking: Booking = {
      id: bookingId,
      bookingNumber,
      sessionId: session.id,
      workshopId: workshop.id,
      customerId: customer.id,
      attendeesCount: input.attendeesCount,
      totalAmountEgp,
      bookingStatus: 'confirmed',
      paymentStatus: input.paymentMethod === 'card' ? 'paid' : 'pending',
      specialRequests: input.specialRequests,
      confirmationCode,
      createdAt: new Date().toISOString()
    };

    const bookings = this.getBookings();
    bookings.unshift(newBooking);
    this.saveBookings(bookings);

    // 6. Record Payment
    const paymentId = crypto.randomUUID();
    const payments = this.getPayments();
    payments.unshift({
      id: paymentId,
      bookingId,
      amountEgp: totalAmountEgp,
      currency: 'EGP',
      provider: input.paymentProvider || 'mock',
      paymentStatus: newBooking.paymentStatus,
      paymentMethod: input.paymentMethod || 'Credit / Debit Card',
      transactionRef: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      createdAt: new Date().toISOString()
    });
    this.savePayments(payments);

    return {
      success: true,
      bookingId,
      bookingNumber,
      confirmationCode,
      workshopTitle: workshop.title,
      startTime: session.startTime,
      endTime: session.endTime,
      attendeesCount: input.attendeesCount,
      totalAmountEgp,
      customerName: customer.fullName,
      customerEmail: customer.email,
      bookingStatus: newBooking.bookingStatus,
      paymentStatus: newBooking.paymentStatus
    };
  }

  // Cancel Booking and atomically release seats
  cancelBooking(bookingId: string, reason?: string): boolean {
    const bookings = this.getBookings();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.bookingStatus === 'cancelled') return false;

    // Release seats
    const sessions = this.getSessions();
    const session = sessions.find(s => s.id === booking.sessionId);
    if (session) {
      session.bookedSeats = Math.max(0, session.bookedSeats - booking.attendeesCount);
      if (session.status === 'full' && session.bookedSeats < session.capacity) {
        session.status = 'scheduled';
      }
      this.saveSessions(sessions);
    }

    booking.bookingStatus = 'cancelled';
    if (reason) {
      booking.specialRequests = (booking.specialRequests ? booking.specialRequests + ' ' : '') + `[Cancelled: ${reason}]`;
    }
    booking.updatedAt = new Date().toISOString();
    this.saveBookings(bookings);
    return true;
  }

  updateBookingStatus(bookingId: string, bookingStatus: Booking['bookingStatus'], paymentStatus?: Booking['paymentStatus']): Booking {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');

    const current = bookings[index];

    // If changing to cancelled, release seats
    if (bookingStatus === 'cancelled' && current.bookingStatus !== 'cancelled') {
      const sessions = this.getSessions();
      const session = sessions.find(s => s.id === current.sessionId);
      if (session) {
        session.bookedSeats = Math.max(0, session.bookedSeats - current.attendeesCount);
        if (session.status === 'full' && session.bookedSeats < session.capacity) {
          session.status = 'scheduled';
        }
        this.saveSessions(sessions);
      }
    }

    current.bookingStatus = bookingStatus;
    if (paymentStatus) {
      current.paymentStatus = paymentStatus;
    }
    current.updatedAt = new Date().toISOString();
    bookings[index] = current;
    this.saveBookings(bookings);
    return current;
  }

  // Work with Payments
  getPayments(): Payment[] {
    return this.get<Payment[]>('payments', initialPayments);
  }

  savePayments(payments: Payment[]): void {
    this.set('payments', payments);
  }

  // Work with Gallery
  getGallery(): GalleryImage[] {
    return this.get<GalleryImage[]>('gallery', initialGallery);
  }

  saveGallery(gallery: GalleryImage[]): void {
    this.set('gallery', gallery);
  }

  createGalleryImage(data: Omit<GalleryImage, 'id' | 'createdAt'>): GalleryImage {
    const gallery = this.getGallery();
    const newImage: GalleryImage = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    gallery.unshift(newImage);
    this.saveGallery(gallery);
    return newImage;
  }

  deleteGalleryImage(id: string): void {
    const gallery = this.getGallery().filter(g => g.id !== id);
    this.saveGallery(gallery);
  }

  // Work with Inquiries
  getInquiries(): PrivateEventInquiry[] {
    return this.get<PrivateEventInquiry[]>('inquiries', initialInquiries);
  }

  saveInquiries(inquiries: PrivateEventInquiry[]): void {
    this.set('inquiries', inquiries);
  }

  createInquiry(data: Omit<PrivateEventInquiry, 'id' | 'status' | 'createdAt'>): PrivateEventInquiry {
    const inquiries = this.getInquiries();
    const newInquiry: PrivateEventInquiry = {
      ...data,
      id: crypto.randomUUID(),
      status: 'new',
      createdAt: new Date().toISOString()
    };
    inquiries.unshift(newInquiry);
    this.saveInquiries(inquiries);
    return newInquiry;
  }

  updateInquiryStatus(id: string, status: PrivateEventInquiry['status'], adminNotes?: string): PrivateEventInquiry {
    const inquiries = this.getInquiries();
    const index = inquiries.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Inquiry not found');
    inquiries[index].status = status;
    if (adminNotes !== undefined) {
      inquiries[index].adminNotes = adminNotes;
    }
    inquiries[index].updatedAt = new Date().toISOString();
    this.saveInquiries(inquiries);
    return inquiries[index];
  }

  // Work with Site Settings
  getSettings(): SiteSettings {
    return this.get<SiteSettings>('settings', initialSettings);
  }

  updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    this.set('settings', updated);
    return updated;
  }

  // Work with Admins
  getAdmins(): AdminUserRecord[] {
    return this.get<AdminUserRecord[]>('admins', initialAdmins);
  }

  saveAdmins(admins: AdminUserRecord[]): void {
    this.set('admins', admins);
  }

  createAdmin(data: Omit<AdminUserRecord, 'id' | 'createdAt' | 'status'> & { status?: AdminUserRecord['status'] }): AdminUserRecord {
    const admins = this.getAdmins();
    const existing = admins.find(a => a.username.toLowerCase() === data.username.toLowerCase() || a.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('An admin with this username or email already exists.');
    }
    const newAdmin: AdminUserRecord = {
      ...data,
      id: crypto.randomUUID(),
      status: data.status || 'active',
      createdAt: new Date().toISOString()
    };
    admins.push(newAdmin);
    this.saveAdmins(admins);
    return newAdmin;
  }

  updateAdmin(id: string, updates: Partial<AdminUserRecord>): AdminUserRecord {
    const admins = this.getAdmins();
    const index = admins.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Admin not found.');

    // Ensure username uniqueness if changed
    if (updates.username) {
      const conflict = admins.find(a => a.id !== id && a.username.toLowerCase() === updates.username!.toLowerCase());
      if (conflict) throw new Error('Username is already in use by another admin.');
    }

    admins[index] = { ...admins[index], ...updates };
    this.saveAdmins(admins);
    return admins[index];
  }

  deleteAdmin(id: string, callerId: string): void {
    const admins = this.getAdmins();
    const target = admins.find(a => a.id === id);
    if (!target) throw new Error('Admin not found.');

    if (target.id === callerId) {
      throw new Error('You cannot delete your own administrative account.');
    }

    if (target.role === 'super_admin') {
      const superAdminsCount = admins.filter(a => a.role === 'super_admin' && a.id !== id).length;
      if (superAdminsCount < 1) {
        throw new Error('Cannot delete the last remaining Super Admin.');
      }
    }

    this.saveAdmins(admins.filter(a => a.id !== id));
  }

  toggleAdminStatus(id: string, callerId: string): AdminUserRecord {
    const admins = this.getAdmins();
    const target = admins.find(a => a.id === id);
    if (!target) throw new Error('Admin not found.');

    if (target.id === callerId) {
      throw new Error('You cannot disable your own administrative account.');
    }

    target.status = target.status === 'active' ? 'disabled' : 'active';
    this.saveAdmins(admins);
    return target;
  }

  // Reset to initial seed
  resetToSeed(): void {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'admins');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'workshops');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'sessions');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'customers');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'bookings');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'payments');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'gallery');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'inquiries');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'settings');
  }
}

export const localStore = new LocalStore();
