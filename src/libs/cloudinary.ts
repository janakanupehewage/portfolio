import cloudinary from "cloudinary";

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload the image to Cloudinary
export async function uploadImage(base64Image: string) {
    try {
        const result = await cloudinary.v2.uploader.upload(base64Image, {
            resource_type: "image",
        });
        return result; // Returns the Cloudinary upload result
    } catch (error) {
        throw new Error("Cloudinary upload failed: " + error);
        
    }
}
