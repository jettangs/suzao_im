exports.my_profile = async(Member,id) => {
	let _my_profile = await Member.findOne({
		where:{
			id:id
		}
	})
	let profile = JSON.parse(JSON.stringify(_my_profile))
	profile['name'] = profile.surname + profile.fame
	profile['uid'] = profile.id
	delete profile.id
	delete profile.surname
	delete profile.fame
	return profile
}