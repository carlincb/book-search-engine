const {AuthenticationError} = require('apollo-server-express');
// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user){
                const user = await User.findOne({_id: context.user._id})

                return user;
            } 
            throw new AuthenticationError('No user logged in.')
        }
    },
    Mutation: {
        
    }
}

module.exports = resolvers;