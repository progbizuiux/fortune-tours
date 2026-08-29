/* Content for the journal index — /journal.
 *
 * A local module rather than a Strapi reader because there is no journal
 * content type in the CMS yet: `journals`, `articles`, `blogs` and `posts` all
 * 404 on the panel today. The one journal endpoint that exists,
 * app/api/journal/route.js, returns the HOME page's journal strip — three
 * promoted cards, not an archive — so it cannot back a paginated index.
 *
 * Shaped so the swap is a one-file change. The page and every component below
 * it are props-only and read exactly the keys here, so `getJournalIndex()` is
 * the single seam: point it at lib/strapi/journal.js when the collection
 * exists and keep the returned shape. Same split lib/packages.js uses.
 *
 * The first entry is the featured article the design sets above the grid; the
 * rest fill the grid, six to a page.
 */

/* The filter row. `all` is not a category an article carries — it is the
   unfiltered state — so it lives here rather than on the entries, and the row
   is rendered from this list so adding a category is one line. */
export const JOURNAL_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "guides", label: "Guides" },
  { key: "travel-tips", label: "Travel Tips" },
  { key: "stories", label: "Stories" },
  { key: "inspiration", label: "Inspiration" },
];

/** How many grid cards a page holds. Two rows of three, which is what the design draws. */
export const JOURNAL_PAGE_SIZE = 6;

