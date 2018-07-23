// Libraries
var express = require('express');
var body_parser = require('body-parser');var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/mystore-db');
 
var Product = require('./Schema/Product');
var WishList = require('./Schema/wishlist');
 
//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});
 
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
 
app.get("/products", function(req, res) {
    Product.find({}, function(err, products) {
        if(err) {
            res.status(500).send({error: "Some internal error. If problem persist, please contant us and report the issue"});
        } else {
            res.send(products);
        }
    });
});
 
app.get("/products/:categories", function(req, res) {
 
    var cat = req.params.categories;
 
    Product.find({"categories": cat}, function(err, products) {
        if(err) {
            res.status(500).send({error: "Some internal error. If problem persist, please contant us and report the issue"});
        } else {
            res.send(products);
        }
    });
});
 
app.post("/product", function(request, response){
    var prod = request.body;
    if(Object.keys(prod).length == 0) {
        response.status(500).send({error: "No product is present"});
    } else {
        var product = new Product();
        if(prod.title && prod.title != "" && prod.price && prod.price != "") {
            product.title = prod.title;
            product.price = prod.price;
            product.imgUrl = prod.imgUrl;
        } else {
            response.send({error: "invalid product object"});
        }
 
        if(prod.description && prod.description != "")
            product.description = prod.description;
         
        if(prod.categories && prod.categories != "")
            product.categories = prod.categories;
 
        product.save(function(err, storedProduct) {
            if(err) {
                response.status(500).send(
                    {error: "enable to save the product in the database"});
            } else {
                response.status(200).send(storedProduct);
            }
        });
    }
});
 
app.post("/wishlist", function(request, response) {
    var wishlist = new Wishlist();
    var title = request.body.title;
    if(title) {
        wishlist.title = title;
    }
    wishlist.save(function(err, wishlistObj){
        if(err) {
            response.status(500).send({error:"Unable to create wishlist"});
        } else {
            response.send("wishlist created successfully");
        }
    });
});
 
app.post("/wishlist/product/add", function(request, response) {
    var productId = request.body.productId;
    var wishlistId = request.body.wishlistId;
 
    if(productId && productId != "" && wishlistId && wishlistId != "") {
        Product.find({_id: productId}, function(err, product){
            if(err) {
                response.status(500).send({error: "unable to fetch the product from DB"});
            } else {
                Wishlist.find({_id: wishlistId}, function(err, wishlist) {
                    if(err) {
                        response.status(500).send({error: "Unable to find the wishlist"});
                    } else {
                        Wishlist.update({_id: wishlistId}, 
                            {$addToSet:{"products": productId}}, 
                            function(err, wishlist) {
                                if(err) {
                                    response.status(500).send({error: "Unable to update the wishlist"});
                                } else {
                                    response.send(wishlist);
                                }
                        });
                    }
                });
            }
        });
    } else {
        response.status(500).send({error: "Either product or wishlist is not provided"});
    }
});
 
app.get("/wishlist", function(request, response) {
 
    Wishlist.find({})
        .populate({path: 'products', model: 'Product'})
        .exec(function(err, wishlist) {
            if(err) {
                response.status(500).send({error: "Unable to fetch the wishlists"});
            } else {
                response.send(wishlist);
            }
        });
});
 
app.listen(3004, function() {
    console.log("Server is up and running on Port 3004");
});
var mongoose = require('mongoose');

// Configuring
var app =  express();
app.listen(3000,function(){
    console.log('Server started');
})
app.use(body_parser.json());
mongoose.connect('mongodb://localhost:27017/mystore-db');

// Adding all requirements
var products =  require ('./Schema/products.js');
var carts =  require ('./Schema/carts.js');
var users =  require ('./Schema/users.js');
var wishlists =  require ('./Schema/wishlists.js');

// Proccessing part
app.get('/',function(req,res){ //DD
    res.send("Hi, you are in home");
});

app.get('/getproducts',function(req,res){ //DD
    products.find({},function(err,data){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(data);
        }
    })
});

