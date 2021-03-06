var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var upload = multer({ dest: 'client/public/productImg/' })

mongoose.connect('mongodb://localhost:27017/bfc', {
    useMongoClient: true,
});
mongoose.Promise = global.Promise;

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password1: {
        type: String,
        required: true
    },
    password2: {
        type: String,
        required: true
    },
});
var userModel = mongoose.model('user', userSchema);

var productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
});
var productModel = mongoose.model('product', productSchema);

var cartSchema = mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    products: [{
       id: {
        type: String,
        required: true
       },
       number: {
        type: Number,
        required: true
       }
    }]
},{usePushEach: true});
var cartModel = mongoose.model('cart', cartSchema);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", function callback(req, res){
    var userInfo = req.body;
    var newUser = new userModel(userInfo);
    var error = newUser.validateSync();
    if (error) {
        return res.status(400).send({message: error.message})
    }
    userModel.find({username: userInfo.username}, function (error, docs){
        if (error) {
            return res.status(400).send({message: error.message})
        }
        if (docs.length) {
            return res.status(400).send({message: "Username already exists"});
        } else {
            userModel.find({email: userInfo.email}, function (error, docs){
                if (error) {
                    return res.status(400).send({message: error.message})
                }
                if (docs.length) {
                    return res.status(400).send({message: "Email already exists"});
                } else {
                    if (userInfo.password1 != userInfo.password2) {
                        return res.status(400).send({message: "Passwords not the same"})
                    } else {
                        newUser.save(function(error){
                            if (error) {
                                return res.status(400).send({message: error.message})
                            } else {
                                return res.send({message: "New user wrote to db"});
                            }
                        });
                    }
               }
            })
        }
    })
});

app.post("/register-product", upload.single('file'), function callback(req, res){
    var productInfo = {name: req.body.name, price: req.body.price, img: req.file.filename};
    var newProduct = new productModel(productInfo);
    var error = newProduct.validateSync();
    if (error) {
        return res.status(400).send({message: error.message})
    }
    productModel.find({name: productInfo.name}, function (error, docs){
        if (error) {
            return res.status(400).send({message: error.message})
        }
        if (docs.length) {
            return res.status(400).send({message: "Product already exists"});
        } else {
            newProduct.save(function(error){
                if (error) {
                    return res.status(400).send({message: error.message})
                } else {
                    return res.send({message: "New product wrote to db"});
                }
            })
        }
    })
});

app.post("/login", function callback(req, res){
    var userInfo = req.body;
    userModel.findOne({email: userInfo.email}, function (error, doc){
        if (error) {
            return res.status(400).send({message: error.message})
        }
        if (doc == null || doc.length == 0) {
            return res.status(400).send({message: "User not exist"});
        }
        if (doc.password1 != userInfo.password) {
            return res.status(400).send({message: "Wrong password"});
        } else {
            return res.send({message: "Logged in", user: doc});
        }
    })
})

app.post("/logout", function callback(req, res){
    var products = req.body.state.products;
    var userid = req.body.userid;
    var cartInfo = {userid: userid, products: products}
    var newCart = new cartModel(cartInfo);
    cartModel.update({ userid: userid }, { $set: { products: products }}, function(error, docs){
        console.log(error)
        console.log(docs)
        if (docs.nModified===0) {
            newCart.save(function(error){
                if (error) {
                    return res.status(400).send({message: error.message})
                } else {
                    return res.send({message: "Cart saved"});
                }
            })
        }
    });
})


app.get("/home", function (req, res){
    productModel.find({}, function (error, products){
        if (error) {
            return res.status(400).send({message: error.message})
        }
        return res.send({products: products})
    })
})

app.get("/profile/:userId", function (req, res){
    var userId = req.params.userId
    userModel.findOne({_id: userId}, function (error, user){
        if (error) {
            return res.status(400).send({message: error.message})
        }
        return res.send({user: user})
    })
})

app.get("/product/:productId", function (req, res){
    var productId = req.params.productId
    productModel.findOne({_id: productId}, function (error, product){
        if (error) {
            return res.status(400).send({message: error.message})
        }
        return res.send({product: product})
    })
})

app.get("/cart/:userId", function (req, res){
    var userId = req.params.userId
    cartModel.findOne({userid: userId}, function (error, cart){
        if (error) {
            return res.status(400).send({message: error.message})
        }
        return res.send({products: cart.products});
    })
})

app.listen(3001);