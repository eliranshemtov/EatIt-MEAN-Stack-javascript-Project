/**
 * Created by Eliran on 8/9/2016.
 */
var mongoose = require('mongoose');

var DishSchema = new mongoose.Schema({
    owner: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    name: String,
    genre: String,
    course: String,
    price: {type: Number, default: 0},
    specialingredients: [String],
    specialCheck: Boolean,
    startDate: Date,
    endDate: Date,
    diners: {type: Number, default: 1, max: 6},
    dishSize: {type: Number, default: 1, max: 6},
    instructions: String,
    storage: String,
    description: String,
    imgUrl: String,
    city: [String],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    upvotes: {type: Number, default: 0}
});

DishSchema.methods.upvote = function(cb){
    this.upvotes += 1;
    this.save(cd);
};

mongoose.model('Dish', DishSchema);