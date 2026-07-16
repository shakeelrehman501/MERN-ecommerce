
import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import { User } from "./models/userModel.js";
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)



// app.get('/', (req, res)=>{
//   console.log(User);
//   res.send("Welcome")
//   res.end()

// })

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening at port: ${PORT}`);
});

