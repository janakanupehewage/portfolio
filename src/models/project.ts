import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String } // Store the Cloudinary image URL
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
