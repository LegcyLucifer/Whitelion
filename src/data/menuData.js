import { siteData } from './siteData';

/**
 * menuData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all White Lion menu content.
 *
 * DATA POLICY (Part 4, §6):
 *  • isVeg / isVegan — set ONLY where the source PDF explicitly marks (V) or (VG).
 *    Never inferred from ingredients.
 *  • isChilli — set where the dish name contains "chilli" or "chili".
 *  • hasGluten — true by default; set false only for dishes that are
 *    explicitly confirmed gluten-free by the kitchen.
 *  • allergens — the UK 14 mandatory allergens this dish carries, as declared
 *    in the source PDFs. Absence ≠ allergen-free guarantee.
 *
 * OPEN ITEMS (awaiting confirmation — see Part 4, §5):
 *  • Four dishes differ in price between All Day and Lunch tabs.
 *    Each tab currently shows its own source price. Merge once confirmed.
 *  • Drinks list has diverged between All Day PDF and standalone Drinks PDF.
 *    Drinks tab currently uses the standalone Drinks Menu as primary.
 *  • "Sulphur" on Party PDFs corrected to "Sulphites" throughout (§3).
 *  • Breakfast/brunch (Sat–Sun 8:30–11:30am) starts before the kitchen's
 *    general opening time (11am on siteData.foodServingHours). The "what's
 *    available now" list is gated on the kitchen being open, so it won't
 *    surface breakfast between 8:30–11am. Confirm whether breakfast really
 *    runs on a separate, earlier line before changing this gate.
 */

/* ─── ALLERGEN LEGEND ────────────────────────────────────────────────────────
   Defined once, rendered as a shared footer key on every tab.
   Standardised on "Sulphites" (legally correct UK term).
────────────────────────────────────────────────────────────────────────────── */
export const ALLERGEN_LEGEND = [
  { code: 'V',   label: 'Vegetarian' },
  { code: 'VG',  label: 'Vegan' },
  { code: 'GF',  label: 'No gluten listed' },
  { code: 'N',   label: 'Nuts' },
  { code: 'D',   label: 'Dairy' },
  { code: 'E',   label: 'Eggs' },
  { code: 'C',   label: 'Celery' },
  { code: 'M',   label: 'Mustard' },
  { code: 'L',   label: 'Lupin' },
  { code: 'S',   label: 'Sulphites' },
  { code: 'CEL', label: 'Celery' },
  { code: 'F',   label: 'Fish' },
  { code: 'SES', label: 'Sesame' },
  { code: 'Mus', label: 'Mustard' },
  { code: 'P',   label: 'Peanuts' },
  { code: 'Soy', label: 'Soya' },
  { code: 'Mol', label: 'Molluscs' },
  { code: 'Cr',  label: 'Crustaceans' },
];

/* ─── AVAILABILITY ENGINE ────────────────────────────────────────────────────
   computeToday() encodes all the availability rules scattered as headers and
   footnotes across the 11 PDFs into one function (Part 4, §4).

   Kitchen hours were previously a second, hand-typed copy of
   siteData.foodServingHours and had drifted from it (this copy said
   Sat/Sun opened at 12pm; the Contact page — reading siteData directly —
   correctly said 11am). Derived from siteData below instead, so there is
   exactly one place to update food-serving hours.
────────────────────────────────────────────────────────────────────────────── */
const DAY_INDEX = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const WEEK_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function parseTimeToHour(str) {
  const m = str.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h + min / 60;
}

function expandDayRange(daysStr) {
  const parts = daysStr.split('-').map((s) => s.trim().slice(0, 3));
  if (parts.length === 1) return [DAY_INDEX[parts[0]]];
  const start = WEEK_ORDER.indexOf(parts[0]);
  const end = WEEK_ORDER.indexOf(parts[1]);
  return WEEK_ORDER.slice(start, end + 1).map((d) => DAY_INDEX[d]);
}

const KITCHEN_HOURS_BY_DAY = {};
siteData.foodServingHours.forEach((row) => {
  const [openStr, closeStr] = row.hours.split('-').map((s) => s.trim());
  const open = parseTimeToHour(openStr);
  const close = parseTimeToHour(closeStr);
  expandDayRange(row.days).forEach((dayIdx) => {
    KITCHEN_HOURS_BY_DAY[dayIdx] = { open, close };
  });
});

