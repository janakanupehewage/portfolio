import { NextRequest, NextResponse } from 'next/server';
import { createYoga } from 'graphql-yoga';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/libs/mongodb';
import User from '@/models/user';
import Project from '@/models/project';
import { uploadImage } from '@/libs/cloudinary';

connectDB();

interface RegisterArgs {
  username: string;
  password: string;
}

interface LoginArgs {
  username: string;
  password: string;
}

interface AddProjectArgs {
  title: string;
  description?: string;
  image: string;
}

interface UpdateProjectArgs {
  id: string;
  title?: string;
  description?: string;
  image?: string;
}

interface DeleteProjectArgs {
  id: string;
}

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

const resolvers = {
  Query: {
    testConnection: async () => "Database connected successfully!",
    projects: async () => await Project.find(),
  },
  Mutation: {
    register: async (_: unknown, { username, password }: RegisterArgs) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) throw new Error("Username already exists");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign({ userId: newUser._id, username: newUser.username }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

      return { id: newUser._id, username: newUser.username, token };
    },
    login: async (_: unknown, { username, password }: LoginArgs) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

      return { id: user._id, username: user.username, token };
    },
    addProject: async (_: unknown, { title, description, image }: AddProjectArgs) => {
      const imageResult = await uploadImage(image);
      const newProject = new Project({
        title,
        description,
        imageUrl: imageResult.secure_url,
      });
      await newProject.save();
      return newProject;
    },
    updateProject: async (_: unknown, { id, title, description, image }: UpdateProjectArgs) => {
      let imageUrl = undefined;
      if (image) {
        const imageResult = await uploadImage(image);
        imageUrl = imageResult.secure_url;
      }
      return await Project.findByIdAndUpdate(id, { title, description, imageUrl }, { new: true });
    },
    deleteProject: async (_: unknown, { id }: DeleteProjectArgs) => {
      await Project.findByIdAndDelete(id);
      return "Project deleted successfully!";
    },
  },
};

// Function to decode JWT token using jsonwebtoken
const decodeToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
};

// Custom Context interface that extends the default context used by yoga
interface CustomContext {
  user?: any;
}

const getContext = (req: NextRequest): CustomContext => {
  const token = req.headers.get('Authorization')?.split(' ')[1]; // If your token is in the Authorization header
  const user = token ? decodeToken(token) : null;
  return { user };
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  context: ({ req }: { req: NextRequest }) => {
    const extendedContext = getContext(req);
    return extendedContext; // Return the context with user
  },
});

export async function GET(req: NextRequest) {
  const context = { req }; // Provide the context object
  const response = await yoga.handleRequest(req, context); // Pass both req and context
  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(req: NextRequest) {
  const context = { req }; // Provide the context object
  const response = await yoga.handleRequest(req, context); // Pass both req and context
  return new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

