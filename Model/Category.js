const mongoose=require('mongoose');

const CategorySchema=mongoose.Schema({
    name:{type:String, required:true},
},{ timestamps: { createdAt: 'created_at' } });

const Category=mongoose.model('Category',CategorySchema);
module.exports=Category;