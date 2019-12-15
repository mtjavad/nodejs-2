const mongoose=require('mongoose');

const CommentSchema=mongoose.Schema({
    body:{type:String, required:true},
    commentor:{type: String},
    post:mongoose.Schema.Types.ObjectId,
    approved:{type: Boolean, default:false}
},{ timestamps: { createdAt: 'created_at' } });

const Comment=mongoose.model('Comment',CommentSchema);
module.exports=Comment;