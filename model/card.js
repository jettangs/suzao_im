'use strict';

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('card', {
	   member_id:{type: DataTypes.INTEGER,allowNull:false,references:{model:'member',key:'mebid'}},
	   company_id:{type: DataTypes.INTEGER,allowNull:false,references:{model:'mfrs',key:'mid'}},
	},{
	  timestamps: false,
	  tableName: 'sz_im_card'
	});
};