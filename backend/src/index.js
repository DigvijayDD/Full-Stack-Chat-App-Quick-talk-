import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connectDB} from "./lib/db.js";
import path from "path";


import authRoutes from "./route/auth.route.js";
import messageRoutes from "./route/message.route.js";
import {app,server} from "./lib/socket.js";

dotenv.config()

app.use(cookieParser());


app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
)

const PORT = process.env.PORT ;
const _dirname = path.resolve();

console.log("Express JSON Middleware Initialized");
app.use((req, res, next) => {
    console.log("Request Body before express.json:", req.body);
    next();
});

// app.use(express.json());
app.use(express.json({ limit: "50mb" })); // JSON payload limit
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname, "../frontend/dist/index.html"));
    });
}
server.listen(PORT,()=>{
console.log("Server is running on port:" + PORT);
connectDB(); 
});