'use strict';

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('message', {
	   mid: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
	   type: {type: DataTypes.INTEGER,allowNull:false,defaultValue: 0},
	   body: {type: DataTypes.STRING(1000),allowNull:false,defaultValue: ''},
	   cid: {type: DataTypes.INTEGER,allowNull:false,references: {model: 'chatlog',key: 'cid'}},
	   is_fid: {type: DataTypes.INTEGER,allowNull:false,defaultValue: 0},
	   create_at: {type: DataTypes.DATE,allowNull:false}
	},{
	  timestamps: false,
	  tableName: 'sz_im_message'
	});
};