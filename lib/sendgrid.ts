import * as SendGrid from "@sendgrid/mail"


export async function sendCodeEmail(email:string,code:number):Promise<boolean>{
    SendGrid.setApiKey(process.env.SENDGRID_KEY);
    const msg = {
        to: email,
        from: "ezequiel.n.villa@gmail.com",
        subject: "Codigo de ingreso",
        text: ` `,
        html: `Tu codigo de acceso es: ${code}`
    };
    
    try {
        await SendGrid.send(msg);
        return true  
        
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body)
            return false 
        }
    }
}

export async function sendBuyerEmail(email:string){
    SendGrid.setApiKey(process.env.SENDGRID_KEY);
    const msg = {
        to: email,
        from: "ezequiel.n.villa@gmail.com",
        subject: "Compra efectuada",
        text: ` `,
        html: `Se efectuo el pago. Estan preparando tu pedido`
    };
    
    try {
        await SendGrid.send(msg);
        return true  
        
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body)
            return false 
        }
    }
}

export async function sendSellerEmail(email:string,itemSelled){
    SendGrid.setApiKey(process.env.SENDGRID_KEY);
    const msg = {
        to: email,
        from: "ezequiel.n.villa@gmail.com",
        subject: "Se realizo una venta",
        text: ` `,
        html: `Se efectuo una venta de ${itemSelled.quantity} ${itemSelled.title} `
    };
    
    try {
        await SendGrid.send(msg);
        return true  
        
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body)
            return false 
        }
    }
}