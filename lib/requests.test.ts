import test from "ava";
import { getOffsetAndLimitFromReq } from "./requests";


test("offset and limit more than max", async(t)=>{
    const result = getOffsetAndLimitFromReq({query:{limit:200,offset:2000000}} as any)
    const expected = {limit:100, offset:0}
    
    t.deepEqual(result,expected)
})
test("offset and limit less than max", async(t)=>{
    const result = getOffsetAndLimitFromReq({query:{limit:10,offset:10}} as any)
    const expected = {limit:10, offset:10}
    
    t.deepEqual(result,expected)
})

test("no offset and no limit", async(t)=>{
    const result = getOffsetAndLimitFromReq({query:{}} as any)
    const expected = {limit:0, offset:0}
    
    t.deepEqual(result,expected)
})