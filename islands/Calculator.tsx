import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { Plan, Service, allServices } from "../utils/service.ts";
import { Head } from "$fresh/src/runtime/head.ts";


export default function Calculator() {
  const serviceAndSelectablePlans = useSignal(allServiceAndSelectablePlans);
  const serviceNameQuery = useSignal<string>("");
  const servicesToShow = filterServiceByName(serviceAndSelectablePlans.value, serviceNameQuery.value);
  const servicesToShowOrderedByTag = orderedByTag(servicesToShow, "type");
  const serviceAndSelectedPlans = filterServiceAndSelectedPlans(serviceAndSelectablePlans.value)

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
        <meta name="description" content="Sum up the fees for all the subscriptions you have. Money is important!" />
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
          {Array
            .from(servicesToShowOrderedByTag.entries())
            .map(([tag, serviceAndSelectablePlans]) => (
              <section>
                <h3>{tag}</h3>
                <section>
                  {
                    serviceAndSelectablePlans.map(({service, selectedPlan}) => <>
                      <h4>{service.name}</h4>
                      <fieldset>
                        <ul>
                          <li>
                            <input
                              type={"radio"}
                              onClick={() => {
                                handleUnselectPlan(service);
                              }}
                              checked={selectedPlan === null}
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
                                checked={selectedPlan === plan}
                              />
                              <label>{plan.name} - ¥{plan.price}</label>
                            </li>
                          ))}
                        </ul>
                      </fieldset>
                    </>)
                  }
                </section>
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

function orderedByTag(services: ServiceAndSelectablePlan[], tag: string): Map<string, ServiceAndSelectablePlan[]> {
  // ServiceAndSelectablePaln[]をサービスが持っているタグでグループ化する
  const groupedByTag = new Map<string, ServiceAndSelectablePlan[]>();
  for (const serviceAndSelectablePlan of services) {
    let tagValue = serviceAndSelectablePlan.service.tags[tag];
    if (tagValue === undefined) {
      tagValue = "unknown";
    }
    const group = groupedByTag.get(tagValue) ?? [];
    groupedByTag.set(tagValue, group.concat(serviceAndSelectablePlan));
  }
  return groupedByTag;
}

type ServiceAndSelectablePlan = Readonly<{
  service: Service;
  selectedPlan?: Plan | null;
}>;

type ServiceAndSelectedPlan = Readonly<
  ServiceAndSelectablePlan
    & {
      selectedPlan: Plan;
    }
>;

type GroupedServiceAndSelectablePlans = Map<string, ServiceAndSelectablePlan[]>;

type GroupedServiceAndSelectedPlans = Map<string, ServiceAndSelectedPlan[]>;

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
