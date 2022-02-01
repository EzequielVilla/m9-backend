interface Timestamp{
    _seconds:number,
    _nanoseconds:number,
}

interface upgradeData{
    email?:string,
    address?:string,
    other?:{
        any?:any
    }
}

//for last class interface

interface orderData{
    additionalInfo?:any,
    userId: string,
    title:string,
    unit_price:number,
    status:boolean,
    productId:string
    
}