export function computeToday(now = new Date()) {
  const day  = now.getDay();  // 0=Sun, 1=Mon … 6=Sat
  const hour = now.getHours();
  const min  = now.getMinutes();
  const hm   = hour + min / 60;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const kh = KITCHEN_HOURS_BY_DAY[day];
  const kitchenOpen = hm >= kh.open && hm < kh.close;

  const fmt = (h) => {
    const suffix = h >= 12 ? 'pm' : 'am';
    const disp   = h > 12 ? h - 12 : h;
    return `${disp}${suffix}`;
  };

  const available = [];

  if (kitchenOpen) {
    // All Day — available whenever kitchen is open
    available.push({ tabId: 'all-day', name: 'All Day Menu', until: `Available until ${fmt(kh.close)}` });

    // Breakfast & Brunch — Sat/Sun only
    if ((day === 6 || day === 0) && hm >= 8.5 && hm < 17) {
      const breakfastUntil = hm < 11.5 ? '11:30am' : null;
      available.push({
        tabId: 'breakfast',
        name: 'Breakfast & Brunch',
        until: breakfastUntil ? `Breakfast till ${breakfastUntil}, Brunch till 5pm` : 'Brunch available until 5pm'
      });
    }

    // Lunch — weekdays 12–4pm (or all day Thursday)
    const isWeekday = day >= 1 && day <= 5;
    if (isWeekday && (hm >= 12 && hm < 16)) {
      available.push({ tabId: 'lunch', name: 'Lunch Menu', until: day === 4 ? 'Available all day (Thursday)' : 'Available until 4pm' });
    } else if (day === 4 && hm >= 12 && hm < kh.close) {
      // All-day Thursday exception
      available.push({ tabId: 'lunch', name: 'Lunch Menu (all-day Thursday)', until: `Available until ${fmt(kh.close)}` });
    }

    // Sunday Roast — Sundays only
    if (day === 0) {
      available.push({ tabId: 'sunday-roast', name: 'Sunday Roast', until: 'Available until 8pm' });
    }

    // Drinks — always available when kitchen is open
    available.push({ tabId: 'drinks', name: 'Drinks Menu', until: `Available until ${fmt(kh.close)}` });
  }

  /* Week schedule for the Today tab's reference table — the kitchen rows
     are siteData.foodServingHours itself (same rows Contact shows), not a
     third hand-typed copy. */
  const schedule = [
    { label: 'All Day Menu',     hours: 'Mon–Sun, kitchen hours' },
    { label: 'Breakfast',        hours: 'Sat–Sun, 8:30–11:30am' },
    { label: 'Brunch',           hours: 'Sat–Sun, 8:30am–5pm' },
    { label: 'Lunch',            hours: 'Mon–Fri, 12–4pm (all day Thu)' },
    { label: 'Sunday Roast',     hours: 'Sundays only, 12–8pm' },
    ...siteData.foodServingHours.map((row) => ({ label: `Kitchen (${row.days})`, hours: row.hours })),
  ];

  const timeLabel = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return {
    kitchenOpen,
    opensAt: fmt(kh.open),
    closesAt: fmt(kh.close),
    dayLabel: dayNames[day],
    timeLabel,
    available,
    schedule,
  };
}

/* ─── DISH FACTORY ──────────────────────────────────────────────────────────  */
function dish(name, price, desc = '', opts = {}) {
  return {
    name,
    price,
    desc,
    isVeg:    opts.isVeg    ?? false,
    isVegan:  opts.isVegan  ?? false,
    hasGluten: opts.hasGluten ?? true,
    isChilli: opts.isChilli ?? (name.toLowerCase().includes('chilli') || name.toLowerCase().includes('chili')),
    allergens: opts.allergens ?? [],
    tags: [
      ...(opts.isVegan  ? ['Vegan (VG)']      : []),
      ...(opts.isVeg && !opts.isVegan ? ['Vegetarian (V)'] : []),
      ...(opts.hasGluten === false ? ['No gluten listed'] : []),
      ...(opts.tags ?? []),
    ],
  };
}

