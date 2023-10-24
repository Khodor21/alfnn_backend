import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  introduction: {
    type: String,
  },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
  datePublished: {
    type: Date,
  },
  filePath: {
    type: String,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
