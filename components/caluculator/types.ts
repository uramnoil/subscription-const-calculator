import { Plan, Service } from "../../utils/service.ts";

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

function filterServiceAndSelectedPlans(serviceAndSelectedPlans: ServiceAndSelectablePlan[]): ServiceAndSelectedPlan[] {
  return serviceAndSelectedPlans
    .filter((serviceAndSelectedPlan): serviceAndSelectedPlan is ServiceAndSelectablePlan & {selectedPlan: Plan} => serviceAndSelectedPlan.selectedPlan !== null)
}

export type {
  ServiceAndSelectablePlan,
  ServiceAndSelectedPlan,
};

export {
  filterServiceAndSelectedPlans,
}
