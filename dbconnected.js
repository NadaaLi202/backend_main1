import mongoose, { connect } from 'mongoose';//{ MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();


const uri = "mongodb+srv://student:YKCnYCrnLjYqscid48941we@e-learning-platform.c0v9p.mongodb.net/?retryWrites=true&w=majority&appName=e-learning-platform"
// process.env.MONGODB_URI 

export const dbConnect =()=>{
    mongoose.connect(
    uri//  { useNewUrlParser: true }//options
  )
  .then(()=>console.log('connected'))
  .catch(e=>console.log(e));}
// import mongoose from 'mongoose'

// import fs from 'fs'
// export const dbConntect = async () => {
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/testMearn'
//             //{
//            //useNewUrlParser: true,
//           // useUnifiedTopology: true,
//           // ssl: true,
//            //sslValidate: false // Disable SSL validation (accept self-signed certificates)
//        //}
//     );
//         console.log('DB connected');
//     } catch (err) {
//         console.error('DB connection error:', err.message);
//     }
// };