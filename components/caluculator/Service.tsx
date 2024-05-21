import { Plan, Service } from "../../utils/service.ts";
import { ServiceAndSelectablePlan } from "./types.ts";

type Props = {
  serviceAndSelectablePlan: ServiceAndSelectablePlan;
  onPlanSelect: (service: Service, plan: Plan | null) => void;
}

function ServiceComponent({
  serviceAndSelectablePlan: {
    service,
    selectedPlan
  },
  onPlanSelect,
}: Props) {
  return (<>
    <h4>{service.name}</h4>
    <fieldset>
      <ul>
        <li>
          <input
            type={"radio"}
            onClick={() => {
              onPlanSelect(service, null);
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
                onPlanSelect(service, plan);
              }}
              checked={selectedPlan === plan}
            />
            <label>{plan.name} - ¥{plan.price}</label>
          </li>
        ))}
      </ul>
    </fieldset>
  </>);
}

export { ServiceComponent as Service }
