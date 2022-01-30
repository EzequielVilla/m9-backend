import test from "ava";
import { decode, generate } from "./jwt";


test("message sended", async (t)=>{
    const payload = {eze:true};
    const token = generate(payload);
    const salida = decode(token);
    delete salida.iat;
    t.deepEqual(payload,salida)
})