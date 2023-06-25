import Conversation from "../modals/Conversation.js"

export const newConversation = async (request, response) => {
    try {
        const { senderId, receiverId } = request.body

        const exist = await Conversation.findOne({ members: { $all: [receiverId, senderId] } })

        if (exist) {
            return response.status(200).json('conversation already exist')
        }

        const newConversation = new Conversation({
            members: [senderId, receiverId]
        })

        await newConversation.save()

        return response.status(200).json('conversation saved successfully.')

    } catch (error) {
        return response.status(500).json(error.message)
    }
}

export const getConversation = async (request, response) => {
    try {
        const { senderId, receiverId } = request.body
        const conversation= await Conversation.findOne({ members: { $all: [receiverId, senderId] } })
        return response.status(200).json(conversation)
    } catch (error) {
        return response.status(500).json(error.message)
    }
}