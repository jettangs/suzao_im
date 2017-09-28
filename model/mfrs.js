'use strict';

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('mfrs', {
	   mid: {type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true},
	   mfrslogo: {type: DataTypes.STRING,allowNull:false,defaultValue: ''},
	   companyname: {type: DataTypes.STRING,allowNull:false,defaultValue: ''}
	   encompanyname: {type: DataTypes.STRING,allowNull:false,defaultValue: ''},
	   tel_2: {type: DataTypes.STRING,allowNull:false,defaultValue: ''},
	   fax_2: {type: DataTypes.STRING,allowNull:false,defaultValue: ''},
	   email: {type: DataTypes.STRING,allowNull:false,defaultValue: ''},
	   website: {type: DataTypes.STRING,allowNull:false,defaultValue: ''},
	   company_full_address: {type: DataTypes.STRING,allowNull:false,defaultValue: ''},
	},{
	  timestamps: false,
	  tableName: 'sz_mfrs'
	});
};