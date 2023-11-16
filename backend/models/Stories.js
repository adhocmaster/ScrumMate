const { Schema, model } = require('mongoose');

const storySchema = new Schema(
  {
    notes:[
        {
            type:String,
            unique:true
        }
    ],
    description:{
        type:String,
        required: true
    },
    points:{
        type:Number,
        required:true 
    },
    tasks:[
        {        
        type:Schema.Types.ObjectId,
        ref:'Task',
        }
    ], 
    sprint_id:{
        type: Schema.Types.ObjectId,
        ref: 'Sprint',
    },
  }
)


storySchema.virtual('taskCount').get(function () {
    return this.tasks.length;
});

const Story = model('Story', storySchema);

module.exports = Story