app.post('/addproduct',function(req,res){//add product to product list. //DD
    var prod = new products();
    var data =  req.body;
    if(Object.keys(data).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else{
        prod.title = data.title;
        prod.price = data.price;
        if(Object.keys(data.description).length!=0)
            prod.description = data.description;
        prod.save(function(err,result){
            if(err){
                res.status(500).send({error:"internal error occured. please try again."});
            }else{
                res.status(200).send(result);
            }
        })

    }
});
// ID 5b532b9c808fea69b5baee58
app.post('/getproduct',function(req,res){ //DD
    console.log();
    var pid = req.body._id;
    console.log(pid);
    if(Object.keys(req.body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else
    products.find({_id:pid},function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    })
    
});

app.post('/removeproduct',function(req,res){ //DD
    var pid = req.body._id;
    if(Object.keys(req.body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else
    products.remove({_id:pid},function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    })
});

app.post('/updateproduct',function(req,res){ //DD
    var data= req.body;
    var pid = data._id;
    if(Object.keys(req.body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else
    products.updateOne({_id:pid},{title:data.title,price:data.price,description:data.description,cat:data.cat,imgSrc:data.imgSrc,},function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(data);
        }
    })
});

app.post('/getproductsbycat',function(req,res){ //DD
    var cato= req.body.cat;
    if(Object.keys(req.body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else
    products.find({cat:cato},function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    })
});

app.post('/createcart',function(req,res){ //DD
    var cart = new carts();
    var body= req.body;
    if(Object.keys(body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else{
        cart.uid = body.uid;
        cart.save(function(err,result){
            if(err){
                res.status(500).send({error:"internal error occured. please try again."});
            }else{
                res.status(200).send(result);
            }
        })
    }
    
});

app.post('/addproducttocart',function(req,res){//CART ID , PRODUCT ID //DD
    var body= req.body;
    if(Object.keys(body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else{
    carts.update({uid:body.uid}, { $push: { products: {pid:body.pid} } },function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    })
    }
});

app.post('/getcartbyuser',function(req,res){ //DD
    var body= req.body;
    if(Object.keys(body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else
    carts.find({uid:body.uid},function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    });
});

app.post('/clearcart',function(req,res){//DD
    var body= req.body;
    carts.update({uid:body.uid},{ $set: { "products" : [] } },function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    });


});

app.post('/removeproductfromcart',function(req,res){//DD
    var body= req.body;
    if(Object.keys(body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else
    carts.update({uid:body.uid},{ $pull: { "products" : body.pid } },function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    });
});

app.post('checkout',function(req,res){
   
});

app.post('/createwishlist',function(req,res){//DD
    var wishlist = new wishlists();
    var body= req.body;
    if(Object.keys(body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else{
        wishlist.uid = body.uid;
        wishlist.title = body.title;
        wishlist.save(function(err,result){
            if(err){
                res.status(500).send({error:"internal error occured. please try again."});
            }else{
                res.status(200).send(result);
            }
        })
    }
});

app.post('/getwishlist',function(req,res){//DD
    var body= req.body;
    if(Object.keys(body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else{
        wishlists.find({uid:body.uid , _id:body._id},
            function(err,result){
                if(err){
                    res.status(500).send({error:"internal error occured. please try again."});
                }else{
                    res.status(200).send(result);
                }
            })
    }
});

app.post('/getwishlistsofuser',function(req,res){//DD
    var body= req.body;
    if(Object.keys(body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else{
        wishlists.find({uid:body.uid},
            function(err,result){
                if(err){
                    res.status(500).send({error:"internal error occured. please try again."});
                }else{
                    res.status(200).send(result);
                }
            })
    }
});

app.post('/addproducttowishlist',function(req,res){//CART ID , PRODUCT ID //DD
    var body= req.body;
    if(Object.keys(body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else{
    wishlists.update({uid:body.uid,_id:body._id}, { $push: { products: {pid:body.pid} } },function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    })
    }
});

app.post('/removeproductfromwishlist',function(req,res){
    var body= req.body;
    if(Object.keys(body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else
    wishlists.update({uid:body.uid,_id:body._id},{ $pull: { "products" : {pid:body.pid} } },function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    });
});

app.post('/deletewishlist',function(req,res){
    var body= req.body;
    
    wishlists.update({uid:body.uid,_id:body._id},{ $pull: {} },function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    });
});

app.post('/auth',function(req,res){
    
});

app.post('/createuser',function(req,res){//DD
    var body = req.body;
    var user = new users();
    if(Object.keys(req.body).length == 0 ){
        res.status(500).send({error:"internal error occured. please try again."});
    }else{
        user.name = body.name;
        user.email = body.email;
        user.address = body.address;
        user.save(function(err,result){
            if(err){
                res.status(500).send({error:"internal error occured. please try again.",err});
            }else{
                res.status(200).send(result);
            }
        })
    }
    
});

app.get('/getusers',function(req,res){//DD
    users.find({},function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    });
});

app.post('/deleteuser',function(req,res){//DD
    var body = req.body;
    users.deleteOne({_id:body._id},function(err,result){
        if(err){
            res.status(500).send({error:"internal error occured. please try again."});
        }else{
            res.status(200).send(result);
        }
    });
});