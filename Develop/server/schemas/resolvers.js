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
        login: async (parent, args, context) => {
            const user = await User.findOne({email: args.email});
            if (!user) {
                throw new AuthenticationError('Incorrect email or password.')
            }
        
            const correctPw = await user.isCorrectPassword(args.password);
        
            if (!correctPw) {
                throw new AuthenticationError('Incorrect email or password.')
            }
            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, args, context) => {
            const user = await User.create(args);

            if (!user) {
                throw new AuthenticationError('Something went wrong!')
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            console.log(context.user);
            try {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: args.bookData } },
                { new: true }
              );
              return updatedUser;
            } catch (err) {
                throw new AuthenticationError(err)
            }
        },
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: args.bookId } } },
                    { new: true }
                  );
                  if (!updatedUser) {
                    throw new AuthenticationError(err)
                  }
                  return updatedUser;
            }

        }
    }
}

module.exports = resolvers;