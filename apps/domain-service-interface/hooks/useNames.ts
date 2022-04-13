import useDomainContract from "./useDomainContract";
import { useQuery } from "react-query";

// Hook that returns the names of the domain services
// Returns a list of names
export function useNames() {
  const contract = useDomainContract();
  return useQuery(["names", { chainId: contract.chainId }], () =>
    contract.getAllNames()
  );
}