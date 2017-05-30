var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');
var Dish = mongoose.model('Dish');
var Order = mongoose.model('Order');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var http = require('http');

router.get('/users', function (req, res, next) {
  User.find(function(err, users){
    if(err){
      return next(err);
    }
    res.json(users);
  });
});

router.get('/posts', function (req, res, next) {
  Post.find(function(err, posts){
    if(err){
      return next(err);
    }
    res.json(posts);
  });
});

router.get('/dishes', function (req, res, next) {
  Dish.find(function(err, dishes){
    if(err){
      return next(err);
    }
    res.json(dishes);
  });
});


router.get('/groupByGenre', function (req, res) {
    User.aggregate({
        $group: {
            _id: '$genre',
             count: {$sum: 1}
        }
    }, function (err, result) {
        if(err){
            next(err);
        } else{
            res.json(result);
        };
    });
});


router.param('userId', function (req, res, next, id) {
    var query = Dish.find({owner: { $in: [id]}});

    query.exec(function(err, dishes){
        if(err){
            return next(err);
        }
        if(!dishes){
            return next(new Error('User has no dishes'))
        }
        req.dishes = dishes;
        return next();
    });
});


router.param('user', function (req, res, next, id) {
  var query = User.findById(id);

  query.exec(function (err, user) {
    if(err){
      return next(err);
    }
    if(!user){
      return next(new Error('can\'t find user'));
    }
    req.user = user;
    return next();
  });
});


router.param('dish', function (req, res, next, id) {
  var query = Dish.findById(id);

  query.exec(function (err, dish) {
    if(err){
      return next(err);
    }
    if(!dish){
      return next(new Error('can\'t find dish'));
    }
    req.dish = dish;
    return next();
  });
});




router.param('post', function (req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post) {
    if(err){
      return next(err);
    }
    if(!post){
      return next(new Error('can\'t find post'));
    }
    req.post = post;
    return next();
  });
});



router.param('comment', function(req, res, next, id){
  var query = Comment.findById(id);

  query.exec(function (err, comment) {
    if(err){
      return next(err);
    }
    if(!comment){
      return next(new Error('can\'t find comment'));
    }
    req.comment = comment;
    return next();
  });
});

router.get('/profile/:user', function (req, res) {
  // req.post.populate('comments', function (err, post) {
  //   if(err){
  //     return next(err);
  //   }
  res.json(req.user);
});
// });


router.get('/myDishes/:userId', function (req, res) {
    res.json(req.dishes);
});

router.get('/orders/:userIdForOrders', function (req, res) {
    var query = Order.find({madeBy: { $in: [req.params.userIdForOrders]}}).populate({
        path: 'dish'
    });


    query.exec(function (err, orders) {
        if(err){
            return next(err);
        }
        if(!orders){
            return next(new Error('User Has no orders'))
        }

        res.orders = orders;
        res.json(res.orders);
    })
});

router.delete('/deleteOrder/:orderId', function (req, res) {
    Order.findById(req.params.orderId).remove(function () {
        console.log("GOT INSIDE AND DONE!");

    });
    res.json("done");
    // next();
});

router.post('/updateOrder/:updateOrderId/:newAmount', function (req, res) {
    Order.update({_id: req.body.updateOrderId}, {
        amount: req.body.newAmount
    }, function (err, affected, resp) {

    });
    res.json("Updated");
});

/*
 var query = Dish.find({owner: { $in: [id]}});

 query.exec(function(err, dishes){
 if(err){
 return next(err);
 }
 if(!dishes){
 return next(new Error('User has no dishes'))
 }
 req.dishes = dishes;
 return next();
 });

 */

router.get('/dishInfo/:dish', function (req, res) {
  req.dish.populate('comments', function (err, dish) {
    if(err){
      return next(err);
    }
    res.json(req.dish);
  });
});



router.post('/dishesSearch/:searchGenre/:searchCity/:price/:courseType', function (req, res) {
   var query = {};
    if(req.body.param1 != null){
        query.genre =req.body.param1;
    }
    if(req.body.param2 != null){
        query.city = {$in: [req.body.param2]};
    }
    if(req.body.param3 != null){
        query.price = req.body.param3;
    }
    if(req.body.param4 != null){
        query.course =req.body.param4;
    }

    Dish.find(query).exec(function (err, docs) {
        res.json(docs);
    });
});


