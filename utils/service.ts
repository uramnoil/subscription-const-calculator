interface Service {
  name: string;
  tags: { [key: string]: string };
  plans: Plan[];
}

interface Plan {
  name: string;
  price: number;
}

const allServices: Service[] = [
  {
    name: "Spotify",
    tags: {
      type: "music"
    },
    plans: [
      { name: "Free", price: 0 },
      { name: "Standard", price: 980 },
      { name: "Student", price: 480 },
      { name: "Duo", price: 1280 },
      { name: "Family", price: 1580 },
    ],
  },
  {
    name: "YouTube Premium",
    tags: {
      type: "video"
    },
    plans: [
      { name: "Individual", price: 1280 },
      { name: "Family", price: 2280 },
      { name: "Student", price: 780 },
    ],
  },
];

export type { Plan, Service };
export { allServices };
