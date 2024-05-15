import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { Plan, Service, allServices } from "../utils/service.ts";
import { Head } from "$fresh/src/runtime/head.ts";


export default function Calculator() {
  const serviceAndSelectablePlans = useSignal(allServiceAndSelectablePlans);
  const serviceNameQuery = useSignal<string>("");
  const serviceAndSelectedPlans = filterServiceAndSelectedPlans(serviceAndSelectablePlans.value);
  const servicesToShow = filterServiceByName(serviceAndSelectablePlans.value, serviceNameQuery.value)

  const handlePlanSelect = (service: Service, plan: Plan) => {
    serviceAndSelectablePlans.value = serviceAndSelectablePlans.value.map((serviceAndSelectedPlan) => {
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
    serviceAndSelectablePlans.value = serviceAndSelectablePlans.value.map((serviceAndSelectedPlan) => {
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
          {servicesToShow.map((serviceAndSelectedPlan) => (
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
          <span>Total: ¥{sum(serviceAndSelectedPlans)}</span>
          {serviceAndSelectedPlans.length >= 1 && (
            <span>({joinSelectedPlans(serviceAndSelectedPlans)})</span>
          )}
        </section>
      </main>
    </div>
  );
}

const allServiceAndSelectablePlans = allServices.map((service) => {
  return {
    service,
    selectedPlan: null
  } as const as ServiceAndSelectablePlan;
});

type ServiceAndSelectablePlan = Readonly<{
  service: Service;
  selectedPlan?: Plan | null;
}>;

type ServiceAndSelectedPlan = Readonly<{
  service: Service;
  selectedPlan: Plan;
}>;

function filterServiceByName(
  serviceAndSelectedPlans: ServiceAndSelectablePlan[],
  query: string
): ServiceAndSelectablePlan[] {
  const queryLowerCase = query.toLowerCase();
  return serviceAndSelectedPlans.filter((serviceAndSelectedPlan) =>
    serviceAndSelectedPlan.service.name.toLowerCase().includes(queryLowerCase)
  );
}

function filterServiceAndSelectedPlans(serviceAndSelectedPlans: ServiceAndSelectablePlan[]): ServiceAndSelectedPlan[] {
  return serviceAndSelectedPlans
    .filter((serviceAndSelectedPlan): serviceAndSelectedPlan is ServiceAndSelectablePlan & {selectedPlan: Plan} => serviceAndSelectedPlan.selectedPlan !== null)
}

function sum(serviceAndSelectedPlan: ServiceAndSelectedPlan[]): number {
  return serviceAndSelectedPlan.reduce((acc, {selectedPlan}) => acc + selectedPlan.price, 0);
}

function joinSelectedPlans(serviceAndSelectedPlans: ServiceAndSelectedPlan[]): string {
  return serviceAndSelectedPlans
    .map(({service, selectedPlan}) => service.name + " - " + selectedPlan.name)
    .join(", ");
}
