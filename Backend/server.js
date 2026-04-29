const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
const cookieParser=require("cookie-parser");

dotenv.config();
const app=express();



const allowedOrigins = (process.env.CLIENT_URLS || "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB Connected");
}).catch((err)=>{
    console.log(err);
})

const authRoutes=require("./routes/auth");
const userRoutes=require("./routes/user");
const instituteRoutes=require("./routes/institute");
const departmentRoutes=require("./routes/department");
const eventRoutes=require("./routes/event");
const groupRoutes=require("./routes/group");
const particpantRoutes=require("./routes/participant")
const eventWiseWinnerRoutes=require("./routes/eventWiseWinners");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/institute", instituteRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/participants", particpantRoutes);
app.use("/api/winners", eventWiseWinnerRoutes);

app.listen(process.env.PORT, ()=>{
    console.log(`Server at port number ${process.env.PORT}`);
})