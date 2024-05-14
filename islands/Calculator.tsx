import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { Plan, Service, allServices } from "../utils/service.ts";


export default function Calculator() {
  const selectedPlans = useSignal<Map<Service, Plan>>(new Map());
  const handlePlanSelect = (service: Service, plan: Plan) => {
    selectedPlans.value = new Map(selectedPlans.value.set(service, plan));
  };
  const handleUnselectPlan = (service: Service) => {
    selectedPlans.value.delete(service)
    selectedPlans.value = new Map(selectedPlans.value);
  }

  return (
    <main>
      <h1>Subscription Cost Calculator</h1>
      <section>
        <h2>Services</h2>
        {allServices.map((service) => (
          <section>
            <h3>{service.name}</h3>
            <fieldset>
              <ul>
                <li>
                  <input
                    type={"radio"}
                    onClick={() => {
                      handleUnselectPlan(service);
                    }}
                    checked={!selectedPlans.value.has(service)}
                  />
                  <label>None</label>
                </li>
                {service.plans.map((plan) => (
                  <li>
                    <input
                      type={"radio"}
                      onClick={() => {
                        handlePlanSelect(service, plan);
                      }}
                      checked={selectedPlans.value.get(service) === plan}
                    />
                    <label>{plan.name} - ¥{plan.price}</label>
                  </li>
                ))}
              </ul>
            </fieldset>
          </section>
        ))}
      </section>
      <section>
        <h2>Sum</h2>
        <span>Total: ¥{sum(selectedPlans.value)}</span>
        {selectedPlans.value.size >= 1 && <span>({joinSelectedPlans(selectedPlans.value)})</span>}
      </section>
    </main>
  );
};

function sum(selectedPlan: Map<Service, Plan>): number {
  return Array.from(selectedPlan.values())
    .reduce((acc, plan) => acc + plan.price, 0);
}

function joinSelectedPlans(SelectablePlanService: Map<Service, Plan>): string {
  return Array.from(SelectablePlanService)
    .map(([service, selectedPlan]) => service.name + " - " + selectedPlan.name)
    .join(", ");
}
