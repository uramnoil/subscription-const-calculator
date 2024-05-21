import { Plan, Service } from "../../utils/service.ts";
import { Service as ServiceComponent } from "./Service.tsx";
import { ServiceAndSelectablePlan } from "./types.ts";

type Props = {
  servicesToShowOrderedByTag: Map<string, ServiceAndSelectablePlan[]>;
  handlePlanSelect: (service: Service, plan: Plan | null) => void;
}

function ServicesOrderedByTag({
  servicesToShowOrderedByTag,
  handlePlanSelect,
}: Props) {
  return (
    <>
      {Array
        .from(servicesToShowOrderedByTag.entries())
        .map(([tag, serviceAndSelectablePlans]) => (
          <section>
            <h3>{tag}</h3>
            <section>
              {
                serviceAndSelectablePlans.map((serviceAndSelectablePlan) => <ServiceComponent
                  key={serviceAndSelectablePlan.service.name}
                  serviceAndSelectablePlan={serviceAndSelectablePlan}
                  onPlanSelect={handlePlanSelect}
                />)
              }
            </section>
          </section>
      ))}
    </>
  );
}

export { ServicesOrderedByTag }
