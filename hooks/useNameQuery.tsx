import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { JSX } from "preact/jsx-runtime";

function useNameQuery(): [string, JSX.Element] {
  const serviceNameQuery = useSignal<string>("");

  return [
    serviceNameQuery.value,
    <input
      type="text"
      placeholder="filter searvice name"
      value={serviceNameQuery.value}
      onInput={(e) => serviceNameQuery.value = e.currentTarget.value}
    />
  ];
}

export { useNameQuery };