const ARTICLES = [
  {
    slug: "what-to-know-before-you-plan-your-next-journey",
    category: "guides",
    kicker: "Field Notes",
    readingTime: "6 min read",
    date: "2026-08-15",
    dateLabel: "15 Aug 2026",
    title: "What to know before you plan your next journey",
    description:
      "From choosing the right time to travel and finding the right places to stay, to planning experiences that make the journey more meaningful, the little details can make a big difference. Discover practical tips to help you plan with confidence, avoid common travel hassles, and make the most of your time away.",
    image: "/home/journal/field-notes.png",
    imageAlt: "A walker on a hill path below a cliff face under heavy cloud",
    author: { name: "Mariya Josh", avatar: "/countries/africa/sarah.png" },
    body: [
      { type: "heading", text: "Start With How You Want to Travel" },
      {
        type: "paragraph",
        text: "A great journey doesn't always come from having the most detailed itinerary. It starts with understanding what you actually want from the trip. Maybe you want slow mornings, beautiful stays, and plenty of time to explore. Perhaps you're looking for adventure, local experiences, or a chance to discover somewhere completely new. Once you know what matters to you, choosing the destination, accommodation, experiences, and pace becomes much easier. The goal isn't to fit everything into one trip. It's to create a journey that feels right from the moment you leave home.",
      },
      { type: "heading", text: "Start With Your Travel Style" },
      {
        type: "paragraph",
        text: "Before choosing a destination, think about how you want to spend your time.",
      },
      {
        type: "paragraph",
        text: "Do you want to wake up slowly and spend your afternoons by the sea? Would you rather explore new places every day? Maybe you're travelling with family and need a comfortable balance between activities and downtime.",
      },
      {
        type: "paragraph",
        text: "Your travel style can help shape almost every other decision you make.",
      },
      {
        /* Term-and-definition pairs, not paragraphs with a bold first line —
           the frame sets the label above its own line of copy, which is what a
           <dl> is for. */
        type: "definitions",
        items: [
          {
            term: "Slow & Relaxed",
            description:
              "For travelers who prefer beautiful stays, quiet surroundings, and plenty of time to unwind.",
          },
          {
            term: "Adventure & Discovery",
            description:
              "For those who want to explore, try something new, and stay active throughout the journey.",
          },
          {
            term: "Culture & Local Life",
            description:
              "For travelers who want to understand a place through its food, people, history, and traditions.",
          },
        ],
      },
      { type: "heading", text: "When You Go Matters" },
      {
        type: "paragraph",
        text: "The same destination can feel completely different depending on when you visit. Consider the weather, local seasons, festivals, crowds, and the experiences you want to have before deciding on your travel dates. Instead of simply asking “When is the best time to visit?”, ask: “When is the best time for the experience I want?”\nThat small change can make planning much more useful.",
      },
      { type: "heading", text: "Choose Where You'll Stay" },
      {
        type: "paragraph",
        text: "Where you sleep shapes how a place feels. A room over the water and a room over a market are two different trips in the same town. Decide early whether you want the stay to be the point or the base, because that one answer narrows the search more than any filter will.",
      },
      { type: "heading", text: "Find Somewhere That Fits" },
      {
        type: "paragraph",
        text: "Match the season, the budget and the paperwork before you fall for the photographs. The table below is the short version of that check for a handful of places we are asked about most.",
      },
      {
        type: "table",
        caption: "Best time, typical daily cost, visa and language by destination",
        columns: [
          "Destination",
          "Best time",
          "Avg cost/day",
          "Visa",
          "Language",
          "Rating",
        ],
        rows: [
          ["Kyoto, Japan", "Mar–May, Sep–Nov", "$180", "Required", "Japanese", "4.8"],
          ["Cinque Terre, Italy", "Apr–Jun, Sep", "$120", "No", "Italian", "4.6"],
          ["Medellín, Colombia", "Year-round", "$45", "No", "Spanish", "4.4"],
          ["Bali, Indonesia", "May–Sep", "$35", "On arrival", "Indonesian", "4.5"],
          ["Porto, Portugal", "Mar–Oct", "$90", "No", "Portuguese", "4.7"],
        ],
      },
    ],
  },

  /* The design repeats one card's copy across the whole grid, which is how a
     frame shows a rhythm rather than a brief — so the eighteen below are
     written out as distinct articles.

     The COPY is real and ready to read. The PHOTOGRAPHS are not: they are stock
     files already in public/, picked for subject rather than commissioned, and
     the bylines all point at one author. Swap both before this ships. Nothing
     in the components has to change when you do. */
  {
    slug: "what-sunrise-in-iceland-taught-me-about-stillness",
    category: "stories",
    kicker: "Field Notes",
    readingTime: "6 min read",
    date: "2026-08-11",
    dateLabel: "11 Aug 2026",
    title: "What sunrise in Iceland taught me about stillness.",
    image: "/experiance/city-escape.png",
    imageAlt: "A traveller with a map outside a city doorway",
    description:
      "Reykjavik in early February gets light close to ten and loses it before six, which leaves three empty hours every morning and changes what the trip is for.",
    body: [
      {
        type: "paragraph",
        text: "In early February the sun does not come up in Reykjavik until close to ten. It arrives low over the bay to the southeast, stays low all day, and is gone again before six. The first morning I was awake at seven out of habit, sitting in a guesthouse kitchen in Hafnarfjordur with instant coffee and nothing to do about it. There was no light to get moving for. That is an odd thing for anyone who has built a working life around early starts. By the fourth day I had stopped setting an alarm, and the trip was better for it in ways I had not planned."
      },
      {
        type: "heading",
        text: "The Sun Takes Its Time"
      },
      {
        type: "paragraph",
        text: "Iceland sits just below the Arctic Circle, so the winter sun does not so much rise as slide along the horizon. Sunrise and sunset run into one another. What you get instead of a dawn is roughly three hours of low orange light that photographers call golden hour and Icelanders treat as the middle of the day. On the south coast, driving Route 1 towards Vik, it hits the black sand at an angle you will not see at home. It also makes the useful day very short. Reykjavik to Jokulsarlon is about 370 kilometres each way, and anyone going out to the glacier lagoon in February should give it two nights on the road rather than one."
      },
      {
        type: "heading",
        text: "Nothing To Rush Towards"
      },
      {
        type: "paragraph",
        text: "The practical effect of a late sunrise is that the first hours of the day carry no plan. You cannot start a walk at seven. Operators do not collect you before nine. The museums open at ten. So there are three hours with a kettle, and the only decision is whether to be annoyed about it. I read most of a book I had been carrying around for two years. A Dutch couple in the next room went out with head torches and came back saying the harbour had been worth the cold. Nobody had booked any of that. It was what was left once the schedule had been taken away."
      },
      {
        type: "heading",
        text: "The Weather Decides Instead"
      },
      {
        type: "paragraph",
        text: "Stillness in Iceland is rarely a choice you make. The weather makes it for you. Route 1 closes in wind, and the Icelandic Met Office site, vedur.is, is the page everyone checks twice a day: road conditions on one tab, aurora forecast on the other. We lost an afternoon to a closure near Hvolsvollur and spent it in a swimming pool, which is what Icelanders do anyway. Every small town has a heated outdoor one, entry runs to about 1,200 kronur, and the hot pots sit near forty degrees. The lights turned up two nights out of six, both times after eleven, both times because somebody had gone out and stood in the cold on the chance."
      },
      {
        type: "heading",
        text: "Coming Back To Alarms"
      },
      {
        type: "paragraph",
        text: "None of it survives the flight home intact. Within a week I was setting an alarm again. What carried over was smaller: I stopped putting anything in the first hour of a trip. Two practical notes for anyone travelling from India. Iceland has no visa office here, so the Schengen application is handled through another country's mission and takes longer than the season estimate suggests. Start it before you book flights, not after. And the fuel pumps outside Reykjavik are unmanned and want a chip-and-PIN card, so carry one with a PIN set for purchases rather than only for ATMs. Cards that work perfectly well in Paris get refused at an N1 pump at four in the afternoon, in the dark."
      }
    ],
  },
  {
    slug: "the-case-for-staying-put-for-a-week",
    category: "inspiration",
    kicker: "Field Notes",
    readingTime: "5 min read",
    date: "2026-08-08",
    dateLabel: "8 Aug 2026",
    title: "The case for staying put for a week.",
    image: "/experiance/mountain-escape.png",
    imageAlt: "A woman sitting on a wooden deck facing a forest",
    description:
      "Seven nights in one town buys you a laundry, a bakery you already know, and day trains out to most of what the coach tour was going to show you.",
    body: [
      {
        type: "paragraph",
        text: "Most of our European itineraries move. Five countries in nine days, a new hotel every second night, bags in the corridor by seven in the morning. It works, and people with two weeks of leave and one trip in them are right to want it. But there is a second way to spend a week, and we sell fewer of them than we should. Pick one town, take one room for seven nights, and go out from it. Seville, Kandy, Ljubljana, Udaipur. The trip that results looks smaller written down and is usually remembered better."
      },
      {
        type: "heading",
        text: "The Maths Of Moving"
      },
      {
        type: "paragraph",
        text: "Count what a change of hotel actually costs. Check-out is at eleven, check-in at three, and the four hours in between are spent carrying luggage you cannot put down. Add the packing the night before, the wait in the lobby, the room you have to learn again. On a nine-day coach itinerary with five hotels, that comes to something close to a day and a half spent in receptions and on motorways, and it is the tiring part, not the driving. Stay put and you get that day and a half back at the front of the week, when you still have the energy to use it."
      },
      {
        type: "heading",
        text: "Day Trains Do The Work"
      },
      {
        type: "paragraph",
        text: "A base only works if the trains do. Seville is the clean example. Cordoba is forty-five minutes away on the AVE, Cadiz about an hour and forty on a regional service, Jerez about an hour. You can be at the Mezquita by ten and back in your own room by seven with no suitcase involved. Kandy does the same job in Sri Lanka: Sigiriya is a long morning by road, the hill train towards Nanu Oya and Ella leaves from the station in town, and the tea country is an easy day out. The rule is simple enough. Choose the town with the railway junction, not the town with the famous photograph."
      },
      {
        type: "heading",
        text: "What You Notice By Thursday"
      },
      {
        type: "paragraph",
        text: "By Thursday things start being yours. You know which bakery opens at seven and which one says seven and opens at half past. The waiter stops bringing the English menu. You have found the laundry, which matters more than it sounds eleven days into a fortnight packed out of one bag. Apartments usually discount the seventh night, so a full week often costs less than five nights split across two cities. One thing worth checking before you book: the day the market runs. In most Spanish and Italian towns it is a weekday morning, and if your seven nights begin on a Sunday you will catch it exactly once."
      }
    ],
  },
  {
    slug: "how-to-pack-for-two-climates-in-one-trip",
    category: "travel-tips",
    kicker: "Field Notes",
    readingTime: "4 min read",
    date: "2026-08-05",
    dateLabel: "5 Aug 2026",
    title: "How to pack for two climates in one trip.",
    image: "/home/journal/climatic.png",
    imageAlt: "A traveller celebrating beside a jeep at a desert camp",
    description:
      "Jungfraujoch is around freezing in July and Interlaken is not, so the problem is one bag that handles both without turning into two.",
    body: [
      {
        type: "paragraph",
        text: "The standard European summer itinerary has a temperature problem sitting in the middle of it. Interlaken in July is around 25 degrees. Jungfraujoch, two hours up the railway at 3,454 metres, hovers near freezing with snow on the ground, and people arrive there in shorts every day of the season. The same problem turns up on a December start in Delhi with a finish in Kerala, or Leh in September followed by Goa. One bag, two climates, and an airline giving you 23 kilograms on most economy tickets to Europe. It is solvable, but not by packing twice."
      },
      {
        type: "heading",
        text: "Layers, Not Outfits"
      },
      {
        type: "paragraph",
        text: "The mistake is packing a cold-weather wardrobe and a warm-weather wardrobe and hoping the bag shuts. Pack one wardrobe and add two layers to it. Everything you wear in Rome you also wear on the mountain, with a mid layer and a shell over the top. That means the base has to work in both places, which in practice means wool or synthetic rather than cotton. Cotton holds sweat, and a cotton t-shirt that got damp on the walk up will be cold on the observation deck. Three of them, washed in a sink, cover a fortnight."
      },
      {
        type: "definitions",
        items: [
          {
            term: "Base layer",
            description: "A merino or synthetic t-shirt. Worn on its own in the heat and under everything else in the cold. Two or three is enough for two weeks if you are willing to wash them."
          },
          {
            term: "Mid layer",
            description: "A light fleece or thin down jacket that packs down to about the size of a water bottle. This is the piece doing the actual warming."
          },
          {
            term: "Shell",
            description: "A hooded waterproof with taped seams. Almost no insulation of its own. It stops wind, which is what makes a two degree cable car feel like minus five."
          }
        ]
      },
      {
        type: "heading",
        text: "Put The Warm Things In Cabin"
      },
      {
        type: "paragraph",
        text: "Checked bags go astray at exactly the wrong moment, and the wrong moment is a connection through Frankfurt or Doha on the way somewhere cold. The mid layer, the shell and one base layer travel in the cabin bag. They weigh very little and they are the only items you cannot replace quickly at the other end at a sensible price. Shoes are the other weight problem: two pairs, both worn in, one of them the pair you fly in. Gloves and a wool cap take up no space and get forgotten by roughly half of every group. Buy them at home. A cap is a few hundred rupees in Delhi and around 25 francs in a shop in Grindelwald."
      }
    ],
  },
  {
    slug: "a-first-timers-guide-to-the-backwaters",
    category: "guides",
    kicker: "Field Notes",
    readingTime: "7 min read",
    date: "2026-08-01",
    dateLabel: "1 Aug 2026",
    title: "A first-timer's guide to the backwaters.",
    image: "/destinations/kerala/house-boat.avif",
    imageAlt: "A houseboat moored on still backwater",
    description:
      "What a Kerala houseboat day actually looks like, from the Alleppey jetty scrum to the four o'clock mooring, and where the water gets quieter.",
    body: [
      {
        type: "paragraph",
        text: "The Kerala backwaters are about 900 kilometres of connected lakes, canals and rivers running roughly parallel to the Arabian Sea, and most first-timers see them from a converted rice barge for one night. That is a reasonable way to start. It is also the most crowded way, and it puts you on Vembanad Lake at the same hour as several hundred other boats. The water is worth the trip regardless. Knowing how the day is actually shaped, and where the traffic thins, changes what you get out of it more than any upgrade in boat category does."
      },
      {
        type: "heading",
        text: "Alleppey, Kumarakom Or Kollam"
      },
      {
        type: "paragraph",
        text: "Alappuzha, still called Alleppey by everyone including the ticket counters, is the default. It has the most boats, the easiest access from Kochi, about 60 kilometres north, and the busiest canals. Kumarakom sits on the eastern shore of Vembanad and is quieter, greener, and priced higher because the resorts there set the tone. Kollam is the southern end of the system and the least travelled of the three; the Kollam to Alleppey public ferry takes eight hours and costs a few hundred rupees, which is the cheapest long look at the backwaters anyone offers. Poovar and Kuttanad are smaller entries again. If your interest is the villages rather than the lake, start from Kollam or Kuttanad."
      },
      {
        type: "heading",
        text: "How A Houseboat Day Runs"
      },
      {
        type: "paragraph",
        text: "Boarding is around noon. You are on the water by half past twelve, and the boat runs for three or four hours through canals and then out onto open lake. Lunch is served underway, usually within the first hour, and it is the best meal of the trip: karimeen cooked in a banana leaf if you asked for it in advance, rice, a thoran, sambar, pickle. By four o'clock the boat moors. This is the part nobody mentions. Kerala rules stop houseboat engines at sunset, so your evening is spent tied to a bank, not cruising. Pick a mooring away from the cluster if the crew offers a choice. Dinner comes around eight, and the generator, which runs the air conditioning, often switches off at eleven and back on near dawn."
      },
      {
        type: "heading",
        text: "What The Boat Costs"
      },
      {
        type: "paragraph",
        text: "A one-bedroom non-air-conditioned boat runs roughly 6,000 to 9,000 rupees for the overnight in low season, and 9,000 to 14,000 in December and January. Air conditioning adds two to four thousand. Two- and three-bedroom boats scale up from there rather than doubling. The price normally covers lunch, evening tea with banana fritters, dinner and breakfast, plus the crew of three. It does not cover alcohol, and Kerala's rules mean the boat cannot sell it to you; carry your own from a state outlet. Day cruises without the overnight cost a third as much and skip the moored evening, which is either the thing you came for or the thing you did not."
      },
      {
        type: "heading",
        text: "The Season And The Mosquitoes"
      },
      {
        type: "paragraph",
        text: "November to February is dry, warm and busy. March to May is hot, and the humidity on a moored boat at two in the afternoon is a real consideration. June to September is the southwest monsoon, when the water is high, the paddy fields are flooded green, rates drop by half, and the rain arrives in long afternoon blocks rather than all day. The Nehru Trophy snake boat race is traditionally held on the second Saturday of August at Punnamada Lake and fills every room in Alappuzha. Mosquitoes are constant on the moored evening in every season. Boats carry nets and coils; carry repellent anyway, and use it before dusk rather than after."
      },
      {
        type: "heading",
        text: "The Canals, And A Second Night"
      },
      {
        type: "paragraph",
        text: "Large houseboats cannot enter the narrow canals, which is where the villages are. Most crews will arrange a shikara, a small motorised canoe, for around 500 to 800 rupees an hour, and this is the part of the trip people remember: houses a few metres away, school jetties, women washing clothes on the steps, ducks herded in the hundreds by a man in a canoe. Ask to go before seven, when the light is better and the boat traffic has not started. The other change worth making is a second night. One night gives you four hours of movement and a long evening tied up; two gives a full day of cruising and a route that can stretch towards Kuttanad and the paddy fields below sea level. Or split it, one night afloat and one at a homestay in Kumarakom. Most people who go back do it that way."
      }
    ],
  },
  {
    slug: "why-the-shoulder-season-is-worth-the-gamble",
    category: "travel-tips",
    kicker: "Field Notes",
    readingTime: "5 min read",
    date: "2026-07-28",
    dateLabel: "28 Jul 2026",
    title: "Why the shoulder season is worth the gamble.",
    image: "/experiance/switzerland.png",
    imageAlt: "A mountain village under low cloud",
    description:
      "Prices drop by a third, the queues shorten, and the weather stops cooperating. A look at when that trade is worth making and when it is not.",
    body: [
      {
        type: "paragraph",
        text: "Shoulder season is the few weeks either side of peak, when the crowds have gone but the place has not shut down. In Europe that is roughly late April to mid-May and September into October. In Kerala it is September, once the heavy rain has gone through. In Rajasthan it is late September, before the season proper starts in November. Prices fall by a quarter to a half, the queues shorten to something reasonable, and the weather stops being reliable. That last part is the whole gamble, and it is worth taking more often than people think."
      },
      {
        type: "heading",
        text: "Prices Move Unevenly"
      },
      {
        type: "paragraph",
        text: "Hotels move first and move most. A room in central Prague that costs 180 euros in July sits near 100 in late October. Flights follow, though less dramatically, and long-haul fares out of Delhi and Mumbai to Europe drop hardest in the first half of November and the second half of January. Coach tours cut departure prices in the shoulder weeks because the seats have to fill either way. The costs that do not move are entrance fees, rail passes, and food. Budget the trip on those and the saving on beds and flights is the part you keep."
      },
      {
        type: "heading",
        text: "Weather You Can Plan Around"
      },
      {
        type: "paragraph",
        text: "September in Italy still runs to 26 degrees in the afternoon and the sea at Amalfi is warmer than it is in June. Early May in Switzerland means some high passes are still closed and the Jungfraujoch is open but cold, while the valleys are green and the wildflowers are out. October in Paris rains about one day in three, and the rain is light. None of this is a coin toss. Look at the thirty-year averages for the specific fortnight rather than the month, because late September and late October are entirely different propositions in the same country. Then pack for the wet third of the trip and stop worrying about it."
      },
      {
        type: "heading",
        text: "The Things That Close"
      },
      {
        type: "paragraph",
        text: "This is where shoulder season bites. Greek island ferries thin out sharply after mid-October and some routes stop entirely; by November, Santorini's smaller hotels and half its restaurants are shut. Alpine cable cars run maintenance closures in late April and again in November, which is exactly when the fares look attractive. Seasonal mountain huts and passes in Switzerland and Austria close from October. Ladakh's road access via Manali generally shuts by early November. Check the specific attraction you are travelling for, not the destination, because a town can be perfectly open while the one thing you came to see is behind a shutter until March."
      },
      {
        type: "heading",
        text: "Where The Gamble Is Bad"
      },
      {
        type: "paragraph",
        text: "Some shoulders are the edge of something serious. The week either side of a monsoon onset in the Western Ghats is not a discount, it is a landslide risk on hill roads. Late October in the Caribbean is still hurricane season. Northeast India in April is fine until the pre-monsoon storms start and flights into Guwahati begin cancelling. And if the trip is built around one fixed thing, a wedding, a match, a festival date, the shoulder saving is not worth a weather day you cannot move. The gamble works when the itinerary has slack in it. A spare day in the middle of a shoulder-season trip is cheaper than travel insurance and does more of the work."
      }
    ],
  },
  {
    slug: "the-slow-road-through-the-alps",
    category: "stories",
    kicker: "Field Notes",
    readingTime: "8 min read",
    date: "2026-07-24",
    dateLabel: "24 Jul 2026",
    title: "The slow road through the Alps.",
    image: "/destination/switzerland.avif",
    imageAlt: "A cable car above an alpine town",
    description:
      "Four days between Zurich and Milan on trains, buses and one lake boat, taken at the pace the mountains were originally crossed at.",
    body: [
      {
        type: "paragraph",
        text: "You can drive from Zurich to Milan in three and a half hours. The Gotthard road tunnel takes seventeen kilometres of that and shows you nothing but tiled wall. Take four days instead and the same crossing becomes a different country: the old pass road above the tunnel, the postbus that still sounds its three-note horn on blind corners, the language changing from German to Italian somewhere around Airolo without anyone announcing it. The Alps were crossed at this speed for eight hundred years and the towns are still spaced for it. Most of the route runs on scheduled public transport that leaves whether you are on it or not."
      },
      {
        type: "heading",
        text: "Zurich To Lucerne To Andermatt"
      },
      {
        type: "paragraph",
        text: "The train from Zurich to Lucerne takes about 45 minutes and there is no reason to rush it. From Lucerne, the boat across the Vierwaldstattersee to Fluelen is roughly three hours on a lake that narrows into cliffs. Rail passes cover it. At Fluelen you pick up the train up the Reuss valley to Goschenen, then the short rack railway through the Schollenen gorge to Andermatt, past the Teufelsbrucke where the road is cut into the rock above the water. Andermatt is a small place at about 1,440 metres that was an army town until fairly recently and is now half building site, half ski resort. Stay the night. Everything after this runs on a thinner timetable."
      },
      {
        type: "heading",
        text: "The Pass Road, Not The Tunnel"
      },
      {
        type: "paragraph",
        text: "The Gotthard pass road opens roughly from late May to October, depending on snow, and the postbus over it runs only in that window. Book the seat; there is one bus in the morning and it fills. The climb from Andermatt to the summit at 2,106 metres takes about an hour, and the last section on the southern side is the Tremola, a cobbled road of two dozen hairpins laid in the 1830s and now a protected monument. It is the longest stone-paved road in Switzerland and the bus takes it slowly because there is no other way to take it. At the top there is a lake, a hospice, a museum in an old customs building, and weather that can be twenty degrees colder than the valley you left."
      },
      {
        type: "heading",
        text: "Down Into Ticino"
      },
      {
        type: "paragraph",
        text: "The bus reaches Airolo and the change is immediate. Signs in Italian, the roofs go flat, the vines start. Ticino is Swiss in administration and Italian in every other respect, which produces the grotti: stone taverns, often built into a hillside, serving polenta, brasato and merlot from the canton's own vineyards at long shared tables. Biasca to Bellinzona is another 25 minutes by train. Bellinzona has three medieval castles strung along the valley floor, a UNESCO site, and one of the better Saturday markets in the country. Give it an afternoon. The walk between Castelgrande and Montebello takes about an hour and the view from the top explains why anyone bothered building three of them here."
      },
      {
        type: "heading",
        text: "Lugano, Como, Milan"
      },
      {
        type: "paragraph",
        text: "From Bellinzona it is half an hour to Lugano, and Lugano to Milan is under an hour and a half on the direct trains. That is too fast for a trip built on going slowly, so break it at Como. The border crossing at Chiasso takes a few minutes and nobody usually asks anything, though it is a Schengen internal border and passports are occasionally checked. Lake Como's ferries run all year from Como town up to Bellagio and Varenna, about two hours to Bellagio on the slow boat. Varenna has a station on the Milan line, which makes it the practical last stop: ferry in, sleep, train to Milano Centrale in an hour or so the next morning."
      },
      {
        type: "heading",
        text: "What Breaks On This Route"
      },
      {
        type: "paragraph",
        text: "A Swiss Travel Pass covers the trains, the lake boat, the postbus and most of the museums; four consecutive days runs a little under 300 Swiss francs in second class, which is roughly the price of the individual tickets once you add the boat. It stops at the Italian border. The Gotthard postbus needs a seat reservation of a few francs and sells out on summer weekends. The failure points are the pass itself, which closes for snow with no notice in May and October, and the Lake Como ferries, which run a reduced winter timetable from November. If the pass road is shut, the train through the base tunnel takes about twenty minutes and you have lost the best part of the day but not the trip."
      }
    ],
  },
  {
    slug: "what-nobody-tells-you-about-long-haul-flights",
    category: "travel-tips",
    kicker: "Field Notes",
    readingTime: "4 min read",
    date: "2026-07-20",
    dateLabel: "20 Jul 2026",
    title: "What nobody tells you about long-haul flights.",
    image: "/home/journal/city-guide.png",
    imageAlt: "A city street at dusk",
    description:
      "Cabin air, seat maps, transit visas and the first day on the ground: the parts of a fifteen-hour flight that decide how the rest of the trip starts.",
    body: [
      {
        type: "paragraph",
        text: "Fifteen hours in a seat is a working day spent sitting, in air pressurised to somewhere between 6,000 and 8,000 feet depending on how new the aircraft is. Delhi to San Francisco runs about sixteen hours non-stop. Mumbai to Newark is near enough the same. People plan the trip in great detail and plan the flight not at all, then land at six in the morning and lose the first day of a nine-day holiday to a headache. The flight is part of the itinerary. Most of what decides how it goes is settled before you reach the airport."
      },
      {
        type: "heading",
        text: "Cabin Air Does The Damage"
      },
      {
        type: "paragraph",
        text: "Humidity in a cabin sits at around 10 to 20 per cent. Desert air is usually wetter than that. It is why your mouth is dry by hour four, why contact lenses stop being tolerable somewhere over Iran, and why two whiskies that would be nothing at home leave you flattened at Doha. Gulf carriers pour freely in economy and people treat it as value included in the fare. Drink water instead, and ask for a bottle rather than a cup, so you are not pressing the call button every forty minutes. Glasses instead of lenses. Lip balm in your pocket, not in the bag in the overhead bin, because you will not get up for it."
      },
      {
        type: "heading",
        text: "Seats Are Not Equal"
      },
      {
        type: "paragraph",
        text: "An A350 or a 787 puts nine seats across the cabin. Most 777s now fit ten into much the same width, which takes an inch off every seat in the row. The aircraft type is printed on the booking and is worth two minutes of your attention; it matters more than which airline's advertisement you liked. Book the seat when you book the ticket, not at check-in. On a full flight to Europe in July, what is left twenty-four hours before departure is the middle seats at the back, and there is a reason nobody took them."
      },
      {
        type: "definitions",
        items: [
          {
            term: "Bulkhead row",
            description: "More legroom, but the tray table lives inside the armrest, so the armrests do not lift. Bassinets clip to the wall here, which means infants."
          },
          {
            term: "Exit row",
            description: "Legroom, colder air coming off the door, and nothing allowed at your feet for takeoff or landing."
          },
          {
            term: "The row ahead of an exit",
            description: "Usually fixed. You sit upright for fifteen hours while the seat in front reclines into your knees."
          },
          {
            term: "The last row",
            description: "Backs onto the galley and the toilets. Light, noise, and a queue at your elbow from midnight onwards."
          }
        ]
      },
      {
        type: "heading",
        text: "Transit Is Where Trips Break"
      },
      {
        type: "paragraph",
        text: "One ticket and two tickets are different animals. On a single booking, a missed connection belongs to the airline and they rebook you. On two separate bookings it belongs to you, and you buy a fresh ticket at the counter at whatever it costs that morning. Two bookings also mean collecting your bags and checking them in again, which means clearing immigration, which means needing a visa for a country you were only passing through. Indian passport holders transiting airside at Heathrow need a Direct Airside Transit Visa unless they qualify for an exemption. Nobody discovers this at leisure. They discover it at the counter in Delhi, where staff will not board them."
      },
      {
        type: "heading",
        text: "The First Day Is Already Spent"
      },
      {
        type: "paragraph",
        text: "Body clocks shift about one time zone a day, and eastward is harder than westward, which is the direction that hurts on the way home. Flying out of India you land in Europe mid-morning with the whole day in front of you and nothing left to spend on it. Sleeping at noon guarantees a bad night and a worse second day. Go outside, eat lunch at the local hour, walk, and hold out until nine. On the aircraft, set your watch to the destination when the doors close and eat by that clock; refuse the tray that arrives at what is three in the morning where you are going. By the second evening it evens out on its own. The first day is the one you paid for and do not get back."
      }
    ],
  },
  {
    slug: "an-afternoon-in-a-town-with-no-name",
    category: "stories",
    kicker: "Field Notes",
    readingTime: "6 min read",
    date: "2026-07-16",
    dateLabel: "16 Jul 2026",
    title: "An afternoon in a town with no name.",
    image: "/experiance/greece.png",
    imageAlt: "White houses above a blue bay",
    description:
      "A forty-minute coach stop in the Adige valley, in a village chosen by a tachograph, with two names on its sign and neither of them on our itinerary.",
    body: [
      {
        type: "paragraph",
        text: "The itinerary said 'comfort break en route', and that was the whole entry. We had left Innsbruck after breakfast, crossed the Brenner behind a queue of lorries, and come down the Adige valley with apple orchards running up both sides of it. At ten past one the coach left the motorway, went round two roundabouts and parked beside a school. Forty minutes, the driver said. There was a fountain, a church, a bar with four tables outside, and at the entrance to the village a sign carrying two names, one printed above the other. Nobody in the group wrote either of them down. It was the best part of that day."
      },
      {
        type: "heading",
        text: "The Stop Is In The Rules"
      },
      {
        type: "paragraph",
        text: "The village was not chosen for us. A coach driver in Europe may drive four and a half hours before taking a 45-minute break, and the tachograph in the dashboard keeps the count. It is not advice. The card in that machine is the driver's permission to keep working, and roadside checks read it. So the stop happens when the clock says it happens, within a few kilometres of wherever the coach has got to, and it happens somewhere that can park thirteen metres of vehicle without closing a street. Drivers carry a private list of such places. Ours had been using this one for years and knew the woman behind the bar by name."
      },
      {
        type: "heading",
        text: "Two Names On One Sign"
      },
      {
        type: "paragraph",
        text: "This was South Tyrol, Italian since 1919 and German-speaking for a long time before that. Around two-thirds of the province still gives German as its first language. Everything carries two names. Neumarkt is Egna, Kaltern is Caldaro, Tramin is Termeno, and the grape called Gewurztraminer takes its name from the last of those. The road signs show both. So do the menus, the notice board outside the church, and the parish list of the recently dead. The man who brought the coffee answered in German. His daughter at the till switched to Italian without appearing to notice she had done it. A few villages further south, past Salorno, the German stops."
      },
      {
        type: "heading",
        text: "What Forty Minutes Buys"
      },
      {
        type: "paragraph",
        text: "Coffee at the counter costs less than coffee at a table outside, which is standard across Italy and catches groups every time. The fountain in the square runs drinking water and the bar will fill a bottle anyway. Inside, the church was ten degrees colder than the street and smelled of wax and damp stone. On the war memorial beside it the same three surnames repeat down both lists, the one from 1915 and the one from 1943. Behind the co-op, apple crates were stacked four metres high, empty, waiting on a harvest still six weeks away. The school bell went at half past one and the square filled with eleven-year-olds on bicycles who ignored a coachload of Indians entirely."
      },
      {
        type: "heading",
        text: "The Group Split Four Ways"
      },
      {
        type: "paragraph",
        text: "Six people never got off. They stayed in the air conditioning with their phones, which is a decision people are entitled to make and which they had made at the last two stops as well. Four found the bar and stayed in it. Two walked to the end of the street until the houses stopped and the orchards started, and came back reporting apples the size of golf balls and as hard as wood. One man found a butcher and bought a vacuum-packed side of speck, which then travelled in the hold to Venice, Florence and Rome and went home to Pune. He wrote to us about it months later. He did not mention the town, because he did not know what it was called either. The receipt is in a jacket pocket somewhere, with the name printed across the top of it."
      }
    ],
  },
  {
    slug: "the-quiet-hours-worth-getting-up-for",
    category: "inspiration",
    kicker: "Field Notes",
    readingTime: "5 min read",
    date: "2026-07-12",
    dateLabel: "12 Jul 2026",
    title: "The quiet hours worth getting up for.",
    image: "/home/journal/coastal-escape.png",
    imageAlt: "A coastline at first light",
    description:
      "Venice before the trains, Rajasthan before the heat and the first cable car of the morning: what the early hour buys you, and what it costs.",
    body: [
      {
        type: "paragraph",
        text: "Every famous place has two versions and about ninety minutes separates them. St Mark's Square at half past six has pigeons, a man hosing down the stones and perhaps four other people in it. By eleven it holds several thousand. Nothing about the square has changed; the trains have arrived. The hour before the crowd is the part of a trip people actually describe afterwards, and it is the one thing an itinerary cannot book on your behalf, because it needs you awake and outside before the hotel has started serving breakfast."
      },
      {
        type: "heading",
        text: "Venice Before The Trains"
      },
      {
        type: "paragraph",
        text: "Venice fills from the causeway. Day visitors arrive by train and coach through the morning and most of them are gone by seven in the evening, so the city is emptiest between about six and nine, and again after dinner. Everything in Venice arrives by boat, and at first light you can watch it happen: water, beer, cement and vegetables coming off barges at the Rialto while the fish market sets up around them. That market is closed on Sundays and Mondays, which ruins a certain number of carefully planned Sunday mornings. A vaporetto down the Grand Canal at seven costs the same as one at noon and gives you the seat at the front."
      },
      {
        type: "heading",
        text: "Heat Runs The Clock"
      },
      {
        type: "paragraph",
        text: "In Rajasthan in May the air is at 42 degrees by eleven and there is nothing useful to do with the middle of the day. The Hawa Mahal faces east, so the front of it takes the light at seven and the street below is manageable; by ten it is traffic and heat and a queue of cars. The Taj Mahal opens at sunrise and closes on Fridays; the marble is cool at a quarter past six, burning by mid-morning, and the entry queue at first light is a fraction of what it becomes. Game drives leave at six for the same reason turned around. Cats hunt in the cool and lie up in shade by nine, so the vehicle that sets off after breakfast spends its morning looking at grass."
      },
      {
        type: "heading",
        text: "The First Cable Car"
      },
      {
        type: "paragraph",
        text: "In the Alps in summer the mountain is usually clear early and builds its own cloud through the afternoon. The eight o'clock car up Titlis or the Schilthorn generally gets the view. The two o'clock car often arrives inside a cloud, having paid the same fare, which on the big Swiss lifts is not a small one. The first ascent of the day is also the empty one; coach groups reach these stations between ten and midday because that is what coach schedules do, and by afternoon the queue for the way down can run to an hour. Take a jacket. There is snow up there in July, and the temperature falls roughly six degrees for every thousand metres you climb."
      },
      {
        type: "heading",
        text: "Jet Lag Works For You First"
      },
      {
        type: "paragraph",
        text: "Coming from India, the first three mornings in Europe are free. Four o'clock in Zurich is half past seven at home and your body knows it, so you are awake regardless, lying in a dark room waiting for the day to be allowed to begin. Get up and go out. The trade is real and worth saying plainly: you will be finished by nine in the evening and you will miss the long dinner. A few cities are worth the evening instead, Madrid among them. Most of the famous ones are worth the morning. The coach leaves at half past eight either way, and the only variable is what you had already done before it."
      }
    ],
  },
  {
    slug: "choosing-a-guide-and-why-it-changes-everything",
    category: "guides",
    kicker: "Field Notes",
    readingTime: "6 min read",
    date: "2026-07-08",
    dateLabel: "8 Jul 2026",
    title: "Choosing a guide, and why it changes everything.",
    image: "/destinations/kerala/wildlife.avif",
    imageAlt: "A guide watching wildlife from a jeep",
    description:
      "Twenty hours of a long trip are spent walking behind someone who is talking, so it is worth knowing how to pick the right person.",
    body: [
      {
        type: "paragraph",
        text: "Two people can walk the same route through Amber Fort and come away with different mornings. One of them learned why the ramp is wide enough for elephants, what the mirror work in the Sheesh Mahal was actually for, and which parts were built by whom. The other got dates recited at speed by a man walking too fast. The fort did not change. The guide did. On a fifteen-day itinerary you may spend twenty hours or more with local guides, and those hours decide how much of the trip you can still describe a year later."
      },
      {
        type: "heading",
        text: "What The Badge Means"
      },
      {
        type: "paragraph",
        text: "India's Ministry of Tourism runs a training and examination route for Regional Level Guides, and the ones who pass carry a photo badge they are expected to show. State tourism departments license their own people for local sites. The man who reaches your car door in the Taj Mahal car park is usually neither. Asking to see a badge is routine and nobody is offended by it. Italy licenses guides region by region, and the Colosseum, the Uffizi and the Vatican Museums all check. Egypt requires a guide to hold a degree in the subject. None of this makes a guide good. It only removes the worst version of the day."
      },
      {
        type: "heading",
        text: "The Questions Worth Asking"
      },
      {
        type: "paragraph",
        text: "Ask how long they have lived in the city. Ask what they did before this. Then ask one thing that is not on the route, about rent, or schools, or where they eat on a Tuesday, and listen for whether the answer sounds rehearsed. A guide who says they do not know but will find out is worth more than one who never says it. Language is the other filter. Most licensed guides in Europe work in English, fewer in Spanish, German or French. A licensed Hindi-speaking guide in Rome or Prague does exist, but there are only a handful and in July they are booked months ahead. Ask early, or accept English."
      },
      {
        type: "heading",
        text: "Group Size Decides Everything"
      },
      {
        type: "paragraph",
        text: "A guide talking to eight people is having a conversation. The same guide with forty is lecturing the front row while the back row looks at their phones. Radio headsets fix the sound and nothing else. The Vatican Museums require them for groups, and they are worth having in any crowded site. What they cannot fix is the walking pace, which is set by the slowest person, or the fact that nobody at the back will interrupt to ask a question. Above about twenty-five people, a site visit becomes a queue with commentary. We would rather pay for two guides than run one large group."
      },
      {
        type: "heading",
        text: "Where A Guide Earns It"
      },
      {
        type: "paragraph",
        text: "Some places are unreadable without one. Ajanta and Ellora, where the carving is a text you cannot see until someone points at it. The Alhambra. Angkor. The Old City in Jerusalem, where the order of the route matters more than the buildings. Other places need nobody: a canal walk in Amsterdam, a market morning, a lake day in Switzerland. The Rijksmuseum audio guide costs around EUR 6 and is better than most humans. A licensed guide in Rome runs roughly EUR 160 to 220 for three hours, split across the group. An approved half day in Jaipur is closer to INR 2,000. Booked for the two mornings that need it and left out of the rest, that is not much money."
      }
    ],
  },
  {
    slug: "reading-a-country-through-its-breakfast",
    category: "stories",
    kicker: "Field Notes",
    readingTime: "5 min read",
    date: "2026-07-04",
    dateLabel: "4 Jul 2026",
    title: "Reading a country through its breakfast.",
    image: "/destination/japan.avif",
    imageAlt: "A pagoda beside a waterfall",
    description:
      "The first meal of the day is the one nobody stages for visitors, which is exactly why it tells you where you have landed.",
    body: [
      {
        type: "paragraph",
        text: "Breakfast is the meal a country does not put on for visitors. Lunch can be a performance and dinner is often a negotiation, but breakfast happens before anyone has decided to impress you. It gets eaten standing up, at a counter, by people on their way to work, and it changes every two hundred kilometres in ways the tourist board never mentions. If you want to know how a place arranges its day, its money and its appetite, go out at eight, sit where everyone else is sitting and look at what arrives on the table."
      },
      {
        type: "heading",
        text: "Small Plates Or Standing Coffee"
      },
      {
        type: "paragraph",
        text: "A Turkish kahvalti is a table covered in small plates: white cheese, black and green olives, sliced cucumber and tomato, honey with kaymak, bread that keeps coming, and tea in tulip glasses that nobody counts. On a Sunday it runs for two hours. In France the same meal is coffee and bread, taken standing at a counter in under ten minutes, because the day's real eating happens at lunch. In Japan it is rice, grilled fish, miso soup, pickles and a rolled egg, and it looks like dinner to anyone seeing it for the first time. None of these is the correct way to start a day. They tell you where the weight of the day has been put."
      },
      {
        type: "heading",
        text: "Breakfast Is A Clock"
      },
      {
        type: "paragraph",
        text: "In Spain it is coffee and toast rubbed with tomato at nine, then a second breakfast around eleven, because lunch is at half past two and dinner does not begin until half past nine. Understand the first and the rest of the country's timings stop being annoying. In Vietnam, pho is a morning food. The good stalls open at six and have sold out by ten, so arriving at half past eleven means eating somebody's second-best batch. In Cairo the ful and taameya carts work the hour before the offices open and then move on. Breakfast is the most reliable way to find out when a city is actually awake."
      },
      {
        type: "heading",
        text: "The Buffet Flattens Everything"
      },
      {
        type: "paragraph",
        text: "Hotel breakfast from Lisbon to Lucknow is the same room: eggs in a warming tray, croissants, sliced fruit, a coffee machine that grinds loudly, and one local dish at the end of the line for form's sake. There is nothing wrong with that room. On a morning when the coach leaves at seven it is the difference between eating and not eating. It only becomes a waste on the days you have time. Paris hotels charge EUR 18 to 25 for a breakfast that costs EUR 5 at the counter across the road. Swiss hotels include it and it is genuinely good. Take the buffet on the days you leave early. Walk out of the hotel on the days you do not."
      }
    ],
  },
  {
    slug: "the-art-of-doing-almost-nothing",
    category: "inspiration",
    kicker: "Field Notes",
    readingTime: "4 min read",
    date: "2026-06-30",
    dateLabel: "30 Jun 2026",
    title: "The art of doing almost nothing.",
    image: "/experiance/maldives.png",
    imageAlt: "An island lagoon at sunset",
    description:
      "An empty morning, placed in the right town on the right day, does more for a long trip than another cathedral.",
    body: [
      {
        type: "paragraph",
        text: "Around day five of a fast itinerary, people stop seeing things. They still photograph them. But the churches have merged into one church, the coach smells familiar, and the only question at dinner is which country tomorrow. That is not a failure of the places. It is a failure of the schedule. The repair is not another site, or a better restaurant, or an earlier start. It is a morning with nothing in it, put into the plan on purpose and placed before people need it rather than after."
      },
      {
        type: "heading",
        text: "Where Nothing Works Best"
      },
      {
        type: "paragraph",
        text: "An empty day is not equally useful everywhere. A free morning in Lucerne, with the lake and a boat leaving every hour, is worth more than a free morning in Frankfurt. Naxos rewards it. Santorini in August does not. A Kerala houseboat moves for about four hours out of twenty-four and the rest of the time you sit on deck watching people wash clothes, which is the whole point of the booking. Vienna's older coffee houses will let a single melange hold a table for two hours and the waiter will not come back to hurry you along. Choose towns where sitting still is something the locals also do."
      },
      {
        type: "heading",
        text: "Put It In The Middle"
      },
      {
        type: "paragraph",
        text: "The empty day belongs on day five or six, not at the end, where it turns into packing. Most people sleep badly for the first three nights of a long trip and are running a deficit before anyone admits it. Laundry needs a day. Feet need a day. On coach routes with three hundred kilometre driving legs, one slow morning resets the entire second half. Book it properly: a hotel with a late checkout, or a pool, or a view, because an unplanned day in a bad hotel is just waiting. On our nine-day Europe routes it usually lands on the Switzerland leg. It is the only day on the itinerary with nothing to confirm, and the one that takes the most explaining when people book."
      }
    ],
  },
  {
    slug: "twelve-things-to-check-before-you-book",
    category: "travel-tips",
    kicker: "Field Notes",
    readingTime: "7 min read",
    date: "2026-06-26",
    dateLabel: "26 Jun 2026",
    title: "Twelve things to check before you book.",
    image: "/inner-page/innerpage.png",
    imageAlt: "A desk with a map and a notebook",
    description:
      "The questions worth asking a tour operator while the deposit is still refundable, from passport dates and insurance minimums to who picks up the phone at 2am.",
    body: [
      {
        type: "paragraph",
        text: "Almost everything that goes wrong on a group tour was decided at the booking stage, in the gap between what was promised and what anyone actually wrote down. We have been selling group tours since 1998, and the same twelve questions come up every season, usually a fortnight too late to matter. None of them are difficult. All of them are cheaper to ask before the deposit than after it. Keep this open on your phone while you read the itinerary you have been sent, and read the itinerary twice."
      },
      {
        type: "heading",
        text: "What The Brochure Leaves Out"
      },
      {
        type: "paragraph",
        text: "An itinerary is a marketing document until someone attaches names, dates and addresses to it. Ten nights in Europe can mean ten different trips depending on where the coach sleeps and how long it drives each day. Ask for the hotel list with addresses, not star ratings. A four-star in Milan can sit out at Cinisello Balsamo, half an hour from the Duomo on a good day; a plain three-star near Termini in Rome will serve you better. Then ask what the driving day looks like. European rules cap a coach driver at nine hours behind the wheel with a forty-five minute break after four and a half. A tour that fills all nine, day after day, is a tour you will remember through glass."
      },
      {
        type: "heading",
        text: "Twelve Questions Before Payment"
      },
      {
        type: "paragraph",
        text: "None of these are trick questions, and no reasonable operator minds being asked. Send them in one email, numbered, and keep the reply. If a company has run the route before, the answers take ten minutes to write. If they take a week, that is also information. Work down the list in order. The first four decide whether you travel at all. The rest decide what the trip feels like once you do."
      },
      {
        type: "definitions",
        items: [
          {
            term: "Passport dates",
            description: "Schengen wants three months of validity beyond the day you leave the area, on a passport issued within the last ten years, with two blank pages. Check the issue date, not only the expiry."
          },
          {
            term: "The insurance figure",
            description: "A Schengen application needs medical and repatriation cover of at least 30,000 euros, valid in every country on the route. The cheapest policy on the comparison site often does not carry it."
          },
          {
            term: "Which consulate",
            description: "You apply to the country where you spend the most nights, or to your first point of entry if the nights are equal. Getting this wrong means starting the whole application again."
          },
          {
            term: "Appointment lead time",
            description: "Ask what date the operator can actually get you a slot, not how many working days the visa takes to process. In May and June the slot is the bottleneck, not the processing."
          },
          {
            term: "The deposit clock",
            description: "Find out the date your deposit stops being refundable and the date the air ticket gets issued. They are rarely the same day, and the second one is the expensive one."
          },
          {
            term: "Hotel addresses",
            description: "Names and postcodes, in writing, before payment. Star ratings are awarded differently in Italy, Switzerland and Thailand, and none of them tell you the distance to a station."
          },
          {
            term: "Seat rotation",
            description: "On a full coach, ask whether seats rotate daily. Nine days in the back row over the rear axle is a long nine days, and the rule is easier to agree on day one than day four."
          },
          {
            term: "What optional means",
            description: "Optional excursions are priced separately and often steeply. A Jungfraujoch ticket alone costs more than a night in most of the hotels. Get the list and the prices before you fly, not on the coach."
          },
          {
            term: "The third bed",
            description: "A triple room in most of Europe is a double with a folding bed pushed against the wall. If three of you are booked into one room, ask what the third bed physically is."
          },
          {
            term: "The single supplement",
            description: "Travelling alone on a group departure costs more, sometimes considerably more. The figure belongs on the quotation you compare, not in a message three weeks later."
          },
          {
            term: "TCS on the package",
            description: "As the rules stand, overseas tour packages attract tax collected at source: five per cent up to seven lakh in a financial year, twenty per cent above that. It is adjustable against your income tax, but it leaves your account first. Ask whether the quoted price includes it."
          },
          {
            term: "Who answers at 2am",
            description: "A local number, a named person, and a tour manager travelling on your coach rather than sitting in another country. Ask for it before you need it, because you will ask badly when you do."
          }
        ]
      },
      {
        type: "heading",
        text: "Where The Money Actually Goes"
      },
      {
        type: "paragraph",
        text: "Half the complaints we hear are about money nobody hid, only nobody mentioned. Tips for the driver and the tour manager are customary on a European coach tour and usually run two to three euros per person per day, collected near the end. Airport transfers on the arrival and departure days are sometimes in the price and sometimes a separate line. Entrance tickets to the buildings in the photographs are sometimes included and sometimes not. Lunch usually is not. Add all of it up before you compare two quotations, because the cheaper quotation is frequently the one with more of these left outside it."
      },
      {
        type: "heading",
        text: "The Answer You Want To Hear"
      },
      {
        type: "paragraph",
        text: "You can judge an operator by the way the answers arrive. Vague is not the same as flexible. Centrally located is not an address, three-star or similar is not a hotel, and as per itinerary is not a meal plan. A company that has run the route will have the addresses on file and will send them without a second phone call, because someone from that company has already stood in that lobby at eleven at night with thirty tired people and a room list that did not match. If the reply comes back saying it is all taken care of, ask again by email. The answer you can forward is the only one worth keeping."
      }
    ],
  },
  {
    slug: "a-week-in-the-hills-without-a-plan",
    category: "stories",
    kicker: "Field Notes",
    readingTime: "6 min read",
    date: "2026-06-22",
    dateLabel: "22 Jun 2026",
    title: "A week in the hills without a plan.",
    image: "/destinations/kerala/hill-stations.avif",
    imageAlt: "Tea terraces rolling into mist",
    description:
      "Seven days in the Tirthan valley with no bookings past the first night, and what turned out to be worth doing once nothing had been decided in advance.",
    body: [
      {
        type: "paragraph",
        text: "The plan was one night near Aut and after that nothing. No hotel list, no fixed return, a bag with two changes of clothes and a jacket that turned out to be too thin. This is not how we sell trips and it is not what we would recommend to most people paying for ten days of leave. But once every few years it is worth finding out what a week does when you stop steering it. Ours went to the Tirthan valley, mostly because the bus stopped there and it was raining in the direction we had meant to go."
      },
      {
        type: "heading",
        text: "Getting Off At Aut"
      },
      {
        type: "paragraph",
        text: "The overnight bus from Kashmere Gate takes about twelve hours to Aut when the road behaves, and the conductor will put you down at the mouth of the tunnel around half past five in the morning. There is one tea stall open, the Beas going past louder than you expect, and nothing else at all. From there a shared taxi runs up the side valley to Banjar in an hour and on to Gushaini in another twenty minutes, on a road that follows the Tirthan closely enough to watch the water the whole way. Homestays start at around twelve hundred rupees a night with dinner. We took the third one we asked at, because the room faced the river and the family was already eating."
      },
      {
        type: "heading",
        text: "The Days You Do Not Plan"
      },
      {
        type: "paragraph",
        text: "Three of those days had nothing in them. We walked upstream until the path gave out, then further, and met one shepherd and two men rebuilding a footbridge with a jeep winch. The Great Himalayan National Park begins a few kilometres past the last houses, and the office at Sai Ropa issues the permit and can tell you which of the guides is free that week. Brown trout have been in the Tirthan since the British put them there, and the fisheries department still sells angling licences by the day. We caught nothing. On the fourth morning it rained until noon and we sat in the kitchen while the family's daughter did her chemistry homework at the same table."
      },
      {
        type: "heading",
        text: "Jalori, And Turning Back"
      },
      {
        type: "paragraph",
        text: "Jalori Pass sits at 3,120 metres and the road up from the valley is the better part of an hour in first gear. At the top there are four or five dhabas selling rajma chawal and sweet tea, and two walks leaving in opposite directions along the ridge. Serolsar Lake is five kilometres east through old oak forest, small and green, with a temple at the water's edge and a bird that is said to keep the surface clear of leaves. Raghupur Fort is closer, a broken wall on a shoulder with a long view behind it. The pass shuts once the snow settles, usually from January to March, and the buses stop with it."
      },
      {
        type: "heading",
        text: "The Price Of Not Booking"
      },
      {
        type: "paragraph",
        text: "The seven days came to a little under nine thousand rupees a head including both bus journeys, which is less than two nights in any hill station with a mall road. What it cost instead was choice. We missed the Chhoie waterfall entirely because we walked up the wrong bank and by the time we understood that it was four o'clock. We had meant to cross the pass and drop down to Ani for a night, and never did. A booked trip would have delivered both and taken away the fourth morning in the kitchen. That is the trade, and it only works if you have days you can afford to lose. We had seven and used five."
      }
    ],
  },
  {
    slug: "how-to-travel-well-with-people-you-love",
    category: "guides",
    kicker: "Field Notes",
    readingTime: "5 min read",
    date: "2026-06-18",
    dateLabel: "18 Jun 2026",
    title: "How to travel well with people you love.",
    image: "/experiance/honey-moon.jpg",
    imageAlt: "Two travellers walking a shoreline",
    description:
      "Rooming, money and walking pace decide whether a holiday with family or friends works, and each one is easier to settle at home than at a hotel desk.",
    body: [
      {
        type: "paragraph",
        text: "Arguments on holiday are rarely about the holiday. They are about sleep, money and walking pace, three things that can be settled at home in an hour and almost never are. Groups of four to eight feel it worst: too small to drift apart naturally, too large to decide anything quickly. Two people can improvise. A family with a nine-year-old, a knee that plays up and one person who wanted Kyoto and got Bangkok cannot. What follows is the part of planning nobody enjoys, done once, before anything is paid for."
      },
      {
        type: "heading",
        text: "Decide The Rooms First"
      },
      {
        type: "paragraph",
        text: "Room allocation sets the mood of a trip more reliably than the itinerary does. Rooms get handed out at a desk, late, in front of everyone, and whatever was not agreed at home gets decided there by whoever speaks first. Japanese business hotel rooms are built for one person and one small suitcase. European family rooms usually put somebody on a fold-out against the wall. Work out who shares with whom before booking, and be honest about snoring, bathroom time and who needs the light off at ten. If it turns out you need one more room than the budget allows, better to learn that now, when it costs money, than on the second night, when it costs more than money."
      },
      {
        type: "heading",
        text: "One Wallet, One Ledger"
      },
      {
        type: "paragraph",
        text: "Money between people who love each other works best when nobody is keeping a private count. Put a common float on one forex card and agree what comes out of it, meaning transport, meals eaten together and tickets everyone wanted, and what does not, meaning shopping, the second dessert and anything one person chose alone. One person pays and one person writes it down; they need not be the same person. Settle once, at the end. A shared note on a phone does this as well as any app. The point is that a bill for four hundred euros in Lucerne stops being a conversation about who ordered the fish."
      },
      {
        type: "heading",
        text: "Match The Slowest Walker"
      },
      {
        type: "paragraph",
        text: "A group moves at the speed of its slowest walker, and pretending otherwise spoils the day for the fast ones too. Venice is bridges, and most of them have steps. The Paris Metro is largely without lifts, line 14 being the exception. Amsterdam's canal houses have staircases closer to ladders. Leh sits at roughly 3,500 metres and the first forty-eight hours there should have nothing scheduled in them. Read each day for what it actually asks: hours on your feet, steps, distance from where the vehicle can stop. Then leave one afternoon in three where the group splits and meets again for dinner. Nobody should have to ask permission to sit down."
      },
      {
        type: "heading",
        text: "The One Thing Each"
      },
      {
        type: "paragraph",
        text: "Before anything is booked, ask every person for one thing they want from the trip, stated specifically. Not to relax. A named place, a particular meal, a shop, an afternoon with nothing in it. Write the list down and put every item into the plan, including the one that sounds trivial. It is cheaper than it sounds, because most of them cost an hour. The value shows up later, when the transfer is late and everyone is hungry, and the person whose one thing already happened turns out to be much easier to be around. Ask on the last day whether they got it. By then people will tell you the truth."
      }
    ],
  },
  {
    slug: "the-desert-is-louder-than-you-think",
    category: "inspiration",
    kicker: "Field Notes",
    readingTime: "5 min read",
    date: "2026-06-14",
    dateLabel: "14 Jun 2026",
    title: "The desert is louder than you think.",
    image: "/experiance/beach-escape.png",
    imageAlt: "A wide open landscape at midday",
    description:
      "Wind, camels, generators and two hundred other people: what the Thar dunes actually sound like, and the half hour before dawn when they finally stop.",
    body: [
      {
        type: "paragraph",
        text: "Everyone who sells a desert trip sells silence. The brochures say it, the photographs imply it, and the first night at a camp outside Jaisalmer puts an end to it. Wind runs over open sand almost constantly and it is not a soft sound. Camels grunt and shift and complain through half the night. Behind the ridge a generator keeps a buffet warm. A jeep drops a second group at ten. The Thar is the most densely populated desert on earth and it behaves accordingly. The silence is real, but it arrives on a schedule, and almost nobody is awake for it."
      },
      {
        type: "heading",
        text: "Where The Noise Comes From"
      },
      {
        type: "paragraph",
        text: "Sand absorbs sound and wind carries it, so what you hear in the dunes is close and constant rather than distant and clear. At Sam, forty-odd kilometres west of Jaisalmer, most of it is other people. The camels leave the road at four in the afternoon and come back after sunset. Folk sets start around eight, Manganiyar singers with a harmonium and a khartal player, and the drumming genuinely does run to eleven. In the Emirates the noise is engines instead. Dune bashing goes out in convoys with the tyres let down to around fifteen psi, and forty Land Cruisers crossing the same slipface sounds like roadworks. None of this is a swindle. It is the product, and it is usually a good one."
      },
      {
        type: "heading",
        text: "The Half Hour Before Dawn"
      },
      {
        type: "paragraph",
        text: "Real quiet out there has a timetable. It falls between about four and six in the morning, after the generator is cut and before the camels are loaded, and the wind usually drops just before first light and stays down for a while. If you want the thing the photographs promise, set an alarm for five, walk two hundred metres out from the tents and sit facing away from the lights. That is the whole technique. What you get is not empty. Desert larks start early, a chinkara will cough somewhere, and near the Desert National Park the odds are decent that something large is walking a ridge you cannot see."
      },
      {
        type: "heading",
        text: "The Cold Is The Other Surprise"
      },
      {
        type: "paragraph",
        text: "From December to February the days sit at a comfortable 22 to 25 degrees and the nights fall to five, sometimes lower. Sand holds no heat at all. Camps supply quilts, so the problem is never the sleeping. It is the evening, six to nine, when you are outside in whatever you packed for a desert. People arrive in cotton and spend the entire folk performance shivering politely. Carry a fleece, a windproof layer and a cap, because the wind is the part that hurts. From April it reverses completely and the afternoons touch 45, which is why the season closes rather than stretches."
      },
      {
        type: "heading",
        text: "Two Questions For The Camp"
      },
      {
        type: "paragraph",
        text: "Ask two things before you pay. Whether the generator runs all night, because at some camps it does and you will hear it through canvas. And how far your tent sits from the performance ground, because sound carries several hundred metres over flat sand, and the far row is a different night from the second row. Camps have a site plan and will send it if asked. If you want the quieter version outright, look at Khuri, about forty-five kilometres southwest, where the dunes are lower and the camps run out of village households. Or pay for a camel or jeep drop that goes three or four kilometres out and stays there, rather than the ninety-minute sunset loop everybody buys."
      }
    ],
  },
  {
    slug: "what-a-good-hotel-actually-gets-right",
    category: "guides",
    kicker: "Field Notes",
    readingTime: "6 min read",
    date: "2026-06-10",
    dateLabel: "10 Jun 2026",
    title: "What a good hotel actually gets right.",
    image: "/experiance/bali.png",
    imageAlt: "A terrace above a green valley",
    description:
      "Star ratings and lobby photographs decide nothing; breakfast hours, lift counts and who staffs the front desk at two in the morning decide everything.",
    body: [
      {
        type: "paragraph",
        text: "Thirty people, nine floors, one small lift and a coach leaving at seven. That is where a hotel gets judged, and almost none of what settles the verdict appears in the photographs. Lobbies photograph well. Lifts do not. Two hotels can carry the same star rating, the same breakfast description and the same distance-to-centre figure and hand you completely different weeks. The difference is nearly always operational rather than architectural: what time the kitchen opens, how the luggage gets down at check-out, whether a real person is at the desk when a flight lands late. After two decades of putting groups into rooms, these are the things that decide it."
      },
      {
        type: "heading",
        text: "Location Means Time, Not Kilometres"
      },
      {
        type: "paragraph",
        text: "Coach tours in Europe rarely sleep in city centres. Paris hotels sit out towards Bagnolet or Marne-la-Vallee, Rome hotels along the Aurelia corridor, and on paper eight kilometres sounds fine. What matters is the walk to the nearest metro or tram and the hour that line stops running. A hotel twelve minutes from a station on a line running past midnight is more central, in practice, than one four kilometres out with a shuttle that ends at nine. So ask for the name of the nearest stop rather than the distance to the centre, then look at where that line goes. Any operator worth using will tell you before you ask."
      },
      {
        type: "heading",
        text: "Breakfast Is A Departure Problem"
      },
      {
        type: "paragraph",
        text: "Included breakfast means nothing on its own. The question is what time it opens against what time the coach leaves. A seven-thirty start against a seven o'clock departure is an argument you will have with a shift manager in a language you do not speak, and it comes up constantly on Swiss and Italian mornings where the day starts early to make a cable car slot. Most hotels will put together a packed breakfast if the group asks a day ahead. Almost none will do it if asked at seven. On our tours this gets fixed at the point of booking, and the only reason it works is that somebody put it in writing."
      },
      {
        type: "heading",
        text: "The Things Nobody Photographs"
      },
      {
        type: "paragraph",
        text: "Ask how many lifts serve the floors, because nine floors on one small lift is forty minutes of luggage at check-out, and older Paris and Rome properties are the usual offenders. Ask whether the room is twin or double, since friends booking online get this wrong and find out at eleven at night. Ask when the city tax is collected, which in Rome runs roughly six to seven euros per person per night for a three or four star, at the desk, often in cash. Then the smaller things: hot water pressure at seven when the whole floor is showering, blackout curtains that meet in the middle, which matters in northern Europe in June, sockets near the bed, a kettle, a window that opens onto something other than the delivery bay. Plenty of European hotels also switch heating and cooling by calendar date rather than by weather, so in early May the cooling may simply not be on."
      },
      {
        type: "heading",
        text: "The Front Desk Is The Product"
      },
      {
        type: "paragraph",
        text: "What separates a good hotel from an adequate one is what happens when something goes wrong at an inconvenient hour. A bag that never came off the carousel. A passport left in the seat pocket of a coach that has already gone. A traveller with a fever at midnight in a country where nobody in the family speaks the language. Hotels that keep a real person at the desk overnight settle these in twenty minutes. Hotels that divert to a phone number settle them by morning, which is not the same thing. It is the one line on a hotel comparison that never appears on the comparison."
      }
    ],
  },
  {
    slug: "notes-from-a-city-i-did-not-expect-to-like",
    category: "stories",
    kicker: "Field Notes",
    readingTime: "7 min read",
    date: "2026-06-06",
    dateLabel: "6 Jun 2026",
    title: "Notes from a city I did not expect to like.",
    image: "/experiance/paris.png",
    imageAlt: "A boulevard in the late afternoon",
    description:
      "Brussels is the ninety-minute lunch stop between Paris and Amsterdam, and almost everything worth finding there sits half an hour's walk from where the coaches park.",
    body: [
      {
        type: "paragraph",
        text: "Brussels is the city most people cross rather than visit. On a nine-day European run it is ninety minutes between Paris and Amsterdam: park near the Grand-Place, take the photograph, find the small bronze boy, buy chocolate from a shop that ships to fifty countries, leave. I did it that way four or five times before I stayed a night, and I stayed only because a train was cancelled. The city that exists after the coaches pull out is not the same place. It is grey, badly organised, argumentative about its own languages and considerably better than its reputation, which it seems in no hurry to correct."
      },
      {
        type: "heading",
        text: "The Two-Hour Version"
      },
      {
        type: "paragraph",
        text: "The standard stop is the Grand-Place and the six streets around it. The square earns the praise. Its guild houses went up in the few years after the French bombardment of 1695 flattened the centre, which is why a medieval square looks like one deliberate design, and the Town Hall spire runs to about ninety-six metres. Then everybody walks five minutes to the Manneken Pis, which is around sixty centimetres tall, and watches two hundred people be quietly disappointed by it. The statue owns more than a thousand costumes, kept in a museum around the corner, and it gets dressed on a published calendar. Nobody tells the coach groups that, so nobody looks it up."
      },
      {
        type: "heading",
        text: "Everything Is Written Twice"
      },
      {
        type: "paragraph",
        text: "Brussels is officially bilingual, so every street sign, every station and most menus carry French and Dutch. Rue de la Loi is also Wetstraat. Bruxelles-Midi is also Brussel-Zuid, which matters when you are looking for a platform under time pressure. The region sits enclosed by Flanders and speaks mostly French, and the arrangement is the product of a long argument nobody won. The visible result is a place that is careful, faintly bureaucratic and reluctant to declare a single identity. It is also, plausibly, why the EU institutions ended up here. A capital that had already spent a century negotiating with itself was a reasonable venue."
      },
      {
        type: "heading",
        text: "Where The City Actually Is"
      },
      {
        type: "paragraph",
        text: "The interesting part of Brussels sits thirty minutes' walk from the square, in directions the day trips never take. Saint-Gilles and Ixelles hold the Art Nouveau. Victor Horta built four houses here that are on the UNESCO list, and his own, on Rue Americaine, is open as a museum with the original staircase and light well intact. Sablon is antiques and the serious chocolatiers. Anderlecht has Cantillon, a lambic brewery running since 1900 that still ferments in open vats in a wooden loft and lets you walk through the working building for the price of a couple of glasses. Across the centre, roughly sixty comic-strip murals are painted on gable ends, which is a walking route disguised as municipal decoration."
      },
      {
        type: "heading",
        text: "The Food Is Not A Joke"
      },
      {
        type: "paragraph",
        text: "Frites are a Belgian argument conducted in public. They are fried twice, served in a paper cone with a small fork, and the mayonnaise is neither optional nor a punchline. Maison Antoine on Place Jourdan has been doing it since 1948, and the bars around that square will let you bring the cone inside if you buy a beer. Waffles come in two kinds and they are not interchangeable. The Brussels waffle is light and rectangular and eaten with a fork. The Liege waffle is dense, with pearl sugar caramelised into it, and eaten walking. The thing sold on the tourist streets under cream and strawberries is neither, particularly."
      },
      {
        type: "heading",
        text: "One Night, Done Properly"
      },
      {
        type: "paragraph",
        text: "Stay near Sainte-Catherine or Sablon rather than around Midi, which is the Eurostar terminal and not a pleasant address after dark. Trams and the metro reach everything worth reaching, and the city is small enough that most of a day can be walked. Give the Atomium a decision rather than a default: 102 metres of Expo 58 optimism out at Heysel, twenty minutes on the metro, and it is either exactly your thing or half a morning gone. And check which airport your ticket actually means. Charleroi is sold as Brussels South and sits about fifty kilometres away, an hour by shuttle bus from a city it is not in."
      }
    ],
  },
];