/* ─── ALL DAY MENU ──────────────────────────────────────────────────────────  */
const allDaySections = [
  {
    name: 'Starters',
    items: [
      dish('Soup of the Day (V)',          '£5.95', 'Served with crusty bread. Please ask your server for today\'s soup.', { isVeg: true }),
      dish('Garlic Bread (V)',             '£4.50', 'Toasted baguette with garlic butter.', { isVeg: true }),
      dish('Garlic Bread with Cheese (V)', '£5.25', 'Toasted baguette with garlic butter and melted cheese.', { isVeg: true }),
      dish('Prawn Cocktail',               '£7.95', 'North Atlantic prawns, Marie Rose sauce, iceberg lettuce, brown bread and butter.'),
      dish('Chicken Liver Pâté',           '£7.50', 'Served with toasted brioche, red onion marmalade and salad garnish.'),
      dish('Brie Wedges (V)',              '£7.50', 'Deep fried in breadcrumbs, served with a cranberry dipping sauce.', { isVeg: true }),
      dish('Scampi & Chips',               '£8.50', 'Breaded scampi, chunky chips and tartare sauce.'),
    ]
  },
  {
    name: 'Handmade Burgers',
    items: [
      dish('Classic Burger',                '£13.00', 'Beef patty, burger sauce, iceberg lettuce, sliced tomato and gherkin in a brioche bun. Served with chunky chips.'),
      dish('Beef Burger with Cheese & Bacon', '£16.00', 'Beef patty, streaky bacon, cheddar, burger sauce, iceberg lettuce, sliced tomato and gherkin in a brioche bun. Served with chunky chips. Optional: +£6 extra pattie, +£2 extra bacon.'),
      dish('Chicken Burger',                '£14.50', 'Breaded chicken breast, burger sauce, iceberg lettuce and sliced tomato in a brioche bun. Served with chunky chips.'),
      dish('Veggie Burger (V)',             '£12.00', 'Homemade veggie patty, burger sauce, iceberg lettuce, sliced tomato and gherkin in a brioche bun. Served with chunky chips.', { isVeg: true }),
    ]
  },
  {
    name: 'Signature Handmade Pizzas',
    items: [
      dish('Classic Margherita (V)',       '£11.50', 'San Marzano tomato base, mozzarella, fresh basil.', { isVeg: true }),
      dish('Pepperoni',                    '£13.50', 'San Marzano tomato base, mozzarella, spicy pepperoni.'),
      dish('BBQ Chicken',                  '£14.00', 'BBQ sauce base, mozzarella, grilled chicken, red onion, jalapeños.'),
      dish('Veggie Supreme (V)',           '£13.00', 'San Marzano tomato base, mozzarella, roasted peppers, mushrooms, red onion, olives, sweetcorn.', { isVeg: true }),
      dish('Meat Feast',                   '£15.00', 'San Marzano tomato base, mozzarella, pepperoni, ham, beef, spicy sausage.'),
    ]
  },
  {
    name: 'Classic Pub Mains',
    items: [
      dish('Beer Battered Fish & Chips',   '£15.95', 'Cod fillet in light beer batter, chunky chips, mushy peas and tartare sauce.'),
      dish('Scampi & Chips',              '£13.95', 'Breaded scampi, chunky chips, garden peas and tartare sauce.'),
      dish('Sausage & Mash',             '£13.50', 'Three pork sausages, creamy mashed potato, seasonal vegetables and rich onion gravy.'),
      dish('Chicken & Mushroom Pie',     '£14.95', 'Slow-cooked chicken and mushroom in a rich sauce, topped with shortcrust pastry. Served with mashed potato and seasonal veg.'),
      dish('Steak & Ale Pie',            '£15.95', 'Slow-cooked braised beef and ale, topped with shortcrust pastry. Served with mashed potato and seasonal veg.'),
      dish('Lasagne',                    '£13.95', 'Traditional beef lasagne layered with béchamel, served with garlic bread and dressed salad.'),
      dish('Confit Duck',                '£14.50', 'Slow-cooked duck leg, dauphinoise potatoes, broccoli, red wine and cherry sauce.'),
      dish('White Lion Bowl',            '£14.50', 'A generous bowl of seasoned rice, grilled chicken, roasted peppers, mixed salad, and house dressing.'),
      dish('Halloumi Bowl (V)',           '£13.50', 'Seasoned rice, grilled halloumi, roasted peppers, mixed salad, and house dressing.', { isVeg: true }),
    ]
  },
  {
    name: 'Indian Kitchen',
    items: [
      dish('Chicken Tikka Masala',        '£13.95', 'Tender chicken tikka in a rich creamy tomato sauce. Served with rice and naan.'),
      dish('Goat Curry (on bone)',        '£14.95', 'Our signature dish — slow-cooked bone-in goat in a warming aromatic sauce. Served with rice and naan.'),
      dish('Lamb Rogan Josh',             '£14.50', 'Slow-cooked Kashmiri-spiced lamb. Served with rice and naan.'),
      dish('Butter Chicken',              '£13.50', 'Mild, creamy tomato and butter sauce with tender chicken. Served with rice and naan.'),
      dish('Dal Makhani (V)',             '£11.95', 'Slow-cooked black lentils in a rich buttery tomato sauce. Served with rice and naan.', { isVeg: true }),
      dish('Chilli Paneer (V)',           '£12.50', 'Indo-Chinese style paneer with peppers, onions, soy and chilli sauce.', { isVeg: true }),
      dish('Vegetable Biryani (VG)',      '£12.50', 'Fragrant basmati rice with seasonal vegetables and whole spices. Served with raita.', { isVegan: true }),
      dish('Lamb Biryani',               '£14.95', 'Fragrant basmati rice with slow-cooked Kashmiri spiced lamb. Served with raita.'),
      dish('Chicken Biryani',            '£13.95', 'Fragrant basmati rice with tandoori-spiced chicken. Served with raita.'),
      dish('Prawn Balti',                '£14.50', 'King prawns in a tangy tomato-based Balti sauce. Served with rice and naan.'),
    ]
  },
  {
    name: 'On the Side',
    items: [
      dish('Chunky Chips (VG)',           '£3.50', '', { isVegan: true }),
      dish('Onion Rings (V)',             '£3.50', '', { isVeg: true }),
      dish('Side Salad (VG)',             '£3.00', '', { isVegan: true }),
      dish('Creamy Mash (V)',             '£3.50', '', { isVeg: true }),
      dish('Garlic Naan (V)',             '£2.50', '', { isVeg: true }),
      dish('Peshwari Naan (V)',           '£2.95', 'Sweet coconut and almond naan.', { isVeg: true }),
      dish('Boiled Rice (VG)',            '£2.50', '', { isVegan: true }),
    ]
  },
  {
    name: 'Desserts',
    items: [
      dish('Sticky Toffee Pudding (V)',   '£6.95', 'Warm sponge cake with toffee sauce, served with vanilla ice cream.', { isVeg: true }),
      dish('Chocolate Fudge Cake (V)',    '£6.50', 'Rich chocolate fudge cake served with vanilla ice cream or cream.', { isVeg: true }),
      dish('Cheesecake of the Day (V)',   '£6.50', 'Ask your server for today\'s flavour. Served with cream.', { isVeg: true }),
      dish('Ice Cream (V)',               '£4.95', 'Three scoops of vanilla, chocolate or strawberry. Ask for today\'s flavours.', { isVeg: true }),
      dish('Gajar Halwa (V)',             '£5.50', 'Traditional Indian carrot dessert with cardamom and pistachios, served warm.', { isVeg: true }),
      dish('Malai Kulfi (V)',             '£5.00', 'Traditional Indian ice cream in pistachio, mango or rose flavour.', { isVeg: true }),
    ]
  },
];

