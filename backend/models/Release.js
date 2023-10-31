const { Schema, model } = require('mongoose');

const releaseSchema = new Schema(
  {
    stories:[
        {
            type:String,
            unique:true
        }
    ],
    project_id:{
        type:Schema.Types.ObjectId,
        ref:'Project',
    },
    points:{
        type:Number,
        required:true 
    },
    stories:[
        {        
        type:Schema.Types.ObjectId,
        ref:'Story',
        }
    ], 
    status:{
        type: String,
        required:true,
        default:"Pending"
    },
  }
)


storySchema.virtual('taskCount').get(function () {
    return this.tasks.length;
});

const Story = model('Story', storySchema);

module.exports = Story