/* The page's whole props tree in one call — the seam a Strapi reader replaces. */
export function getJournalIndex() {
  const [featured, ...rest] = ARTICLES;

  return {
    title: "Stories, Guides & Ideas for\nYour Next Journey",
    description:
      "Discover remarkable places, unforgettable landscapes and experiences\ncurated for the way you love to travel.",
    categories: JOURNAL_CATEGORIES,
    featured: withHref(featured),
    articles: rest.map(withHref),
  };
}

/* The destination is derived, not stored: every article lives at its own slug,
   so an entry cannot be added with a link that points nowhere. */
function withHref(article) {
  return { ...article, href: `/journal/${article.slug}` };
}

/* ── article ───────────────────────────────────────────────────────────── */

/* The standfirst the detail page prints under the headline. The index card
   carries no `description` for most entries — it does not draw one — so the
   article page falls back to its own opening paragraph rather than to a hole. */
function standfirst(article) {
  if (article.description) return article.description;
  const first = (article.body ?? []).find((block) => block.type === "paragraph");
  return first?.text ?? "";
}

/* The guard for an entry filed without a body. Every article above has one
   today, so nothing reaches this — but the index and the article page are
   driven off the same list, and an entry added for its card alone would
   otherwise render a headline with nothing under it. Better a sentence that
   admits what happened than an empty column. */
