const express = require('express')
let app = express()


app.get('/Get',(req,res)=>{
    console.log()
    return res.status(200).json({message:`ping at barnbas ${new Date()}`})
})

app.listen(3500,()=>{
    console.log(`server is running on ${3500}`)
})