import express from 'express'
import { getConversation, newConversation } from '../controller/conversationController.js'
import { getImage, uploadImage } from '../controller/imageController.js'
import { getMessages, newMessage } from '../controller/messageController.js'
import { addUser, getUsers } from '../controller/userController.js'
import upload from '../utils/upload.js'
const route = express.Router()


route.post('/add', addUser)
route.get('/users', getUsers)

route.post('/conversation/add', newConversation)
route.post('/conversation/get', getConversation)

route.post('/message/add', newMessage)
route.get('/message/get/:id', getMessages)

route.post('/file/upload', upload.single('file'), uploadImage)
route.get('/file/:filename', getImage)

export default route