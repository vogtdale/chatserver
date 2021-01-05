const express = require("express")
const socketio = require("socket.io")
const http = require("http")
const router = require("./router")
const cors = require("cors")
const {addUser, removeUser, getUser, getUserInRoom} = require("./users.js")

const app = express()
const server = http.createServer(app)

const port = process.env.PORT || 5000

const io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

app.use(router)
app.use(cors())

io.on("connection", (socket) => {

    socket.on("join", ({name, room}, callback) => {
        const {error, user} = addUser({id: socket.id, name, room}) 
        
        if (error) return callback(error)

        
        socket.emit("message", {user: " admin", text: `${user.name}, welcome to room #${user.room} `})
        
        //broadcast a message to everyone except the user himself
        socket.broadcast.to(user.room).emit('message', {user: "admin", text: `${user.name}, has joined the chat room`})
        
        //if there are no errors 
        socket.join(user.room)

        io.to(user.room).emit("roomData", {room: user.room, users: getUserInRoom(user.room)})

        callback()
    })

    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit("message", {user: user.name, text: message})
        io.to(user.room).emit("roomData", {room: user.room, users: getUserInRoom(user.room)})

        callback()
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)

        if(user) {
            io.to(user.room).emit('message', {user: "admin", text: `${user.name} has left the room`})
        }
    })
})

server.listen(port, function() {
    console.log(`Server has started on port ${port}`)
})