/* ─── BREAKFAST & BRUNCH ─────────────────────────────────────────────────────  */
const breakfastSections = [
  {
    name: 'Full Breakfasts (until 11:30am Sat–Sun)',
    items: [
      dish('Full English Breakfast',      '£10.95', 'Two rashers of back bacon, two pork sausages, two fried eggs, grilled mushroom, grilled tomato, baked beans and toast.'),
      dish('Vegetarian Full Breakfast (V)', '£9.95', 'Two veggie sausages, two fried eggs, grilled mushroom, grilled tomato, baked beans, hash brown and toast.', { isVeg: true }),
      dish('Eggs Benedict',               '£9.50', 'Two free-range poached eggs, hollandaise, Canadian bacon on a toasted English muffin.'),
      dish('Eggs Florentine (V)',         '£8.95', 'Two free-range poached eggs, hollandaise, wilted spinach on a toasted English muffin.', { isVeg: true }),
      dish('Eggs Royale',                 '£10.95', 'Two free-range poached eggs, hollandaise, smoked salmon on a toasted English muffin.'),
    ]
  },
  {
    name: 'Brunch (until 5pm Sat–Sun)',
    items: [
      dish('Pancake Stack (V)',           '£8.95', 'Three fluffy American pancakes with maple syrup and butter. Add bacon +£2.00.', { isVeg: true }),
      dish('Avocado Toast (VG)',          '£9.50', 'Sourdough toast with smashed avocado, cherry tomatoes, chilli flakes and a drizzle of olive oil.', { isVegan: true }),
      dish('Smoked Salmon & Cream Cheese Bagel', '£9.95', 'Toasted bagel, cream cheese, smoked salmon, capers and dill.'),
      dish('Granola & Yoghurt (V)',       '£6.95', 'Homemade granola with Greek yoghurt and seasonal berry compote.', { isVeg: true }),
      dish('Belgian Waffles (V)',         '£8.50', 'Two waffles with whipped cream, fresh berries and maple syrup.', { isVeg: true }),
      dish('Croque Monsieur',             '£9.50', 'Toasted sourdough, ham, Gruyère and béchamel, grilled until golden.'),
    ]
  },
];

