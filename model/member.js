'use strict';

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('member', {
	   id: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
	   surname: {type: DataTypes.STRING,allowNull:false,defaultValue: ''},
	   fame: {type: DataTypes.STRING,allowNull:false,defaultValue: ''},
	   gender: {type: DataTypes.INTEGER,allowNull:false,defaultValue: 1},
	   cellphone: {type: DataTypes.STRING(20),allowNull:false,defaultValue: ''},
	   company: {type: DataTypes.STRING,allowNull:false,defaultValue: ''},
	   company_address: {type: DataTypes.STRING,allowNull:false},
	   email: {type: DataTypes.STRING,allowNull:false},
	   job: {type: DataTypes.STRING,allowNull:false,defaultValue: 0},
	},{
	  timestamps: false,
	  tableName: 'sz_member_new'
	});
};