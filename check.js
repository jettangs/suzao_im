let res = {
	code:10000,
	info:'Success: receive and transmit your message.'
}

const private_chat = message => {
	if(message.type != 1 && message.type != 2 && message.type != 3){
		res.code = 10002
		res.info = 'Error: parameter "type" is invalid '
	}
	if(!message.rid){
		res.code = 10002
		res.info = 'Error: parameter "rid" is null '
	}
	return res
}

const check = (event,message) => {
	switch(event){
		case 'private_chat':
			return private_chat(message)
	}
	
}

module.exports = {check:check}