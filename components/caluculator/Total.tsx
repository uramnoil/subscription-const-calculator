import { ServiceAndSelectedPlan } from "./types.ts";

type Props = {
  serviceAndSelectedPlans: ServiceAndSelectedPlan[];
};

function Total({ serviceAndSelectedPlans }: Props) {
  return (
    <>
      <h2>Sum</h2>
      <span>Total: ¥{sum(serviceAndSelectedPlans)}</span>
      {serviceAndSelectedPlans.length >= 1 && (
      <span>({joinSelectedPlans(serviceAndSelectedPlans)})</span>
      )}
    </>
  );
}

function sum(serviceAndSelectedPlan: ServiceAndSelectedPlan[]): number {
  return serviceAndSelectedPlan.reduce((acc, {selectedPlan}) => acc + selectedPlan.price, 0);
}

function joinSelectedPlans(serviceAndSelectedPlans: ServiceAndSelectedPlan[]): string {
  return serviceAndSelectedPlans
    .map(({service, selectedPlan}) => service.name + " - " + selectedPlan.name)
    .join(", ");
}

export { Total }
