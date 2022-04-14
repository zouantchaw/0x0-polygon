import { useOwner } from "../hooks/useOwner";
import { useRecords } from "../hooks/useRecords";


// takes in an array of names an returns an array of objects with the following properties:
//  - id: the id of the domain
//   - name: the name of the domain
//   - record: the record of the domain
//   - owner: the owner of the domain

export const createRecords = async (names: string[]) => {
  const records = await Promise.all(names.map(async (name) => {
    const record = await useRecords(name);
    const owner = await useOwner(name);
    return {
      id: name,
      name,
      record,
      owner,
    };
  }));
  return records;
};
