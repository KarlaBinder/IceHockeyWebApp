const mongoose=require('mongoose')

const gamedateSchema=mongoose.Schema(
    {
        date:{
            type: String,
            required:[true]
        },  
    } 
)

const Gamedate=mongoose.model('Gamedate',gamedateSchema);
module.exports=Gamedate;