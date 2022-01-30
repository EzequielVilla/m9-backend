import Airtable from "airtable"
export const airtablebase = new Airtable({apiKey:process.env.AIRTABLE_KEY}).base(process.env.AIRTABLE_BASE)
