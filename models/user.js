var mongoose =require('mongoose');
var Schema =mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    admin:   {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose); //this we automatically adding support for username and hashes storage of the password using the halt and salt and adding additional methods on the userSchema
module.exports =mongoose.model('User', User);


