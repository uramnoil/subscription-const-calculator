interface Service {
  name: string;
  plans: Plan[];
}

interface Plan {
  name: string;
  price: number;
}

const allServices: Service[] = [
  {
    name: "Spotify",
    plans: [
      { name: "Free", price: 0 },
      { name: "Standard", price: 980 },
      { name: "Student", price: 480 },
      { name: "Duo", price: 1280 },
      { name: "Family", price: 1580 },
    ],
  },
];

export type { Plan, Service };
export { allServices };
