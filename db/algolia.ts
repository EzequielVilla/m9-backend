import algoliasearch from "algoliasearch"


const client = algoliasearch(process.env.ALGOLIA_ID,process.env.ALGOLIA_API)
export const productsIndex = client.initIndex("products")