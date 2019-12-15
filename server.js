const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const validator=require('validator');
const passport=require('passport');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const methodOverride = require('method-override');
const dashboard=require('./dashboard');
const Post=require('./Model/Post');
const Comment=require('./Model/Comment');

mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
// app.use(methodOverride(function (req, res) {
//     if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//         // look in urlencoded POST bodies and delete it
//         var method = req.body._method
//         delete req.body._method
//         return method
//     }
// }));

app.use(express.static('public'));
app.set('view engine','pug');
app.use((req,res,next)=>{
    console.log('app middleware');
    next();
});
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
app.use(cookieParser());
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
app.use(passport.initialize());
app.use(passport.session());

app.use('/dashboard',dashboard);

app.get('/', async (req,res)=>{
    const posts=await Post.find({}).sort({created_at:1}).exec();
    res.render('posts',{
        title:'Posts',
        posts:posts
    })
});
app.get('/post/:id', async (req,res)=>{
    const post=await Post.findById(req.params.id);
    const comments=await Comment.find({post:post._id}).where('approved').equals(true).exec();
    // return res.send(comments)
    res.render('post',{
        title:'Post Index',
        post:post,
        comments:comments
    })
});

app.post('/comment/store',async (req,res)=>{
    // return res.json(req.body);
    const {body,commentor ,post}=req.body;
    const comment=new Comment({
        body,
        commentor,
        post
    });
    await comment.save();
    res.redirect('/');
});

app.listen(3000,()=>{
    console.log('server is running')
});