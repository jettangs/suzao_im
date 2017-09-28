exports.private_chat = async (Message,Chatlog,message) => {
	delete message.mid
	let chatlog = await Chatlog.findOne({
		where:{
			fid:{
				$in: [message.sid, message.rid]
			},
			sid:{
				$in: [message.sid, message.rid]
			}
		}
	})
	if(!chatlog){
		chatlog = await Chatlog.create({
			fid:message.sid,
			sid:message.rid,
			unread:0
		})
	}
	message['cid'] = chatlog.cid
	message['create_at'] = message.time
	message['is_fid'] = chatlog.fid == message.sid? 1 : 0
	await Message.create(message)
	return chatlog
}
