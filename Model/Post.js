const mongoose=require('mongoose');

const PostSchema=mongoose.Schema({
    title:{type:String, required:true},
    description:{type: String, required: true},
    category: mongoose.Schema.Types.ObjectId
},{ timestamps: { createdAt: 'created_at' } });

const Post=mongoose.model('Post',PostSchema);
module.exports=Post;