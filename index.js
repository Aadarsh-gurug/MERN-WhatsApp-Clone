import express from "express";
import cors from 'cors'
import Connection from "./config/db.js";
import Route from './routes/route.js'
import http from 'http'
import path from "path";
import { Server } from "socket.io";
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = process.env.PORT || 8000;
app.use(cors())
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use('/', Route)
app.use(express.static('client/build'))
Connection()

let users = [];

const addUser = (userData, socketId) => {
    !users?.some(user => user?.sub === userData?.sub) && users?.push({ ...userData, socketId });
}

const removeUser = (socketId) => {
    users = users?.filter(user => user?.socketId !== socketId);
}

const getUser = (userId) => {
    return users?.find(user => user?.sub === userId);
}

io.on('connection', (socket) => {

    //connect
    socket?.on("addUser", userData => {
        addUser(userData, socket?.id);
        io.emit("getUsers", users);
    })

    //send message
    socket?.on('sendMessage', (data) => {
        const user = getUser(data?.receiverId);
        io.to(user?.socketId).emit('getMessage', data)
    })

    //disconnect
    socket?.on('disconnect', () => {
        removeUser(socket?.id);
        io.emit('getUsers', users);
    })
})

app.get('/*', (req, res) => {
    res.sendFile(path.resolve('client/build/index.html'))
})

server.listen(port, () => { console.log(`server is running on port ${port}`) })