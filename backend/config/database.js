import mongoose from "mongoose"

const connetDB = async () => {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("MongoDB Connected");
    }).catch(err => console.log(err));
}

export default connetDB;