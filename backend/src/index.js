import express from "express"
const app = express();
app.use(express.json())

app.get("",(req,res)=>{
    res.json({
        message:"backend is running"
    })
})


app.listen(3000,()=>{
    console.log("backend is running on port 3000")
})