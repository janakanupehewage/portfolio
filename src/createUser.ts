import bcrypt from 'bcryptjs';
import { connectDB } from '@/libs/mongodb'; // Ensure DB connection
import User from '@/models/user';  // Adjust this import path if needed

const createUser = async () => {
  try {
    await connectDB(); // Ensure DB connection before inserting user
    const username = 'janakanupehewage02@gmail.com'; // Change to the desired username
    const password = 'jana#1999'; // Change to the desired password

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    console.log('User created successfully!');
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Run the function
createUser().catch(err => console.error(err));
