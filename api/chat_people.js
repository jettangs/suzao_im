const find_other_id = (chat_log,self_id) => {
	let other_id  
	if(chat_log.fid != self_id && chat_log.sid == self_id){
		other_id = chat_log.fid
	}else if(chat_log.sid != self_id && chat_log.fid == self_id){
		other_id = chat_log.sid
	}
	return other_id
}

const check_user_online = (online_user,uid) => {

	for(let i = 0; i < online_user.length; i++){
		for(let j in online_user[i]){
			if(j ==  uid){
				return true
			}
		}
	}
	return false
}

const check_user_exchanged = (Card,uid,self_id) => {
	let count
	(async ()=> {
		count = await Card.count({
			where:{
				member_id:{
					$or:[uid,self_id]
				},
				company_id:{
					$or:[uid,self_id]
				}
			}
		})
	})()
	return count > 0
}

exports.chat_people = async(Member,Chatlog,Card,online_user,self_id) => {
	let res = {
		code:0,
		info:'',
		data:[]
	}

	let chat_log = await Chatlog.findAll({
		where:{
			$or:[
				{fid:self_id},
				{sid:self_id}
			]
		}
	})

	if(chat_log.length==0){
		res.code = 10001,
		res.info = 'Error: not found.'
	}else{
		res.code = 10000,
		res.info = `Success: ${chat_log.length} results was found`

		for(let i = 0; i < chat_log.length; i++){
			let uid = find_other_id(chat_log[i],self_id)
			let user = await Member.find({
				where:{
					id:uid
				}
			})
			let people = {}
			people['uid'] = uid
			people['name'] = user.surname+user.fame
			people['gender'] = user.gender
			people['cellphone'] = user.cellphone
			people['online'] = check_user_online(online_user,uid)
			people['exchanged'] = check_user_exchanged(Card,uid)
			people['company'] = user.company
			// people['department']  = user.department
			// people['position'] = user.position
			// people['fax'] = user.fax
			//people['email'] = user.email
			res.data.push(people)
		}
	}
	return res
}