/* ─── LUNCH ──────────────────────────────────────────────────────────────────  */
const lunchSections = [
  {
    name: 'Set Menu',
    items: [
      dish('2 Courses for Two', '£30.00', 'Available Mon–Fri 12–4pm and all day Thursday. Choose any two starters and two mains from the lunch menu.', { isVeg: false }),
    ]
  },
  {
    name: 'Light Bites & Sandwiches',
    items: [
      dish('Club Sandwich',               '£9.50', 'Triple-decker with chicken, bacon, egg, lettuce and tomato. Served with chips.'),
      dish('BLT Sandwich',                '£8.50', 'Back bacon, crisp lettuce, sliced tomato on malted bloomer. Served with chips.'),
      dish('Mature Cheddar Ploughman\'s (V)', '£9.50', 'Mature cheddar, Branston pickle, dressed salad, celery, apple and crusty bread.', { isVeg: true }),
      dish('Smoked Salmon Bagel',         '£9.95', 'Toasted bagel, cream cheese, smoked salmon, capers and dill.'),
      dish('Soup & Sandwich',             '£9.95', 'Soup of the day with a half sandwich of your choice. Ask your server for today\'s options.'),
    ]
  },
  {
    name: 'Lunch Mains',
    items: [
      dish('Classic Margherita Pizza (V)', '£10.50', 'San Marzano tomato base, mozzarella, fresh basil.', { isVeg: true }),
      dish('Beef Burger with Cheese & Bacon', '£11.50', 'Beef patty, cheddar, bacon, burger sauce, lettuce, tomato in a brioche bun. Served with chips.'),
      dish('Beer Battered Fish & Chips',  '£13.95', 'Cod fillet in light beer batter, chunky chips, mushy peas and tartare sauce.'),
      dish('Chicken Caesar Salad',        '£11.50', 'Grilled chicken breast, romaine lettuce, parmesan, croutons, Caesar dressing.'),
      dish('Confit Duck',                 '£13.75', 'Slow-cooked duck leg, dauphinoise potatoes, red wine and cherry sauce.'),
      dish('White Lion Bowl',             '£11.50', 'A generous bowl of seasoned rice, grilled chicken, roasted peppers, mixed salad, and house dressing.'),
      dish('Dal Makhani (V)',             '£10.50', 'Slow-cooked black lentils in a rich buttery tomato sauce. Served with rice and naan.', { isVeg: true }),
      dish('Chicken Tikka Masala',        '£12.50', 'Tender chicken tikka in a rich creamy tomato sauce. Served with rice and naan.'),
    ]
  },
];

/* ─── SUNDAY ROAST ───────────────────────────────────────────────────────────  */
const sundayRoastSections = [
  {
    name: 'Sunday Roasts',
    items: [
      dish('Roast Topside of Beef',       '£16.95', 'Slow-roasted topside of British beef, served with roast potatoes, Yorkshire pudding, honey-glazed carrots, seasonal vegetables and rich beef gravy.'),
      dish('Roast Leg of Lamb',           '£16.50', 'Slow-roasted British lamb, mint sauce, roast potatoes, Yorkshire pudding, honey-glazed carrots, seasonal vegetables and red wine gravy.'),
      dish('Roast Chicken',               '£15.50', 'Half roasted chicken, pigs in blankets, roast potatoes, Yorkshire pudding, honey-glazed carrots, seasonal vegetables and chicken gravy.'),
      dish('Roast Pork',                  '£15.50', 'Slow-roasted pork with apple sauce and crackling, roast potatoes, Yorkshire pudding, honey-glazed carrots, seasonal vegetables and cider gravy.'),
      dish('Nut Roast (VG)',              '£13.95', 'Homemade mixed nut roast with roast potatoes, Yorkshire pudding (may contain egg — ask server), honey-glazed carrots, seasonal vegetables and vegetable gravy.', { isVegan: true }),
      dish('Kids Roast',                  '£8.95', 'Smaller portion of roast chicken or beef with roast potatoes, carrots and gravy.'),
    ]
  },
  {
    name: 'Sunday Sides',
    items: [
      dish('Extra Yorkshire Pudding (V)', '£1.50', '', { isVeg: true }),
      dish('Cauliflower Cheese (V)',      '£3.95', 'Baked cauliflower in a creamy cheese sauce.', { isVeg: true }),
      dish('Extra Roast Potatoes (VG)',   '£3.50', '', { isVegan: true }),
      dish('Pig in Blanket',             '£2.50', 'Two pigs in blankets.'),
    ]
  },
  {
    name: 'Sunday Desserts',
    items: [
      dish('Sticky Toffee Pudding (V)',   '£6.95', 'Warm sponge with toffee sauce and vanilla ice cream.', { isVeg: true }),
      dish('Chocolate Brownie (V)',       '£6.50', 'Warm brownie with vanilla ice cream.', { isVeg: true }),
      dish('Ice Cream Selection (V)',     '£4.95', 'Three scoops. Ask for today\'s flavours.', { isVeg: true }),
    ]
  },
];

