const { Schema, model } = require('mongoose');

const projectSchema = new Schema(
  {
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    name:{
        type:String, 
        required: true
    },
    releases:[
        {            
            type:Schema.Types.ObjectId,
            ref:'Release',
        }   
    ], 
    sprints:[
        {            
            type:Schema.Types.ObjectId,
            ref:'Sprint',
        }   
    ],
    members:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
    ]
  }
)


projectSchema.virtual('memberCount').get(function () {
    return this.members.length;
});

projectSchema.virtual('sprintCount').get(function () {
    return this.sprints.length;
});

const Project = model('Project', projectSchema);

module.exports = Project
