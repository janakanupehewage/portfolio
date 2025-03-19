import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/libs/mongodb'; // Ensure DB connection
import User from '@/models/user'; // User model
import Project from '@/models/project'; // Project model
import { uploadImage } from '@/libs/cloudinary'; // Import the uploadImage function
import { GraphQLError } from 'graphql';

connectDB();
// Define GraphQL Schema
const typeDefs = `
  type User {
    id: ID!
    username: String!
    token: String
  }

  type Project {
    id: ID!
    title: String!
    description: String
    imageUrl: String
  }

  type Query {
    testConnection: String
    projects: [Project]
    
  }

  type Mutation {
    login(username: String!, password: String!): User
    register(username: String!, password: String!): User
    addProject(title: String!, description: String, image: String!): Project
    updateProject(id: ID!, title: String, description: String, image: String): Project
    deleteProject(id: ID!): String
  }
`;

// Define Resolvers
const resolvers = {
  Query: {
    testConnection: async () => {
      try {
        
        return "Database connected successfully!";
      } catch (error) {
        console.error("Database connection failed:", error);
        return "Database connection failed!";
      }
    },
    projects: async () => await Project.find(),
    //fetchProjects: async () => await Project.find(),
  },

  Mutation: {
    register: async (_: any, { username, password }: { username: string; password: string }) => {
      await connectDB();
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        throw new Error("Username already exists");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create and save user
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser._id, username: newUser.username },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
      );

      return { id: newUser._id, username: newUser.username, token };
    },

    login: async (_: any, { username, password }: { username: string; password: string }) => {
      await connectDB();
      const user = await User.findOne({ username });

      if (!user) {
        const errorMessage = "User not found";
        console.error(`[LOGIN ERROR]: ${errorMessage} for username: ${username}`);
        throw new GraphQLError(errorMessage, {
          extensions: { code: "USER_NOT_FOUND" },
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        const errorMessage = "Invalid credentials";
        console.error(`[LOGIN ERROR]: ${errorMessage} for username: ${username}`);
        throw new GraphQLError(errorMessage, {
          extensions: { code: "INVALID_CREDENTIALS" },
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
      );

      return { id: user._id, username: user.username, token };
    },

    addProject: async (_: any, { title, description, image }: { title: string; description?: string; image: string }) => {
      //await connectDB();
      const imageResult = await uploadImage(image);
      
      const newProject = new Project({
        title,
        description,
        imageUrl: imageResult.secure_url,
      });

      await newProject.save();
      return newProject;
    },

    updateProject: async (_: any, { id, title, description, image }: { id: string; title?: string; description?: string; image?: string }) => {
      await connectDB();
      let imageUrl = undefined;

      if (image) {
        const imageResult = await uploadImage(image);
        imageUrl = imageResult.secure_url;
      }

      return await Project.findByIdAndUpdate(
        id,
        { title, description, imageUrl },
        { new: true }
      );
    },

    deleteProject: async (_: any, { id }: { id: string }) => {
      await connectDB();
      await Project.findByIdAndDelete(id);
      return "Project deleted successfully!";
    },
  },
};

// Create GraphQL API
const schema = makeExecutableSchema({ typeDefs, resolvers });
const yoga = createYoga({ schema });

// Handle requests
export { yoga as GET, yoga as POST };
