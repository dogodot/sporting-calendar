export interface StravaPhoto {
  url: string;
  caption?: string;
}

export interface StravaData {
  activityId: string;
  distance: number; // meters
  movingTime: number; // seconds
  elapsedTime: number; // seconds
  elevationGain: number; // meters
  mapPolyline?: string; // encoded polyline for route
  startLatlng?: [number, number];
  photos?: StravaPhoto[];
}

// Participant data for multi-person events
export interface ParticipantData {
  name: string;
  strava: StravaData;
}

export interface SportingEvent {
  id: string;
  month: string;
  title: string;
  location: string;
  status: "upcoming" | "completed";
  date: string;
  stats?: {
    distance?: string;
    time?: string;
    elevation?: string;
  };
  story: string;
  images: string[];
  themeColor: string;
  website?: string; // Event website URL (single event)
  websites?: { name: string; url: string }[]; // Multiple event websites
  stravaActivityId?: string; // Strava activity ID to fetch data (deprecated, use participants)
  strava?: StravaData; // Cached Strava data (deprecated, use participants)
  participants?: ParticipantData[]; // Multiple participants with their Strava data
}

// Helper functions to format Strava data
export function formatDistance(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(2)} km`;
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function formatElevation(meters: number): string {
  return `${Math.round(meters)} m`;
}

export function formatPace(meters: number, seconds: number): string {
  if (meters === 0) return "0:00 /km";
  const paceSecondsPerKm = seconds / (meters / 1000);
  const paceMinutes = Math.floor(paceSecondsPerKm / 60);
  const paceSeconds = Math.round(paceSecondsPerKm % 60);
  return `${paceMinutes}:${String(paceSeconds).padStart(2, "0")} /km`;
}

export const events: SportingEvent[] = [
  {
    id: "jan-2026",
    month: "January",
    title: "Steyning New Year's Day Time Trial",
    location: "Steyning, UK",
    status: "completed",
    date: "January 1, 2026",
    story:
      "We started the New Year with a full-on Time Trial, organised by Brighton Excelsior. Evidently this event has been going for some 50+ years! The day was interesting - a max 30 minute effort on Jan 1st, a test for the Pinarellos as well as the legs. Jacki was amazing, beating me by a solid 30 seconds over the course. Roll on February!",
    images: ["/posters/january.svg"],
    themeColor: "#FF6B35",
    participants: [
      {
        name: "Jacki",
        strava: {
          activityId: "16901880580",
          distance: 16182.2,
          movingTime: 1760, // 29:20 race time
          elapsedTime: 1815,
          elevationGain: 59,
        },
      },
      {
        name: "Graeme",
        strava: {
          activityId: "16901920886",
          distance: 16182.2,
          movingTime: 1789, // 29:49 race time
          elapsedTime: 1845,
          elevationGain: 59,
          mapPolyline: "_duuHdvbADA@G@GBODSDUFWHUFYHYJYJYJ]LYL[N[L[PYNYPWNWPWRURWRSRUTSRSRSRSTURSRUPYRWPYP[P[N[P[L]N_@La@Na@La@Ja@Je@Jc@He@He@Fe@Di@Fg@Fg@Fg@Fe@Dg@Fe@Fe@Fe@Dg@Fe@De@Dc@Fc@Da@Da@Da@Da@Da@Da@Da@D_@D_@D_@D]D_@D_@B_@D_@D]D[D]D]D[D[D]D]B]D]D]D]D]D[D]D[D]B]D_@D]B]D_@D]D_@D]D]F_@D_@F]Fa@D_@F]D]F]D]F]D_@F]F]F]D]F]F[F]F]F]D]F_@F[F]H]F[F[F]F]F[H[F]H[HYJ[H[J[H[JYJWLYJYJWLWLWJWJUJWLUJUJSLSLSLSLOLQLONQLMLONMLOLKLMLMLKLMNKLILKNILKNILILKNINGLGLGLGLENGLELENELELELCLCNELCNCLCLENALCLCNCNALANALCLCLANALALCNALANALCLANCLANANCLALCNALANALANANALALANCLANANCLANANAL?LANANALAN?NCN?NANAN?NANCN?NALCPCNANCPCNCNANCNAPCNCPEPCNCPEPCNEPCPCNEPENCREPGPEPEPERGNCPEPEPEPGPGPGRGPEPGRGPIPIPIPINIPKNIPKNKPINKNMPKNMNKNONMLMNMLONMLONOLOLOLONOJOLQLOJOLOLQLONQNMLONMLKLMNMLMHQFUDUFUJMLKNILMJQJUJQLSJQLSLSJSNSLUNSNSLULUNULSLULSJULSJULULUJWLUJUJWJUJWJWJUHWJWHYHWHWHWHWHWFWHYFYFYHYFYDYFYFYDYFWDWDWBYDWBWBYBWBWBYBYBWBWBWBWBYBWBWBYBU@WBWBW@WBWBYBWBYBWBWBWBWDYBWBWDWBWDUDWDWDWDUDSDUDSDUFSDUDUFSDQDSFQFUFQDUFSFQFSFQFSFQFSHQFSFQFQHOHQHSFQHQHQFQHOHOHOHOHMHOHOJMHOHMJKHOHMHOHOJOHMHMHOHMHMJMHOHOJOHQFQBSDSBSFSHOJGLELCLCNCNANCLCPCNAPCNCPCPCPARAPCRAPCPCRCPCPCPCRCRCPEPCRCPEPERCPEPEREPERGPERGPGPERGPIRGPGRIPGPGPIPGPIRIPGPKNKPIRGPINGPGPERENENEPENENCLCNCLCNCLALCLCLANALALCLAJALCLAJAJAJAJAJ?JAJCJ?JAJ?LCJ?JAJ?J?J?LAJ?JAJ?L?J?JAJ?J?JAL?J?L?LAL?N?N?N?N?N?NAN@N?P@N?P?P@P?P?P?P@P?P?P@PAP?R?P?R?PCRARARERERERGTGRIRKRKPMRMPMPOPQPSPSPSNSNULUNWLWLWLYJWLYJYJYLYJYLWJUJWJWJYJWHWJWJWJWJWJUHWJSLUJSJUJSJSLSJSLSJQLSJQLQJQLQLOLONQNOLONQLMLONKLMLMNKLKLINILINILGNILGNILGNINENENGNANCNCNANANANAN@N?N?N@L@NBNBNBNDNDNDNFLDNFLDLFNDLDLFLFNDJDNFLDNDNDLDNDN@NBL@N?L@NALANANANCNCLENGNELGNINILILKLIJKLKJMLOJOJQJOJQJOJQHOJQJQJQJQJQJQJQJQJQJQJQJSJQLOJQJQLOLMNMLOLMLOJMLKNMLKLKNKLKNKLKNKLINILILGNGNGNGNENGNENENGLENENGLENELENCNENENENCNENELENENCNCNENCNELENENCNELENELENCNENGNCNGNGLKJMJQHSFSHQFUDW@Y@Y@YAYCWAYAY?Y?[BWDYFUJQJOLKLINCN?NBNDLHLLHNJRFRDT@X?V?XCVCVEVITILMLMJOHMFOHMHKLKPGPIPGNGJKLKLKNMJMHMFOFODMBODMDMBMDMDMDMBMBOBMDOBMBMDMDMBOBMDOBMDMDOBMDMBMBMDOBMDODMDODMDMFMDODMDODOFMDMFODMFODMHMFMHMFKHMHMHKHMJKHMHKJKJMJIJKJKJKJKLKLKJKLILKNILKLILININININKLINILININKNINININILIPKNINILKNKNILKJKLKLKJKJKJMJMHMFKFOFMDMDMDMBMDO@M@M@M?O@M?M?MAOAOCOCMCOCMEOGOGOGOGOGOGMGQGOEOGOGOEMEQEOEOCQCOCQCOAQAOAO?O@O?Q@O@OBODODODODODOFMFOFMFMHOHMHMHMHMHMJMJMJMLMJMLOLKLMLMLKNKLKLKNKNKNKNINKNIPKNKNINIPIPKNINIPIPIPKNINIPIPIPGPIPIPIPGPIPGPGPIPGRGPGRGPIPGNINGNIPGNIPGPGPGPGNINGNGNIPININILILILILILILIJIJKJIJIJIHIHKJIHIFKHIFKDKFIDKFKDIFKDKDKBIBKDI@KBKBI@K@IBK@K?K@I@K?K?K@K?I?K@IAK?K?I?K?K@I?K?KAK?I?K?K?I?KAI@K?KAK@K?M?K?K?K?M?K@M?K?K?M?K?K?M@KAM?K?KAM?O@M?M?M?M?O?O@M?Q@O@O@O@Q@O@S@OBSBQ@QBSBQBSBSBQBSDSBSDSDSDSDQFSFQFSDQDSFODQDOFQFOFMHOFMDMFMFMDODOFMDMFMFODMDMDMDMDKDMDMDMBMDMBKDMBMDMBKBMBKBMBMBKBMBKBKBK@MBK@KBM@K@KBK@M@KBK@M@K@KBK@K?I@M@K@I@K@K@M@K@M@K@KBK@MBK@IBK@KDIHIHIHIJGHIJIJILIJILILKLKLILINKNKNKNIPMNKPKPKLKPMPKRMNKRKNKPKRMPKPKPKTMRKTKRKTKRKVKTKTITITIVITITITITGTIVGVGTGVGTGTGVGTGVGVGTEXGVEVGXEXEVEXEXEXCZEZEZCXCXCZCXCXCXAZCZCZAXCZEZCZCXCZCXEZCXCXEXCXCXEXCXGXEXGXEZGZGZEXGZGXIVGVGVGTGVIVGTITGVITGTITITITIRIRIRITIPIRIPIPIPIPGNKPIPINKLIPILKNININKNILKPILKNININKNILINGJILGJGLIJGLGJGLGNENEPAPCRCTGPIJKHMDMBKBKJIHKFKHKHMLKJMJKLMJMLKNKLKNMLILKNKLILKLIJMLIJMLIJMLKJKHKJKJMHKLKHMHKJKJMFKHMHMHMHMHMFKHMDKHMDKFMDMFMHKFMDOFMFODMFMDMDMBMDKDMDMBMDKBMDMBMDKBMBMBK@KBKDM@MDKBODMBK@MDKBMBK@OBM@KBODOBM@OBMBK?M@M@OBM@OBM@M@M?K@O@O@OBO@M@OBO@O@M?M@K@M?M@M@M@MBO@O@O@OBO@O@O@M@O@OBQ?OBQBO@Q@OBO@Q@OBOBOBO@OBQBOBO@OBO@QDO@QBQBOBODQBODQBODOBODODOFODQFODOFMHOFODOFOHOHMHOHMJOHMJOJOHMJMJMLMLOJMLMLMLMLKLMLINMNKLKNKNINKPKNKPKPIPINIRIPIPIPIPIPIPGPGRGPGPIREPGRGRGRERGPERGREPEREREPERERERCTERERCRCPEPEPCRETETCPCRERCPERCRERCRCPEPCREPCREREPCRCPETCRETCRETCTCTCTERCVETCTCTCTCTETCRCRCPARCNANCNALANAJALALEX",
          startLatlng: [50.903844, -0.346752],
          photos: [
            { url: "https://dgtzuqphqg23d.cloudfront.net/dYbDSY1-HteOx6bq7q1Ta7AYMYN5zA94TZPUU8Oi6XI-1024x768.jpg" }
          ],
        },
      },
    ],
  },
  {
    id: "feb-2026",
    month: "February",
    title: "Reykjavik Northern Lights Run",
    location: "Reykjavik, Iceland",
    status: "upcoming",
    date: "February 7, 2026",
    stats: {
      distance: "5 km",
    },
    story: "We're heading to Iceland for something truly magical - the Northern Lights Run through downtown Reykjavik! Starting at 7pm from the Reykjavik Art Museum, this isn't about times or competition; it's about experiencing the city in an entirely new light. We'll be weaving through illuminated streets past the iconic Harpa concert hall, passing through fun stations surrounded by lights, music, and performing arts. Part of the Reykjavik Winter Lights Festival in its 19th year, each runner becomes part of the show with glowing merchandise included in registration. A 4-5K adventure that's all about feeling alive, having fun, and making memories together in one of the world's most spectacular settings.",
    images: ["/posters/february.svg"],
    themeColor: "#00D4AA",
    website: "https://www.nordurljosahlaup.is/en",
  },
  {
    id: "mar-2026",
    month: "March",
    title: "TBC",
    location: "TBC",
    status: "upcoming",
    date: "March 15, 2026",
    story: "",
    images: ["/posters/march.svg"],
    themeColor: "#FF1744",
  },
  {
    id: "apr-2026",
    month: "April",
    title: "TBC",
    location: "TBC",
    status: "upcoming",
    date: "April 15, 2026",
    story: "",
    images: ["/posters/april.svg"],
    themeColor: "#7B68EE",
  },
  {
    id: "may-2026",
    month: "May",
    title: "TBC",
    location: "TBC",
    status: "upcoming",
    date: "May 15, 2026",
    story: "",
    images: ["/posters/may.svg"],
    themeColor: "#2E8B57",
  },
  {
    id: "jun-2026",
    month: "June",
    title: "Swimrun Bewl & Dragon Ride",
    location: "Kent & Brecon Beacons, UK",
    status: "upcoming",
    date: "June 7 & 14, 2026",
    stats: {
      distance: "21km + 215km",
      elevation: "205m + 3,350m",
    },
    story: "A double-header month of epic proportions! First up on the 7th is Swimrun Bewl - the Gritty course featuring 4.2km of swimming across 9 swims and 17km of running through the High Weald Area of Outstanding Natural Beauty in Kent. Then just a week later, we tackle the legendary Dragon Ride Gran Fondo on the 14th - 215km through the Bannau Brycheiniog (Brecon Beacons) with seven major climbs including Black Mountain and The Bwlch. Rated 9.5/10 difficulty by the race director, this is the UK's most iconic sportive. Two weekends, two completely different challenges, one unforgettable month.",
    images: ["/posters/june.svg"],
    themeColor: "#FF6B00",
    websites: [
      { name: "Swimrun Bewl", url: "https://grittyrascals.com/swimrun-bewl/" },
      { name: "Dragon Ride", url: "https://www.dragonride.co.uk/" },
    ],
  },
  {
    id: "jul-2026",
    month: "July",
    title: "TBC",
    location: "TBC",
    status: "upcoming",
    date: "July 15, 2026",
    story: "",
    images: ["/posters/july.svg"],
    themeColor: "#1E90FF",
  },
  {
    id: "aug-2026",
    month: "August",
    title: "TBC",
    location: "TBC",
    status: "upcoming",
    date: "August 15, 2026",
    story: "",
    images: ["/posters/august.svg"],
    themeColor: "#00CED1",
  },
  {
    id: "sep-2026",
    month: "September",
    title: "Rat Race Coast to Coast",
    location: "Scottish Highlands",
    status: "upcoming",
    date: "September 12, 2026",
    stats: {
      distance: "100 miles",
      elevation: "~3,000m",
    },
    story: "The ultimate Scottish adventure - 100 miles from Nairn to the Isles of Glencoe in a single day! Starting at dawn near Cawdor Castle, we'll run 7 miles before jumping on road bikes for 44 miles past Loch Ness, then tackle 20 miles of off-road cycling followed by another 14 on tarmac. The grand finale: a 14-mile mountain trek through Glen Nevis and Glen Coe before kayaking the final mile to the finish at the Isles of Glencoe Hotel. Running, cycling, kayaking - through some of Scotland's most legendary and wild landscapes.",
    images: ["/posters/september.svg"],
    themeColor: "#FF4500",
    website: "https://www.ratrace.com/coast-to-coast",
  },
  {
    id: "oct-2026",
    month: "October",
    title: "TBC",
    location: "TBC",
    status: "upcoming",
    date: "October 15, 2026",
    story: "",
    images: ["/posters/october.svg"],
    themeColor: "#DC143C",
  },
  {
    id: "nov-2026",
    month: "November",
    title: "TBC",
    location: "TBC",
    status: "upcoming",
    date: "November 15, 2026",
    story: "",
    images: ["/posters/november.svg"],
    themeColor: "#4169E1",
  },
  {
    id: "dec-2026",
    month: "December",
    title: "TBC",
    location: "TBC",
    status: "upcoming",
    date: "December 15, 2026",
    story: "",
    images: ["/posters/december.svg"],
    themeColor: "#32CD32",
  },
];

export function getEventById(id: string): SportingEvent | undefined {
  return events.find((event) => event.id === id);
}

export function getEventByMonth(month: string): SportingEvent | undefined {
  return events.find(
    (event) => event.month.toLowerCase() === month.toLowerCase()
  );
}

export function getCompletedEvents(): SportingEvent[] {
  return events.filter((event) => event.status === "completed");
}

export function getUpcomingEvents(): SportingEvent[] {
  return events.filter((event) => event.status === "upcoming");
}