router.post('/chefs/:genre/:city/:dishesAmount', function (req, res) {
    var query;
    if (req.body.param1 && req.body.param2){
        query = {
            genre : req.body.param1,
            distributionArea: {$in: [req.body.param2]}
        }
    }
    else if  (req.body.param1){
        query = {
            genre : req.body.param1,
            // distributionArea: {$in: [req.body.param2]}
        }
    }
    else if  (req.body.param2){
        query = {
            // genre : req.body.param1,
            distributionArea: {$in: [req.body.param2]}
        }
    }

    User.find(query).exec(function (err, docs) {
        var doc;

        if(req.body.param3){
            for(doc in docs){
                if(docs[doc].cooksDishes.length != req.body.param3){
                    delete docs[doc];
                }
            }
        }
        res.json(docs);
    });
});

router.post('/makeOrder/:dishId/:amount/:ownerId/:loggedInUserId', function (req, res) {
    var order = new Order();
    order.madeBy = req.body.loggedInUserId;
    order.amount = req.body.amount;
    order.dish = req.body.dishId;
    User.findById(req.body.ownerId).exec(function (err, doc) {
        doc.pendingDishes.push(order._id);
        doc.save();
    });
    User.findById(req.body.loggedInUserId).exec(function (err, doc) {
        doc.shoppingCart.push(order.dish);
        doc.save();
    });
    order.save();

    res.json(order);
});


router.get('/posts/:post', function (req, res) {
  req.post.populate('comments', function (err, post) {
    if(err){
      return next(err);
    }
    res.json(req.post);
  });
});

router.put('/posts/:post/upvote', auth, function (req, res, next) {
  req.post.upvote(function (err, post) {
    if(err){
      return next(err);
    }
    res.json(post);
  });
});



router.post('/dishes/:dish/comments', auth, function (req, res, next) {
  var comment = new Comment(req.body);
  comment.dish = req.dish;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){
      return next(err);
    }
    req.dish.comments.push(comment);
    req.dish.save(function (err, post) {
      if(err){
        return next(err);
      }
      res.json(comment);
    });
  });
});


router.post('/posts/:post/comments', auth, function (req, res, next) {
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err, comment){
    if(err){
      return next(err);
    }
    req.post.comments.push(comment);
    req.post.save(function (err, post) {
      if(err){
        return next(err);
      }
      res.json(comment);
    });
  });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function (req, res, next) {
  req.comment.upvote(function (err, comment) {
    if(err){
      return next(err);
    }
    res.json(comment);
  });
});





router.post('/dishes', auth, function (req, res, next) {
    // Create the new Dish instance
    var dish = new Dish();
  dish.owner              = req.payload._id;
  dish.name               = req.body.name;
  dish.genre              = req.body.genre;
  dish.course             = req.body.course;
  dish.price              = req.body.price;
  dish.specialingredients = req.body.specialingredients;
  dish.specialCheck       = req.body.specialCheck;
  dish.startDate          = req.body.startDate;
  dish.endDate            = req.body.endDate;
  dish.diners             = req.body.diners;
  dish.dishSize           = req.body.dishSize;
  dish.instructions       = req.body.instructions;
  dish.storage            = req.body.storage;
  dish.imgUrl             = req.body.imgUrl;
  dish.city               = req.body.city;


// Update the user object (DB) with the new dish (into cooksDishes array)
    User.findById(dish.owner).exec(function (err, doc) {
        doc.cooksDishes.push(dish._id);
        doc.save();
    });

    // Save the dish and return result
  dish.save(function (err, dish) {
    if(err){
      return next(err);
    }
    res.json(dish);
  });
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;
  user.fullName = req.body.fullName;
  user.email = req.body.email;
  user.address = req.body.address;
  user.picUrl = req.body.picUrl;
  user.birthDate = req.body.birthDate;
  user.cookRole = req.body.cookRole;
  user.role = req.body.role;
  user.about = req.body.about;
  user.distributionArea = req.body.distributionArea;
  user.genre = req.body.genre;

  user.setPassword(req.body.password);

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});


router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});


/* GET home page. */
router.get('/', function(req, res ) {
  res.render('index');
});

/* GET Cook home page. */
router.get('/cook', function(req, res) {
  res.render('index-cook');
});

/* GET diner home page. */
router.get('/diner', function(req, res) {
    res.render('index-diner');
});

/* GET admin home page. */
router.get('/admin', function(req, res) {
    res.render('index-admin');
});




module.exports = router;
