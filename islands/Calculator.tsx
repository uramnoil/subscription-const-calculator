import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { Plan, Service, allServices } from "../utils/service.ts";
import { Head } from "$fresh/src/runtime/head.ts";
import { ServiceAndSelectablePlan, filterServiceAndSelectedPlans } from "../components/caluculator/types.ts";
import { Total } from "../components/caluculator/Total.tsx";
import { ServicesOrderedByTag } from "../components/caluculator/ServicesOrderedByTag.tsx";
import { useNameQuery } from "../hooks/useNameQuery.tsx";


export default function Calculator() {
  const serviceAndSelectablePlans = useSignal(allServiceAndSelectablePlans);
  const [serviceNameQuery, ServiceNameQueryInput] = useNameQuery();
  const servicesToShow = filterServiceByName(serviceAndSelectablePlans.value, serviceNameQuery);
  const servicesToShowOrderedByTag = orderedByTag(servicesToShow, "type");
  const serviceAndSelectedPlans = filterServiceAndSelectedPlans(serviceAndSelectablePlans.value)

  const handlePlanSelect = (service: Service, plan: Plan | null) => {
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

  return (
    <div>
      <Head>
        <title>SCC - Subscription Cost Calculator</title>
        <meta name="description" content="Sum up the fees for all the subscriptions you have. Money is important!" />
      </Head>
      <main>
        <h1>Subscription Cost Calculator</h1>
        { ServiceNameQueryInput }
        <section>
          <h2>Services</h2>
          <section>
            <ServicesOrderedByTag
              servicesToShowOrderedByTag={servicesToShowOrderedByTag}
              handlePlanSelect={handlePlanSelect}
            />
          </section>
        </section>
        <section>
          <Total serviceAndSelectedPlans={serviceAndSelectedPlans} />
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

function filterServiceByName(
  serviceAndSelectedPlans: ServiceAndSelectablePlan[],
  query: string
): ServiceAndSelectablePlan[] {
  const queryLowerCase = query.toLowerCase();
  return serviceAndSelectedPlans.filter((serviceAndSelectedPlan) =>
    serviceAndSelectedPlan.service.name.toLowerCase().includes(queryLowerCase)
  );
}
