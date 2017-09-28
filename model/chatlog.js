module.exports = (sequelize, DataTypes) => {
	return sequelize.define('chatlog', {
	   cid: {type: DataTypes.BIGINT, primaryKey: true,autoIncrement: true},
	   fid:{type: DataTypes.INTEGER,allowNull:false,references:{model:'member',key:'id'}},
	   sid:{type: DataTypes.INTEGER,allowNull:false,references:{model:'member',key:'id'}},
	   unread:{type: DataTypes.INTEGER,allowNull:false,defaultValue: 0},
	},{
	  timestamps: false,
	  tableName: 'sz_im_chatlog'
	});
};