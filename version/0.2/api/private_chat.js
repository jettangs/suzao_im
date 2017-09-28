let res = {
	code:0,
	info:''
}

const validate = message => {
	if(message.type > 2){
		res.code = 10002
		res.info = 'Error: parameter "type" is invalid '
	}
	if(message.mid.length != 14){
		res.code = 10002
		res.info = 'Error: parameter "mid" is invalid '
	}
	if(message.uid.length != 14){
		res.code = 10002
		res.info = 'Error: parameter "uid" is invalid '
	}
	if(message.ack != 0 && message.ack != 1){
		res.code = 10002
		res.info = 'Error: parameter "ack" is invalid '
	}
}

exports.private_chat = (User,Chatlog,Card,Message,online_user,session_user,message) => {
	validate(message)
	if(res.code == 10002){
		return res
	}
	res.code = 10000
	res.info = 'Success: receive and transmit your message.'
	return res
}