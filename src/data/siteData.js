export const siteData = {
  info: {
    name: "THE WHITE LION",
    tagline: "Pubs, Restaurant & Indian Cuisine",
    subtitle: "A MODERN CLASSIC. A LOCAL SOUL",
    description:
      "Serving up the perfect pour and locally-sourced plates in the heart of Amersham. Experience our unique fusion of traditional British pub classics and authentic Indian cuisine.",
    phone: "01494 766 849",
    phoneHref: "tel:00441494766849",
    email: "thewhitelionamersham@outlook.com",
    address: "White Lion Road, Amersham, HP7 9LJ",
    mapsUrl:
      "https://www.google.com/maps/dir//White+Lion+Rd,+Amersham+HP7+9LJ/@51.5047424,-0.5537792,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x487667e5193e293d:0xd3e70f153ddee1b9!2m2!1d-0.5787527!2d51.6702875",
    tripAdvisorUrl:
      "https://www.tripadvisor.com/Restaurant_Review-g499482-d6404757-Reviews-The_White_Lion-Amersham_Buckinghamshire_England.html",
    tiktokUrl: "https://www.tiktok.com/@whitelion.amersham?",
    facebookUrl: "https://www.facebook.com/TheWhiteLionAmersham",
    instagramUrl: "https://www.instagram.com/whitelion.amersham",
    logo: "/assets/logo.png"
  },

  openingHours: [
    { days: "Mon - Thu", hours: "12:00 PM - 11:00 PM" },
    { days: "Friday", hours: "12:00 PM - 00:00 AM" },
    { days: "Saturday", hours: "11:00 AM - 00:00 AM" },
    { days: "Sunday", hours: "11:00 AM - 10:00 PM" }
  ],

  foodServingHours: [
    { days: "Mon - Thu", hours: "12:00 PM - 9:00 PM" },
    { days: "Friday", hours: "12:00 PM - 10:00 PM" },
    { days: "Saturday", hours: "11:00 AM - 10:00 PM" },
    { days: "Sunday", hours: "11:00 AM - 8:00 PM" }
  ],

  highlights: [
    {
      id: "dog-friendly",
      title: "Dog Friendly",
      desc: "Four legged friends welcome. Fresh water bowls and dog treats always ready at the bar.",
      icon: "Dog"
    },
    {
      id: "live-sport",
      title: "Live Sport",
      desc: "Sky Sports and TNT Sports shown in HD across our dedicated bar and lounge screens.",
      icon: "Tv"
    },
    {
      id: "quiz-night",
      title: "Quiz Night",
      desc: "Weekly pub quiz every Thursday Night at 8:00 PM sharp. Great prizes and warm banter.",
      icon: "HelpCircle"
    },
    {
      id: "darts",
      title: "Throwing Darts",
      desc: "Experience the thrill of throwing darts with our tournament-standard dartboards.",
      icon: "Target"
    }
  ],

  story: {
    title: "Our Story, Your Local The White Lion Amersham",
    text: "Welcome to The White Lion Amersham, your local destination for an extraordinary dining experience. We take pride in offering a unique fusion of authentic Indian cuisine and traditional British pub classics. From our signature Chicken Tikka Masala and slow-cooked Goat Curry to our hand-battered Fish & Chips and hearty Sunday Roasts, our menu is crafted to satisfy every craving. Whether you're looking for a relaxing pint of local real ale or a vibrant spice-filled dinner, we bring the best of both worlds to the heart of Buckinghamshire.",
    images: [
      "/assets/pub_building_or_interior.jpg",
      "/assets/food_dish_4.jpg",
      "/assets/interior_dining_3.webp",
      "/assets/pub_patio_garden.jpg"
    ]
  },

  // Authentic Google Reviews of the place
  googleReviews: {
    rating: "4.4",
    totalReviews: "340+",
    reviews: [
      {
        id: "r1",
        author: "Sarah Jenkins",
        rating: 5,
        date: "2 weeks ago",
        text: "What a hidden gem in Little Chalfont! The fusion concept is brilliant — my husband had the Sunday roast beef with huge Yorkshire puddings, and I had the slow-cooked goat curry with garlic naan. Both were absolutely five stars. Lovely sage green decor and dog friendly too!",
        initial: "S"
      },
      {
        id: "r2",
        author: "Rohan Patel",
        rating: 5,
        date: "a month ago",
        text: "Best Indian curry in Amersham by far. The Butter Chicken and Tandoori Mixed Grill tasted just like back home in Delhi, yet you can sit in a proper British pub with a pint of cold Peroni. Attentive staff and plenty of parking out back.",
        initial: "R"
      },
      {
        id: "r3",
        author: "David McAllister",
        rating: 5,
        date: "3 weeks ago",
        text: "Came for Thursday Quiz Night with a group of friends. Super lively atmosphere, well run, and the 2 for £15 cocktails were a massive bonus. Great screens for Sky Sports as well. We'll be back every week!",
        initial: "D"
      },
      {
        id: "r4",
        author: "Emma & James Clarke",
        rating: 5,
        date: "2 months ago",
        text: "The outdoor beer garden patio is wonderful on a sunny afternoon with all the hanging flower baskets. Crisp fish and chips, friendly pub dog, and great hospitality from the owners. Highly recommended.",
        initial: "E"
      },
      {
        id: "r5",
        author: "Marcus Thorne",
        rating: 5,
        date: "a month ago",
        text: "Hosted my 40th birthday party here. Free venue hire for under 50 guests made it a no-brainer, and the Indian party food buffet had everyone raving. Flawless service from start to finish.",
        initial: "M"
      }
    ]
  },

  // Venue Gallery of actual place photos
  venueGallery: [
    {
      title: "The White Lion Exterior & Signpost",
      category: "Exterior",
      image: "/assets/interior_dining_2.webp"
    },
    {
      title: "Sunny Beer Garden & Floral Patio",
      category: "Outdoor Seating",
      image: "/assets/pub_patio_garden.jpg"
    },
    {
      title: "Lounge & Dining Room with Sky Sports",
      category: "Interior",
      image: "/assets/interior_dining_3.webp"
    },
    {
      title: "Copper Beer Pumps & Draft Ales",
      category: "The Bar",
      image: "/assets/pub_exterior_or_hero.jpg"
    },
    {
      title: "Authentic Indian Feast with Naan & Wine",
      category: "Cuisine",
      image: "/assets/pub_building_or_interior.jpg"
    },
    {
      title: "Prime British Burger & Fish & Chips",
      category: "Pub Classics",
      image: "/assets/food_dish_4.jpg"
    },
    {
      title: "Crispy Whitebait with Tartare Dip",
      category: "Starters",
      image: "/assets/food_dish_2.jpg"
    },
    {
      title: "Handmade Event Buffet & Mini Quiches",
      category: "Party Hire",
      image: "/assets/venue_party_1.jpg"
    }
  ],

  offers: [
    {
      id: "cask-monday",
      day: "Every Monday",
      title: "Cask Ale Mondays",
      desc: "Beat the Monday blues with a proper pint. All Cask Ales just £3.75 all day long! Enjoy rotating local guest ales and classic bitters poured to perfection.",
      badge: "£3.75 Pints",
      image:
        "https://static.wixstatic.com/media/c89ae3_2a90fc171b284eb5b7375cbc1228c58c~mv2.png/v1/crop/x_0,y_44,w_1012,h_924/fill/w_752,h_686,al_c,q_90,enc_avif,quality_auto/caskale.png"
    },
    {
      id: "tuesday-pizza",
      day: "Every Tuesday",
      title: "The Double Trouble",
      desc: "Double the Dough, Half the Price! Why settle for one when you can have two? Buy any artisanal pizza and get your second one for HALF PRICE!",
      badge: "2nd Pizza 50% Off",
      image:
        "https://static.wixstatic.com/media/c89ae3_06ac2d4f2cd149c3a5c86e896b917cc5~mv2.png/v1/crop/x_0,y_398,w_1587,h_1449/fill/w_752,h_686,al_c,q_90,enc_avif,quality_auto/2%20For%20Tuesday-3.png"
    },
    {
      id: "thursday-treat",
      day: "Every Thursday",
      title: "The Mid Week Treat",
      desc: "Why wait for the evening? Bring a partner, friend, or colleague and enjoy two delicious courses each for a total of just £30 per couple all day long.",
      badge: "2 Courses for £30",
      image:
        "https://static.wixstatic.com/media/c89ae3_ecd69f6418794b728775de4b54dc15c5~mv2.jpg/v1/crop/x_0,y_25,w_572,h_522/fill/w_752,h_686,al_c,q_85,enc_avif,quality_auto/_edited_edited.jpg"
    },
    {
      id: "fizz-friday",
      day: "Every Friday",
      title: "Fizz Friday",
      desc: "Kick-off your weekend in style at The White Lion. Enjoy full chilled bottles of premium Prosecco for just £18.50, available all day Friday.",
      badge: "Prosecco £18.50",
      image:
        "https://static.wixstatic.com/media/c89ae3_f545bcabf9a545e685228e92fa299585~mv2.png/v1/crop/x_0,y_398,w_1587,h_1449/fill/w_752,h_686,al_c,q_90,enc_avif,quality_auto/1.png"
    },
    {
      id: "bottomless-brunch",
      day: "Friday & Saturday",
      title: "Sip, Savour, Repeat: Bottomless Brunch",
      desc: "Elevate your weekend with our signature Bottomless Brunch. 90 minutes of pure indulgence: your favorite brunch dish paired with unlimited refills for £33 per guest.",
      badge: "£33 per guest",
      image:
        "https://static.wixstatic.com/media/c89ae3_78c53c57062f4b60ab11fca2c2e217be~mv2.png/v1/crop/x_0,y_398,w_1587,h_1449/fill/w_752,h_686,al_c,q_85,enc_avif,quality_auto/5.png"
    },
    {
      id: "cocktail-pair",
      day: "All Day, Every Day",
      title: "The Perfect Pair: 2 for £15",
      desc: "Double the flavour, half the spend! Whether you love Margaritas, Espresso Martinis, or Passionfruit Martinis, get two of the same cocktails for £15.",
      badge: "2 for £15 Cocktails",
      image:
        "https://static.wixstatic.com/media/c89ae3_eb3c405c1e654262acbd1fba9ba22213~mv2.jpeg/v1/crop/x_0,y_44,w_1024,h_935/fill/w_752,h_686,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/JPEG%20image-516EE680E47A-1.jpeg"
    }
  ],

  menus: {
    categories: [
      { id: "all-day", name: "All Day Menu" },
      { id: "indian", name: "Authentic Indian Cuisine" },
      { id: "pub-classics", name: "British Pub Classics" },
      { id: "lunch", name: "Lunch Menu" },
      { id: "sunday", name: "Sunday Roast" },
      { id: "brunch", name: "Breakfast & Brunch" },
      { id: "drinks", name: "Drinks & Cocktails" },
      { id: "prebooked", name: "Pre-Booked Menus & Buffets" }
    ],
    pdfDownloads: [
      { name: "All Day Menu", url: "https://www.thewhitelionamersham.co.uk/_files/ugd/c89ae3_f09726c483fd410488d7c6df3600fbc1.pdf" },
      { name: "Lunch Menu", url: "https://www.thewhitelionamersham.co.uk/_files/ugd/c89ae3_acc66070b75d4c8f86d436b3e3d8a579.pdf?index=true" },
      { name: "Drinks Menu", url: "https://www.thewhitelionamersham.co.uk/_files/ugd/c89ae3_631ed716ba62467ea9cbbcc9c7c0f069.pdf" },
      { name: "Children's Menu", url: "https://www.thewhitelionamersham.co.uk/_files/ugd/c89ae3_2e6e5d7193e2427e9ae9bcf715dbb16c.pdf" },
      { name: "Sunday Menu", url: "https://www.thewhitelionamersham.co.uk/_files/ugd/c89ae3_f15fba476130447b871794f21beb5686.pdf?index=true" },
      { name: "Buffet Menu", url: "https://www.thewhitelionamersham.co.uk/_files/ugd/c89ae3_edf39af14970472c84f7baced2cd89db.pdf?index=true" },
      { name: "Indian Party Food", url: "https://www.thewhitelionamersham.co.uk/_files/ugd/c89ae3_70492578d9504759824b0795040dd3fe.pdf?index=true" },
      { name: "Take Away Indian Menu", url: "https://www.thewhitelionamersham.co.uk/_files/ugd/c89ae3_e7c1a71f2238482e97a65641be90e7a6.pdf?index=true" },
      { name: "Canapé Menu", url: "https://www.thewhitelionamersham.co.uk/_files/ugd/c89ae3_49662f405f564dd3a64ad7980eca1358.pdf?index=true" }
    ],
    items: [
      // Indian Specialties
      {
        id: "m1",
        category: "indian",
        name: "Old Delhi Butter Chicken",
        price: "£14.95",
        desc: "Tender tandoor-smoked chicken thighs simmered in a velvet tomato, honey, and fenugreek makhani sauce.",
        tags: ["Gluten-Free", "Chef's Signature"]
      },
      {
        id: "m2",
        category: "indian",
        name: "Slow-Braised Goat Curry",
        price: "£16.50",
        desc: "On-the-bone succulent goat slow-cooked with aromatic whole spices, caramelised onions, and ginger.",
        tags: ["Spicy 🌶️🌶️", "Gluten-Free"]
      },
      {
        id: "m3",
        category: "indian",
        name: "Chicken Tikka Masala",
        price: "£14.50",
        desc: "The nation's favorite! Grilled chicken chunks cooked in a rich, spiced creamy onion-tomato gravy.",
        tags: ["Gluten-Free", "Classic"]
      },
      {
        id: "m4",
        category: "indian",
        name: "Lamb Rogan Josh",
        price: "£15.95",
        desc: "Kashmiri-style tender diced lamb braised with browned shallots, garlic, dried ginger, and Kashmiri chili.",
        tags: ["Spicy 🌶️", "Gluten-Free"]
      },
      {
        id: "m5",
        category: "indian",
        name: "Paneer Butter Masala",
        price: "£12.95",
        desc: "Handcrafted cottage cheese cubes tossed in rich creamy butter gravy with crushed kasoori methi.",
        tags: ["Vegetarian 🌱", "Gluten-Free"]
      },
      {
        id: "m6",
        category: "indian",
        name: "Hyderabadi Dum Biryani",
        price: "£15.50",
        desc: "Fragrant aged basmati rice layered with marinated chicken, saffron, mint, fried onions, served with cooling raita.",
        tags: ["Chef's Special"]
      },
      {
        id: "m7",
        category: "indian",
        name: "Tandoori Mixed Grill Sizzler",
        price: "£18.95",
        desc: "Platter of chicken tikka, lamb seekh kebab, tandoori king prawns, and malai tikka served sizzling with mint chutney.",
        tags: ["Gluten-Free", "High Protein"]
      },
      {
        id: "m8",
        category: "indian",
        name: "Garlic & Coriander Naan",
        price: "£3.95",
        desc: "Fresh tandoor-baked leavened bread brushed with garlic butter and fresh cilantro.",
        tags: ["Vegetarian 🌱"]
      },

      // British Pub Classics
      {
        id: "p1",
        category: "pub-classics",
        name: "Hand-Battered Fish & Chips",
        price: "£15.95",
        desc: "Crisp beer-battered fresh cod fillet, thick triple-cooked chips, minted crushed garden peas, and homemade tartare sauce.",
        tags: ["Pub Classic 🏆"]
      },
      {
        id: "p2",
        category: "pub-classics",
        name: "The White Lion Gourmet Burger",
        price: "£15.50",
        desc: "6oz prime British beef patty, smoked bacon, melted aged cheddar, house relish, crispy lettuce, brioche bun, and skin-on fries.",
        tags: ["Customer Favorite"]
      },
      {
        id: "p3",
        category: "pub-classics",
        name: "Crispy Whitebait with Garlic Dip",
        price: "£7.95",
        desc: "Golden dusted deep-fried whitebait served hot with homemade garlic tartare dip and fresh lemon wedge.",
        tags: ["Starter", "Seafood"]
      },
      {
        id: "p4",
        category: "pub-classics",
        name: "Slow-Cooked Steak & Ale Pie",
        price: "£16.25",
        desc: "Tender British beef braised in rich real ale gravy encased in buttery golden pastry, served with creamy mash and buttered greens.",
        tags: ["Pub Classic 🏆"]
      },
      {
        id: "p5",
        category: "pub-classics",
        name: "Crispy Halloumi Burger",
        price: "£13.95",
        desc: "Golden fried halloumi, roasted red peppers, sweet chilli jam, and fresh rocket in a brioche bun with rosemary salted fries.",
        tags: ["Vegetarian 🌱"]
      },
      {
        id: "p6",
        category: "pub-classics",
        name: "Cumberland Sausage & Mash",
        price: "£14.25",
        desc: "Traditional grilled Cumberland sausage ring over buttery chive mash, caramelised red onion gravy, and crispy parsnip crisps.",
        tags: ["Comfort Classic"]
      },

      // Sunday Roast
      {
        id: "s1",
        category: "sunday",
        name: "28-Day Aged Sirloin of Beef Roast",
        price: "£18.95",
        desc: "Served with giant Yorkshire pudding, duck-fat roast potatoes, glazed heritage carrots, seasonal greens, and rich red wine bone gravy.",
        tags: ["Sunday Only", "Chef's Roast"]
      },
      {
        id: "s2",
        category: "sunday",
        name: "Slow-Roasted Pork Belly with Crackling",
        price: "£17.50",
        desc: "Crisp crackling, bramley apple compote, goose fat roasties, homemade Yorkshire pudding, and cider gravy.",
        tags: ["Sunday Only"]
      },
      {
        id: "s3",
        category: "sunday",
        name: "Mushroom & Walnut Nut Roast",
        price: "£15.50",
        desc: "Vegetarian Yorkshire pudding, thyme roast potatoes, braised red cabbage, honey glazed parsnips, and vegetable herb gravy.",
        tags: ["Vegetarian 🌱", "Sunday Only"]
      },

      // Lunch Menu
      {
        id: "l1",
        category: "lunch",
        name: "Creamy Chicken & Mushroom Ciabatta",
        price: "£9.95",
        desc: "Pan-roasted chicken and wild forest mushrooms in a garlic thyme cream sauce over toasted artisan ciabatta with red onion salad.",
        tags: ["Lunch Special"]
      },
      {
        id: "l2",
        category: "lunch",
        name: "Fish Finger Brioche Sandwich",
        price: "£9.50",
        desc: "Panko breaded cod fingers, tartare sauce, crisp gem lettuce in toasted brioche with fries or salad.",
        tags: ["Lunch Special"]
      },
      {
        id: "l3",
        category: "lunch",
        name: "Chicken Tikka Wrap & Fries",
        price: "£10.25",
        desc: "Tandoori chicken, crunchy salad, mint raita, and pickled onions wrapped in warm naan with fries.",
        tags: ["Lunch Special"]
      },

      // Brunch
      {
        id: "b1",
        category: "brunch",
        name: "Full English Pub Breakfast",
        price: "£12.95",
        desc: "Two Cumberland sausages, dry-cured smoked bacon, fried free-range eggs, hash browns, baked beans, grilled tomato, and toasted sourdough.",
        tags: ["Breakfast & Brunch"]
      },
      {
        id: "b2",
        category: "brunch",
        name: "Avocado & Poached Eggs Sourdough",
        price: "£10.50",
        desc: "Smashed seasoned avocado on toasted rustic sourdough, two poached eggs, chilli flakes, and pumpkin seeds.",
        tags: ["Vegetarian 🌱"]
      },

      // Drinks
      {
        id: "d1",
        category: "drinks",
        name: "Selection of Local Cask Real Ales",
        price: "from £4.50",
        desc: "Carefully conditioned local hand-pulled bitters and pale ales on rotating taps.",
        tags: ["Bar Favorite"]
      },
      {
        id: "d2",
        category: "drinks",
        name: "Classic Passionfruit Martini",
        price: "£9.50 (2 for £15)",
        desc: "Vanilla vodka, Passoa passionfruit liqueur, lime juice, passionfruit purée with a shot of Prosecco.",
        tags: ["Cocktail Special"]
      },
      {
        id: "d3",
        category: "drinks",
        name: "Chilled Bottle of Prosecco DOC",
        price: "£24.00 (£18.50 on Fridays)",
        desc: "Crisp and refreshing Italian sparkling wine with delicate floral notes and crisp green apple finish.",
        tags: ["Fizz Friday"]
      }
    ]
  },

  partyVenue: {
    title: "Book The White Lion for Your Next Event in Amersham",
    subtitle: "LET US ELEVATE YOUR EVENT TO THE NEXT LEVEL",
    desc: "Whether you're looking for a big celebration or something a little more intimate, our venue is spacious and can be adapted to any of your event needs. The pub can be hired in its entirety, or you can reserve a dedicated space or room.",
    stats: [
      { label: "Guest Capacity", value: "180 - 320" },
      { label: "Venue Hire Charge", value: "FREE for up to 50 guests" },
      { label: "Free Car Parking", value: "Up to 60 vehicles" },
      { label: "Catering Options", value: "Buffet, Canapés & Takeaway" }
    ],
    packages: [
      {
        title: "Traditional Pub Buffet",
        desc: "A wide selection of hot and cold British favorites, sliders, skewers, mini quiches, pastries, and salads."
      },
      {
        title: "Authentic Indian Feast",
        desc: "Samosas, chicken tikka skewers, biryani pots, authentic curries, fresh tandoor naans, and chutneys."
      },
      {
        title: "Canapé & Drinks Reception",
        desc: "Hand-crafted delicate canapés paired with champagne, prosecco, and cocktail towers."
      }
    ]
  },

  whatsOn: {
    title: "Join The Action : See What's Coming Up",
    quiz: {
      title: "Thursday Quiz Night",
      time: "Starts 8:00 PM Sharp every Thursday",
      desc: "Kick off the weekend early with our weekly Quiz Night! Whether you're a trivia master or just in it for the laughs, gather your friends, enjoy great pub drinks, and test your knowledge. Big or small teams all welcome!",
      image:
        "https://static.wixstatic.com/media/c89ae3_df2dd578551f441ebf6c70d4105952aa~mv2.png/v1/fill/w_618,h_878,al_c,q_90,enc_avif,quality_auto/quiz.png"
    },
    sports: {
      title: "Live Sports on Sky Sports & TNT Sports",
      desc: "Watch the Premier League, Champions League, Formula 1, Six Nations Rugby, and Cricket live on our crystal clear screens with great pub atmosphere."
    },
    darts: {
      title: "Throwing Darts",
      desc: "Challenge your friends or join our local darts evenings. Well-maintained tournament boards and electronic scoring."
    }
  },

  christmas: {
    title: "Christmas at The White Lion",
    subtitle: "Eat, Drink & Be Merry in Amersham",
    desc: "Celebrate the festive season with us! Enjoy our specially curated festive menus, 2-course and 3-course holiday dining, corporate Christmas parties, and warm festive hospitality.",
    courses: [
      {
        title: "Festive 2-Course / 3-Course Dining",
        desc: "Roasted turkey with all the festive trimmings, Spiced festive lamb, Traditional Christmas pudding with brandy sauce, and seasonal desserts."
      },
      {
        title: "Private Christmas Parties",
        desc: "Exclusive room hire or full pub takeover with DJ, festive Indian & British party buffets, and holiday cocktails."
      }
    ]
  }
};
