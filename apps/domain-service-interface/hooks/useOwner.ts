import { useQuery } from "react-query";
import useDomainContract from "./useDomainContract";

// Hook that returns the owner of a given domain
// Returns an array of objects with the following properties:
//   - owner: the owner of the domain

export const useOwner = (name: string) => {
  const contract = useDomainContract();
  return useQuery(["owner", { name, chainId: contract.chainId }], () =>
    contract.owner(name)
  );
}