/* ─── JUNIOR MENU ────────────────────────────────────────────────────────────  */
const juniorSections = [
  {
    name: 'Junior Mains',
    items: [
      dish('Mini Fish & Chips',           '£7.50', 'Battered fish fillet, chips and baked beans.'),
      dish('Mini Chicken Nuggets',        '£7.50', 'Six breaded chicken nuggets with chips and baked beans.'),
      dish('Mini Margherita Pizza (V)',   '£7.00', 'Tomato base and mozzarella.', { isVeg: true }),
      dish('Mini Sausage & Mash',        '£7.00', 'Two pork sausages, mashed potato and gravy.'),
      dish('Mini Pasta Bolognese',       '£7.00', 'Penne pasta in a beef tomato sauce with parmesan.'),
      dish('Mini Veggie Pasta (V)',      '£6.50', 'Penne pasta in a tomato sauce with parmesan.', { isVeg: true }),
    ]
  },
  {
    name: 'Junior Desserts',
    items: [
      dish('Ice Cream (V)',               '£3.50', 'Two scoops of vanilla, chocolate or strawberry.', { isVeg: true }),
      dish('Chocolate Brownie (V)',       '£4.00', 'Warm brownie with ice cream.', { isVeg: true }),
    ]
  },
];

/* ─── DRINKS ─────────────────────────────────────────────────────────────────
   Primary source: standalone Drinks Menu PDF.
   Note: wine list has diverged from All Day Menu PDF — using Drinks Menu as
   primary. See open items §2. Awaiting confirmation.
────────────────────────────────────────────────────────────────────────────── */
const drinksSections = [
  {
    name: 'Draught',
    items: [
      dish('Pravha',           'Pint £4.80 / Half £2.60', 'Czech lager, 4.0%'),
      dish('Peroni',           'Pint £5.40 / Half £2.90', 'Italian lager, 5.0%'),
      dish('Camden Hells',     'Pint £5.20 / Half £2.80', 'London lager, 4.6%'),
      dish('Guinness',         'Pint £5.60 / Half £3.00', 'Irish dry stout, 4.2%'),
      dish('London Pride',     'Pint £4.90 / Half £2.70', 'Cask ale, 4.1%'),
      dish('Local Guest Ale',  'Pint £4.60 / Half £2.50', 'Ask your server for today\'s cask guest ale.'),
      dish('Aspall Cyder',     'Pint £5.00 / Half £2.70', 'Suffolk cider, 5.5%'),
    ]
  },
  {
    name: 'Bottles & Cans',
    items: [
      dish('Heineken 0.0',     '£3.80', 'Non-alcoholic lager'),
      dish('Corona Extra',     '£4.50', 'Mexican lager, 4.5%'),
      dish('Rekorderlig Strawberry-Lime', '£4.90', 'Swedish cider, 4.0%'),
      dish('Old Mout Berries & Cherries', '£4.80', 'New Zealand cider, 4.0%'),
      dish('Brewdog Punk IPA', '£5.00', 'Scottish IPA, 5.4%'),
    ]
  },
  {
    name: 'Wines by the Glass',
    items: [
      dish('House White (VG)', '125ml £4.80 / 175ml £6.20 / 250ml £8.20', 'Pinot Grigio, Italy — light, crisp, dry.', { isVegan: true }),
      dish('Sauvignon Blanc (VG)', '125ml £5.20 / 175ml £6.80 / 250ml £8.80', 'Marlborough, New Zealand.', { isVegan: true }),
      dish('Chardonnay',       '125ml £5.00 / 175ml £6.60 / 250ml £8.60', 'The Old Gum Tree, South Australia.'),
      dish('House Rosé (VG)',  '125ml £4.80 / 175ml £6.20 / 250ml £8.20', 'Grenache Rosé, France.', { isVegan: true }),
      dish('House Red (VG)',   '125ml £4.80 / 175ml £6.20 / 250ml £8.20', 'Shiraz-Cabernet, Australia — rich and smooth.', { isVegan: true }),
      dish('Malbec',           '125ml £5.20 / 175ml £6.80 / 250ml £8.80', 'Mendoza, Argentina — full-bodied.'),
      dish('Prosecco',         '125ml £5.50', 'Freixenet Prosecco DOC, Italy.'),
    ]
  },
  {
    name: 'Spirits & Mixers',
    items: [
      dish('House Gin & Tonic',           '£6.50', 'Gordon\'s gin with Fever-Tree tonic.'),
      dish('Hendrick\'s G&T',            '£8.50', 'Served with cucumber and elderflower tonic.'),
      dish('House Whisky',               '£4.50', 'Bell\'s Blended Scotch, measure.'),
      dish('Jack Daniel\'s Tennessee Whiskey', '£5.00', 'Measure.'),
      dish('House Vodka',                '£4.50', 'Smirnoff Red, measure.'),
      dish('Rum & Coke',                 '£5.50', 'Havana Club 3, Coca-Cola.'),
    ]
  },
  {
    name: 'Cocktails',
    items: [
      dish('White Lion Punch',           '£9.00', 'Vodka, passion fruit, pineapple, elderflower, lemonade.'),
      dish('Espresso Martini',           '£9.50', 'Vodka, Kahlúa, espresso, simple syrup.'),
      dish('Aperol Spritz',              '£9.00', 'Aperol, Prosecco, soda, orange slice.'),
      dish('Mojito',                     '£9.00', 'White rum, fresh lime, mint, sugar, soda.'),
      dish('Cosmopolitan',               '£9.50', 'Vodka, Cointreau, cranberry, fresh lime.'),
      dish('2 for £15 Cocktails',        '£15.00', 'Choose any two cocktails from the list above. Valid all day, every day.'),
    ]
  },
  {
    name: 'Soft Drinks & Hot Drinks',
    items: [
      dish('Coca-Cola / Diet Coke (VG)', '£3.20', '330ml can or draught pint.', { isVegan: true }),
      dish('Lemonade (VG)',              '£2.80', 'Still or sparkling.', { isVegan: true }),
      dish('Fresh Orange Juice (VG)',    '£3.50', '', { isVegan: true }),
      dish('J2O (VG)',                   '£3.50', 'Orange & Passionfruit or Apple & Mango.', { isVegan: true }),
      dish('Fever-Tree Ginger Beer (VG)', '£3.80', '', { isVegan: true }),
      dish('Coffee',                    '£3.00', 'Americano, cappuccino, latte or flat white.'),
      dish('Tea (V)',                    '£2.50', 'English Breakfast or herbal selection.', { isVeg: true }),
    ]
  },
];

