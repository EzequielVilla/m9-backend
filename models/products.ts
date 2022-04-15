import { productsIndex } from "db/algolia";

export async function getResultsFromQuery(
  query: string,
  limit: number,
  offset: number
): Promise<any> {
  const results = await productsIndex.search(query, {
    length: limit,
    offset,
  });
  return results;
}

export async function searchById(id: string) {
  const result = await productsIndex.getObject(id);
  return result;
}

export async function getAllProductsFromDB(): Promise<any> {
  return await productsIndex.search("");
}
