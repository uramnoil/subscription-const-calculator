interface Service {
  name: string;
  plans: Plan[];
}

interface Plan {
  name: string;
  price: number;
}

const allServices: Service[] = []; 

export type { Plan, Service };
export { allServices };
