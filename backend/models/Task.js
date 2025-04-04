const mongoose=require("mongoose")

const todoSchema=new mongoose.Schema({
    text:{type:String,require:true},
    completed:{type:Boolean,default:false},
})


const taskSchema=new mongoose.Schema(
    {
        title:{type:String,require:true},
        description:{type:String},
        priority:{type:String,enum:["Low","Medium","High"],default:"Medium"},
        status:{type:String,enum:["pending","in Progress","Completed"],default:"Pending"},
        dueDate:{type:Date,require:true},
        assignedTo:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
        createBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
        attachments:[{type:String}],
        todoChecklist:[todoSchema],
        progress:{type:Number,default:0}
    },
    {timestamps:true}
)

module.exports=mongoose.model("Task",taskSchema)


