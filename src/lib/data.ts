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
}

export const events: SportingEvent[] = [
  {
    id: "jan-2026",
    month: "January",
    title: "New Year's Day Marathon",
    location: "Sydney, Australia",
    status: "completed",
    date: "January 1, 2026",
    stats: {
      distance: "42.195 km",
      time: "3:45:22",
      elevation: "324 m",
    },
    story:
      "The year began with a spectacular sunrise run across the Sydney Harbour Bridge. Starting at 5:30 AM to beat the summer heat, thousands of runners gathered at the iconic Opera House forecourt. The atmosphere was electric as fireworks from the night before still lingered in the air. Personal best achieved on a course that wound through the historic Rocks district, across the bridge, and along the stunning coastline to Bondi Beach. A perfect way to kick off the 2026 sporting odyssey.",
    images: ["/posters/january.svg"],
    themeColor: "#FF6B35",
  },
  {
    id: "feb-2026",
    month: "February",
    title: "Alpine Ski Challenge",
    location: "Zermatt, Switzerland",
    status: "upcoming",
    date: "February 14-15, 2026",
    story: "",
    images: ["/posters/february.svg"],
    themeColor: "#4ECDC4",
  },
  {
    id: "mar-2026",
    month: "March",
    title: "Tokyo City Cycling Tour",
    location: "Tokyo, Japan",
    status: "upcoming",
    date: "March 21, 2026",
    story: "",
    images: ["/posters/march.svg"],
    themeColor: "#FF1744",
  },
  {
    id: "apr-2026",
    month: "April",
    title: "Paris Marathon",
    location: "Paris, France",
    status: "upcoming",
    date: "April 5, 2026",
    story: "",
    images: ["/posters/april.svg"],
    themeColor: "#7B68EE",
  },
  {
    id: "may-2026",
    month: "May",
    title: "Scottish Highlands Ultra",
    location: "Highlands, Scotland",
    status: "upcoming",
    date: "May 16-17, 2026",
    story: "",
    images: ["/posters/may.svg"],
    themeColor: "#2E8B57",
  },
  {
    id: "jun-2026",
    month: "June",
    title: "Midnight Sun Triathlon",
    location: "Tromsø, Norway",
    status: "upcoming",
    date: "June 21, 2026",
    story: "",
    images: ["/posters/june.svg"],
    themeColor: "#FFD700",
  },
  {
    id: "jul-2026",
    month: "July",
    title: "Tour de Mont Blanc",
    location: "Chamonix, France",
    status: "upcoming",
    date: "July 10-12, 2026",
    story: "",
    images: ["/posters/july.svg"],
    themeColor: "#1E90FF",
  },
  {
    id: "aug-2026",
    month: "August",
    title: "Open Water Swimming Championship",
    location: "Santorini, Greece",
    status: "upcoming",
    date: "August 8, 2026",
    story: "",
    images: ["/posters/august.svg"],
    themeColor: "#00CED1",
  },
  {
    id: "sep-2026",
    month: "September",
    title: "Berlin Marathon",
    location: "Berlin, Germany",
    status: "upcoming",
    date: "September 27, 2026",
    story: "",
    images: ["/posters/september.svg"],
    themeColor: "#FF4500",
  },
  {
    id: "oct-2026",
    month: "October",
    title: "Great Wall Adventure Run",
    location: "Beijing, China",
    status: "upcoming",
    date: "October 17, 2026",
    story: "",
    images: ["/posters/october.svg"],
    themeColor: "#DC143C",
  },
  {
    id: "nov-2026",
    month: "November",
    title: "New York City Marathon",
    location: "New York, USA",
    status: "upcoming",
    date: "November 1, 2026",
    story: "",
    images: ["/posters/november.svg"],
    themeColor: "#4169E1",
  },
  {
    id: "dec-2026",
    month: "December",
    title: "Cape Town Cycle Tour",
    location: "Cape Town, South Africa",
    status: "upcoming",
    date: "December 6, 2026",
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
