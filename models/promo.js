const mongoose =require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency =mongoose.Types.Currency;
const Schema =mongoose.Schema;
const promoSchema =new Schema({
	name :{
		type :String ,
		required:true,
		unique :true
	},
	description :{
		type :String,
		required :true
	},
	image:{
		type:String,
		required:true
	},
	label:{
		type:String,
		default :''
	},
	featured:{
		type:Boolean,
		default: false
	},
	price:{
		type :Currency,
		required:true,
		min:1,
		max :30000
	}
	},{
	timestamps :true         
});

var promo =mongoose.model('Promotion', promoSchema);
module.exports =promo;
