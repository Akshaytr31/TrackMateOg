export const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
}



export const addTousandsSeparator=(num)=>{
    if(num=null ||isNaN(num))return ""

    const [integerpart,fractionalPart]=num.toString().split(".")
    const formattedInteger=integerpart.replace(/\B(?=(\d{3})+(?!\d))/g,"")


    return fractionalPart
     ?`${formattedInteger}.${fractionalPart}`
     :formattedInteger;
}
