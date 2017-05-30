/**
 * Created by Eliran on 8/13/2016.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var OrderSchema = new mongoose.Schema({
    madeBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    amount: {type: Number, default: 1},
    dish: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }]
});

mongoose.model('Order', OrderSchema);