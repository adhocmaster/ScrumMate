const { Schema, model } = require('mongoose');

const sprintSchema = new Schema(
  {
    spikes:[
        {
            type:String,
            unique:true
        }
    ],
    release:{        
        type:Schema.Types.ObjectId,
        ref:'Release',
    }, 
    stories:[
        {            
            type:Schema.Types.ObjectId,
            ref:'Story',
        }   
    ],
    project:{
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
  }
)


sprintSchema.virtual('spikesCount').get(function () {
    return this.spikes.length;
});

sprintSchema.virtual('storiesCount').get(function () {
    return this.stories.length;
});

const Sprint = model('Sprint', sprintSchema);

module.exports = Sprint
