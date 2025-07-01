import mongoose from "mongoose";
console.log(process.env.MONGO_URI);

// Connects to MongoDB using Mongoose
function connect(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to Databse");
        
    })
    .catch(err=>{
        console.log(err);
        
    })
}

export default connect;