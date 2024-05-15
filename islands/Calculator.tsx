import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { Plan, Service, allServices } from "../utils/service.ts";
import { Head } from "$fresh/src/runtime/head.ts";


export default function Calculator() {
  const serviceAndSelectedPlans = useSignal(allServiceAndSelectedPlans);
  const serviceNameQuery = useSignal<string>("");

  const serviceToShow = filterServiceByName(serviceAndSelectedPlans.value, serviceNameQuery.value)

  const handlePlanSelect = (service: Service, plan: Plan) => {
    serviceAndSelectedPlans.value = serviceAndSelectedPlans.value.map((serviceAndSelectedPlan) => {
      if (serviceAndSelectedPlan.service === service) {
        return {
          service,
          selectedPlan: plan
        };
      }
      return serviceAndSelectedPlan;
    });
  };
  const handleUnselectPlan = (service: Service) => {
    serviceAndSelectedPlans.value = serviceAndSelectedPlans.value.map((serviceAndSelectedPlan) => {
      if (serviceAndSelectedPlan.service === service) {
        return {
          service,
          selectedPlan: null
        };
      }
      return serviceAndSelectedPlan;
    });
  }
  const handleServiceNameQueryInput = (query: string) => {
    serviceNameQuery.value = query;
  }

  return (
    <div>
      <Head>
        <title>SCC - Subscription Cost Calculator</title>
      </Head>
      <main>
        <h1>Subscription Cost Calculator</h1>
        <section>
          <h2>Services</h2>
          <input
            type="text"
            placeholder="filter searvice name"
            value={serviceNameQuery.value}
            onInput={(e) => {
              handleServiceNameQueryInput((e.target as HTMLInputElement).value);
            }}
          />
          {serviceToShow.map((serviceAndSelectedPlan) => (
            <section>
              <h3>{serviceAndSelectedPlan.service.name}</h3>
              <fieldset>
                <ul>
                  <li>
                    <input
                      type={"radio"}
                      onClick={() => {
                        handleUnselectPlan(serviceAndSelectedPlan.service);
                      }}
                      checked={serviceAndSelectedPlan.selectedPlan === null}
                    />
                    <label>None</label>
                  </li>
                  {serviceAndSelectedPlan.service.plans.map((plan) => (
                    <li>
                      <input
                        type={"radio"}
                        onClick={() => {
                          handlePlanSelect(serviceAndSelectedPlan.service, plan);
                        }}
                        checked={serviceAndSelectedPlan.selectedPlan === plan}
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
          <span>Total: ¥{sum(serviceAndSelectedPlans.value)}</span>
          {serviceAndSelectedPlans.value.length >= 1 && (
            <span>({joinSelectedPlans(serviceAndSelectedPlans.value)})</span>
          )}
        </section>
      </main>
    </div>
  );
}

const allServiceAndSelectedPlans = allServices.map((service) => {
  return {
    service,
    selectedPlan: null
  } as const as ServiceAndSelectedPlan;
});

type ServiceAndSelectedPlan = Readonly<{
  service: Service;
  selectedPlan?: Plan | null;
}>;

function filterServiceByName(
  serviceAndSelectedPlans: ServiceAndSelectedPlan[],
  query: string
): ServiceAndSelectedPlan[] {
  const queryLowerCase = query.toLowerCase();
  return serviceAndSelectedPlans.filter((serviceAndSelectedPlan) =>
    serviceAndSelectedPlan.service.name.toLowerCase().includes(queryLowerCase)
  );
}

function sum(serviceAndSelectedPlans: ServiceAndSelectedPlan[]): number {
  return serviceAndSelectedPlans
    .map((serviceAndSelectedPlan) => serviceAndSelectedPlan.selectedPlan)
    .filter((plan): plan is Plan => plan !== null)
    .reduce((acc, plan) => acc + plan.price, 0);
}

function joinSelectedPlans(serviceAndSelectedPlans: ServiceAndSelectedPlan[]): string {
  return serviceAndSelectedPlans
    .filter((serviceAndSelectedPlan): serviceAndSelectedPlan is {service: Service, selectedPlan: Plan } => serviceAndSelectedPlan.selectedPlan !== null)
    .map(({service, selectedPlan}) => service.name + " - " + selectedPlan.name)
    .join(", ");
}
