/**
 * Created by Eliran on 7/29/2016.
 */
var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    upvotes: {type: Number, default: 0},
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }
});

CommentSchema.methods.upvote = function(cb){
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Comment', CommentSchema);