/* ─── PRIVATE DINING & EVENTS ────────────────────────────────────────────────
   One dish list drives both Dine-In and Takeaway pricing.
   priceDineIn  = à la carte price
   priceTakeaway = included in the bundle (label only, not £ per dish)
   This prevents the drift problem where Party (dine-in) and Party (takeaway)
   PDFs diverged to become two separate documents. (Part 4, §2)
────────────────────────────────────────────────────────────────────────────── */
const privateDiningSections = [
  {
    name: 'Starters',
    items: [
      { ...dish('Onion Bhaji (V)',          '£5.50', 'Three crispy onion bhajis served with mint and coriander chutney.', { isVeg: true }), priceDineIn: '£5.50', priceTakeaway: 'Included in bundle' },
      { ...dish('Chicken Tikka',            '£7.50', 'Marinated chicken tikka pieces, grilled in the tandoor, served with mint raita.'), priceDineIn: '£7.50', priceTakeaway: 'Included in bundle' },
      { ...dish('Samosas (V)',              '£5.00', 'Two crispy vegetable samosas with tamarind chutney.', { isVeg: true }), priceDineIn: '£5.00', priceTakeaway: 'Included in bundle' },
      { ...dish('Sheekh Kebab',             '£7.50', 'Spiced minced lamb kebabs from the tandoor, served with mint raita.'), priceDineIn: '£7.50', priceTakeaway: 'Included in bundle' },
      { ...dish('Prawn Puri',               '£8.00', 'King prawns in a tangy sauce served on deep-fried bread.'), priceDineIn: '£8.00', priceTakeaway: 'Included in bundle' },
      { ...dish('Chilli Garlic Mogo (V)',   '£6.50', 'Cassava root fried and tossed in chilli garlic sauce.', { isVeg: true }), priceDineIn: '£6.50', priceTakeaway: 'Included in bundle' },
      { ...dish('Paneer Tikka (V)',         '£7.00', 'Marinated Indian cottage cheese from the tandoor, served with mint raita.', { isVeg: true }), priceDineIn: '£7.00', priceTakeaway: 'Included in bundle' },
      { ...dish('Mixed Starter Platter',   '£12.00', 'A selection of starters for two — onion bhajis, samosas, chicken tikka and sheekh kebab.'), priceDineIn: '£12.00', priceTakeaway: 'Included in bundle' },
    ]
  },
  {
    name: 'Mains',
    items: [
      { ...dish('Chicken Tikka Masala',     '£13.95', 'Tender chicken tikka in a rich creamy tomato sauce.'), priceDineIn: '£13.95', priceTakeaway: 'Included in bundle' },
      { ...dish('Lamb Rogan Josh',          '£14.50', 'Slow-cooked Kashmiri-spiced lamb.'), priceDineIn: '£14.50', priceTakeaway: 'Included in bundle' },
      { ...dish('Goat Curry (on bone)',     '£14.95', 'Our signature dish — slow-cooked bone-in goat in a warming aromatic sauce.'), priceDineIn: '£14.95', priceTakeaway: 'Included in bundle' },
      { ...dish('Butter Chicken',           '£13.50', 'Mild, creamy tomato and butter sauce with tender chicken.'), priceDineIn: '£13.50', priceTakeaway: 'Included in bundle' },
      { ...dish('Dal Makhani (V)',          '£11.95', 'Slow-cooked black lentils in a rich buttery tomato sauce.', { isVeg: true }), priceDineIn: '£11.95', priceTakeaway: 'Included in bundle' },
      { ...dish('Lamb Biryani',             '£14.95', 'Fragrant basmati rice with slow-cooked Kashmiri spiced lamb. Served with raita.'), priceDineIn: '£14.95', priceTakeaway: 'Included in bundle' },
      { ...dish('Chicken Biryani',          '£13.95', 'Fragrant basmati rice with tandoori-spiced chicken. Served with raita.'), priceDineIn: '£13.95', priceTakeaway: 'Included in bundle' },
      { ...dish('Vegetable Biryani (VG)',   '£12.50', 'Fragrant basmati rice with seasonal vegetables. Served with raita.', { isVegan: true }), priceDineIn: '£12.50', priceTakeaway: 'Included in bundle' },
      { ...dish('Indian Street Chilli Chicken', '£13.50', 'Crispy chicken tossed in a spicy Indo-Chinese chilli sauce.'), priceDineIn: '£13.50', priceTakeaway: 'Included in bundle' },
      { ...dish('Chilli Paneer (V)',        '£12.50', 'Indo-Chinese style paneer with peppers, onions, soy and chilli sauce.', { isVeg: true }), priceDineIn: '£12.50', priceTakeaway: 'Included in bundle' },
    ]
  },
  {
    name: 'Desserts',
    items: [
      { ...dish('Gajar Halwa (V)',          '£5.50', 'Traditional Indian carrot dessert with cardamom and pistachios.', { isVeg: true }), priceDineIn: '£5.50', priceTakeaway: 'Included in bundle' },
      { ...dish('Malai Kulfi (V)',          '£5.00', 'Traditional Indian ice cream — pistachio, mango or rose.', { isVeg: true }), priceDineIn: '£5.00', priceTakeaway: 'Included in bundle' },
      { ...dish('Gulab Jamun (V)',          '£5.00', 'Deep-fried milk dumplings in rose and cardamom syrup. Served with ice cream.', { isVeg: true }), priceDineIn: '£5.00', priceTakeaway: 'Included in bundle' },
    ]
  },
];

/* ─── ASSEMBLED MENU DATA ────────────────────────────────────────────────────  */
export const menuData = {
  allDay:        { sections: allDaySections },
  breakfast:     { sections: breakfastSections },
  lunch:         { sections: lunchSections },
  sundayRoast:   { sections: sundayRoastSections },
  junior:        { sections: juniorSections },
  drinks:        { sections: drinksSections },
  privateDining: { sections: privateDiningSections },
};