const PLACEHOLDER_BODY = [
  { type: "heading", text: "This piece is still being written" },
  {
    type: "paragraph",
    text: "The headline, the photograph and the filing are in place, but the copy for this entry has not been written yet. It will read like the rest of the journal — a few hundred words on the places and the practicalities, written by someone who has been.",
  },
  {
    type: "paragraph",
    text: "In the meantime, the pieces below cover neighbouring ground, and the concierge desk will answer anything specific faster than an article can.",
  },
];

/* PLACEHOLDER, like the photographs. A single house byline stands in until the
   pieces are attributed to whoever actually wrote them. */
const HOUSE_AUTHOR = {
  name: "Fortune Editorial",
  avatar: "/countries/africa/sarah.png",
};

/** One article with everything its page needs, or null — which the route 404s. */
export function getArticle(slug) {
  const index = ARTICLES.findIndex((article) => article.slug === slug);
  if (index === -1) return null;

  const article = ARTICLES[index];

  return {
    ...withHref(article),
    standfirst: standfirst(article),
    body: article.body ?? PLACEHOLDER_BODY,
    /* Every piece carries a byline. Only the featured entry names its own
       today, and a lone date under a headline reads as an oversight rather than
       a choice — so the rest fall back to the desk. Give an entry its own
       `author` and it wins. */
    author: article.author ?? HOUSE_AUTHOR,
    /* The four that follow it, wrapping at the end so the last article gets a
       full row rather than an empty one. Its own entry is never among them. */
    related: [...ARTICLES.slice(index + 1), ...ARTICLES.slice(0, index)]
      .slice(0, 8)
      .map(withHref),
  };
}

/** Every article as a route param, for generateStaticParams. */
export function getArticleSlugs() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}
