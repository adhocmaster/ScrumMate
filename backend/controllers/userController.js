const { User } = require('../models');

const userController = {
    async getUsers(req, res) {
        try {
          const dbUserData = await User.find()
            .select('-__v')
          res.json(dbUserData);
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
      async getSingleUser(req,res){
        try{
            const userData = await User.findOne({_id: req.params.userId}).select('-__v').populate('projects').populate('friends')
            if(!userData){
                return res.status(404).json({ message: 'Invalid user id' });
            }
            res.json(userData)
        }catch (err){
            console.log(err)
            res.status(500).json(err)
        }
      },
      async createUser(req,res){
        try{
            const userData = await User.create(req.body);
            res.json(userData)
        }catch(err){
            console.log(err)
            res.status(500).json(err)
        }
      },
       async addFriend(req, res) {
        try {
          const userData = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true });
    
          if (!userData) {
            return res.status(404).json({ message: 'No user with this id!' });
          }
          res.json(userData);
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },  async removeFriend(req, res) {
        try {
          const userData = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });
    
          if (!userData) {
            return res.status(404).json({ message: 'No user with this id!' });
          }
          res.json(userData);
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },

}

module.exports = userController;
