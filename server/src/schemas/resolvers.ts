import { User, Book } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth';

interface LoginArgs {
    email: string;
    password: string;
}

interface AddUserArgs {
    input:{
        username: string;
        email: string;
        password: string;
    }
}

interface SaveBookArgs {
    bookData: {
        bookId: string;
        authors: string[];
        description: string;
        title: string;
        image: string;
        link: string;
    };
}

interface RemoveBookArgs {
    bookId: string;
}

const resolvers = {
    Query: {
        me: async () => {
                return await User.findById(User._id).populate('savedBooks');
                throw new AuthenticationError('You need to be logged in!');
        },
    },
    Mutation: {
        login: async (_parent: any, { email, password }: LoginArgs) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('Invalid credentials');
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Invalid credentials');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },

        addUser: async (_parent: any, { input }: AddUserArgs) => {
            const user = await User.create({ input });
            const token = signToken(user.username, user.email, user.password);
            return { token, user };
        },

        saveBook: async (_parent: any, { bookData }: SaveBookArgs, context: any) => {
            if (context.user) {
                return await User.findByIdAndUpdate(
                    context.user._id,
                    { $addToSet: { savedBooks: bookData } },
                    { new: true }
                ).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: any) => {
            if (context.user) {
                return await User.findByIdAndUpdate(
                    context.user._id,
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                ).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
}

export default resolvers;