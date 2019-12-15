const express=require('express');
const router=express.Router();
const { check, validationResult } = require('express-validator');
const User=require('./Model/User');
const Post=require('./Model/Post');
const Comment=require('./Model/Comment');
const Category=require('./Model/Category');
const bcrypt=require('bcrypt');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

// function isLogin(req,res,next){
//     if (req.isAuthenticated()){
//         next();
//         return;
//     }
//     res.redirect('/dashboard/login')
// }
router.get('/category/create', (req,res)=>{
    res.render('dashboard/category',{
        title:'Create Category',
    })
});

router.post('/category/store',async (req,res)=>{
    // return res.json(req.body);
    const {name}=req.body;
    const category=new Category({
        name,
    });
    await category.save();
    res.redirect('/dashboard/category/index');
});
router.get('/category/index', async (req,res)=>{
    const categories=await Category.find({}).select('name');
    res.render('dashboard/categoryIndex',{
        title:'Category Index',
        categories:categories
    })
});
router.delete('/category/delete/:id',async (req,res)=>{
    // return res.json(req.body);
    const cat=await Category.findByIdAndRemove(req.params.id);
    return res.redirect('/dashboard/category/index');
});

router.get('/category/edit/:id',async (req,res)=>{
    // return res.json(req.body);
    const category=await Category.findById(req.params.id);
    res.render('dashboard/category',{
        title:'Edit Category',
        category:category
    })
});
router.put('/category/edit/:id',async (req,res)=>{
    // return res.json(req.body);
    const {name}=req.body;
    const category=await Category.findByIdAndUpdate(req.params.id,{name});
    return res.redirect('/dashboard/category/index');
});

router.get('/post/create', async (req,res)=>{
    const categories=await Category.find({}).select('name').exec();
    res.render('dashboard/post',{
        title:'Create Post',
        categories: categories
    })
});


router.post('/post/store',async (req,res)=>{
    // return res.json(req.body);
    const {title,description,category}=req.body;
    const post=new Post({
        title,
        description,
        category
    });
    await post.save();
    res.redirect('/dashboard/post/index');
});
router.get('/post/index', async (req,res)=>{
    const posts=await Post.find({});
    res.render('dashboard/PostIndex',{
        title:'Post Index',
        posts:posts
    })
});
router.delete('/post/delete/:id',async (req,res)=>{
    // return res.json(req.body);
    const post=await Post.findByIdAndRemove(req.params.id);
    return res.redirect('/dashboard/post/index');
});

router.get('/post/edit/:id',async (req,res)=>{
    // return res.json(req.body);
    const post=await Post.findById(req.params.id);
    const categories=await Category.find({}).select('name').exec();
    res.render('dashboard/post',{
        title:'Edit Post',
        post:post,
        categories: categories
    })
});
router.put('/post/edit/:id',async (req,res)=>{
    // return res.json(req.body);
    const {title, description, category}=req.body;
    const post=await Post.findByIdAndUpdate(req.params.id,{title, description, category});
    return res.redirect('/dashboard/post/index');
});

router.get('/comment/create', async (req,res)=>{
    const posts=await Post.find({}).select('title');
    res.render('dashboard/comment',{
        title:'Create Comment',
        posts: posts
    })
});

router.post('/comment/store',async (req,res)=>{
    // return res.json(req.body);
    const {body,commentor ,post}=req.body;
    const comment=new Comment({
       body,
        commentor,
        post
    });
    await comment.save();
    res.redirect('/dashboard/comment/index');
});

router.get('/comment/index', async (req,res)=>{
    const comments=await Comment.find({});
    res.render('dashboard/commentIndex',{
        title:'Comments Index',
        comments:comments,
        Post:Post
    })
});
router.delete('/comment/delete/:id',async (req,res)=>{
    const com=await Comment.findByIdAndRemove(req.params.id);
    return res.redirect('/dashboard/comment/index');
});

router.get('/comment/approve/:id',async (req,res)=>{
    // return res.json(req.body);
    const comment=await Comment.findById(req.params.id);
   comment.approved=true;
   comment.save();
    return res.redirect('/dashboard/comment/index');
});

router.get('/home',async (req,res)=>{
    const posts=await Post.find({}).select('title');
    res.render('dashboard/main.pug',{
        title: 'Post',
        posts:posts
    })
});

router.get('/login',(req,res)=>{
    res.render('login',{title : "Login Page"})
});

passport.use('local-login',new LocalStrategy({usernameField:'email',passwordField:'password'},
    function(email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            // if (!user.verifyPassword(password)) { return done(null, false); }
            console.log('sdf');
            return done(null, user);
        });
    }
));

router.post('/login', [
    // username must be an email
    check('email').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 3 })
], async (req, res,next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
next();
    // res.json(req.body)
    // const email = req.body.email;
    // const password = req.body.password;
    //
    // const user= await User.findOne({email:email});
    // if (user){
    //     console.log(user);
    //     // return res.send('FIND');
    //     next();
    // }
    // return res.send('NOT FIND');

}, passport.authenticate('local-login', { failureRedirect: '/dashboard/login' }),async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    const user= await User.findOne({email:email});
    if (user){
        // console.log(user);
        return res.json(req.user);
    }
    return res.send('NOT FIND');
});

router.get('/register',(req,res)=>{
    res.render('register',{ title: 'Register Page'})
});
// router.use((req,res,next)=>{
//
//         // username must be an email
//         check('name').isLength({ min: 0 });
//         check('email').isEmail();
//         // password must be at least 5 chars long
//         check('password').isLength({ min: 3 });
//
//     next();
// });
router.post('/register'
//     ,[
//     // username must be an email
//     check('name').isLength({ min: 0 }),
//     check('email').isEmail(),
//     // password must be at least 5 chars long
//     check('password').isLength({ min: 3 }),
// ]
    , async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    // return res.json(req.body);
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const user=new User({
        name,
        email,
        password
    });
    await user.save();
    res.redirect('/dashboard/login');
});
module.exports=router;