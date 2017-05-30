/**
 * Created by Eliran on 7/30/2016.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String,
    cookRole: {type: Boolean, default: false},
    fullName: String,
    email: String,
    address: String,
    birthDate: Date,
    genre: String,
    distributionArea: [String],
    picUrl: String,
    about: String,
    cooksDishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dishes' }],
    bestDish: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dishes' }],
    shoppingCart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dishes' }],
    pendingDishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }]
});


// UserSchema.methods.addDish = function (dish) {
//     // this.cooksDishes.push({dish: dish});
// };


UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};

UserSchema.method.isCook = function () {
    if(this.cookRole === true){return true}
    else{return false}
};

UserSchema.method.isAdmin = function () {
    if(this.role === 'admin'){return true}
    else{return false}
};

UserSchema.methods.generateJWT = function() {

    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, 'SECRET');
};

mongoose.model('User', UserSchema);