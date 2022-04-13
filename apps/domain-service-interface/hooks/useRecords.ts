import { useQuery } from "react-query";
import useDomainContract from "./useDomainContract";

// Hook that returns the record  of a given domain
// Returns an array of objects with the following properties:
//   - record: the record of the domain

export const useRecords = (name:string) => {
  const contract = useDomainContract();
  return useQuery(["records", { name, chainId: contract.chainId }], () =>
    contract.getRecord(name)
  );
}