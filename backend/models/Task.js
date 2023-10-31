const { Schema, model } = require('mongoose');

const taskSchema = new Schema(
  {
    description:{
        type:String,
        required: true
    },
    points:{
        type:Number,
        required:true 
    },
    members:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    story:{
        type: Schema.Types.ObjectId,
        ref: 'Story',
    },
  }
)


const Task = model('Task', taskSchema);

module.exports = Task
