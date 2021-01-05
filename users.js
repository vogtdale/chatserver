const users = []

const addUser = ({id, name, room}) => {
    //if user enters room 
    name = name
    room = room

    //check for existing users
    const userExist = users.find((user) => user.room === room && user.name === name)
    if (userExist) {
        return {error: "Username is already taken"}
    }

    const user = {id, name, room}
    users.push(user) //push user to users array
    
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== - 1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => users.find(( user) => user.id === id)


const getUserInRoom = (room) => users.filter((user) => user.room === room)

module.exports = {addUser,removeUser, getUser, getUserInRoom}