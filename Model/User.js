const mongoose=require('mongoose');


const UserSchema=mongoose.Schema({
    name: {type:String},
    email: {type: String, unique:true},
    password:{type:String}
}, { timestamps: { createdAt: 'created_at' } });

const User=mongoose.model('User',UserSchema);

module.exports=User;
// module.exports.verifyPassword=function (hash,password) {
//
// }