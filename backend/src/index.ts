import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router'
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm"
import "reflect-metadata"

const app = express();

app.use(cors({
    origin:"http://localhost:3000",
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app)

server.listen(3001, ()=>{
    console.log("server running on http://localhost:3001")
})

const MONGODB_URI = 'mongodb+srv://rojwilli:8Rosemont@cluster0.mit0tdn.mongodb.net/?retryWrites=true&w=majority'  || 'mongodb://127.0.0.1:27017/scrum_mate'

mongoose.Promise = Promise
mongoose.connect(MONGODB_URI)
mongoose.connection.on('error',(error:Error)=>{
    console.log(error)
})

app.use('/',router())