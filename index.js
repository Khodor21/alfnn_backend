import express from "express";
import cors from "cors";
import multer from "multer";
import admin from "firebase-admin";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import MessageRouter from "./router/message.js";
import Blog from "./models/Blog.js";

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "https://alfnn-10.vercel.app/",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/api", MessageRouter);

const storage = multer.memoryStorage();
const upload = multer({ storage });

const serviceAccount = {
  type: "service_account",
  project_id: "alfnn-10",
  private_key_id: "98670e883939b6408edec13f0c03b31cf04ff209",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDze6jcnF1yq41c\nVg/6hu4xFO8jI4egAcYtp246P+zTs+qFSb7rbOFJ1wdBdqREhN3BvfvP5Lxo8m2I\nNlZ8ymSK7lbIdbW6Rosx824Q2IznDj423BoptP6+giRvwpz52L646nMbeIiXZgM2\nxBHjg9F1SuBB+A5p4u0QI/FekwMUux+8EHe9m0rCmW+T67qCsoi2qoPV5AAC0hy0\nQDUSyCKafbyGDFi1ttuVYc8AyHL6Wsd/cLJfbQDbCqLaAPXbJRjqN+tM5nIRcgki\nIIOXsH+aRYH8ZST2qkhk3Q43uOz4FIkpJPMI8fUVcDCpztzjCWyiri/ycAJzCh2/\n/+oNg7afAgMBAAECggEACq+fmO5JHacqbf+3wmkmNN10Pcipg0JaRjB5SOSVI/90\nwgMBqZR4PytJF4lTXhx7HRP8MSlOHMif022xfKQA89k2ntd0fkEdV9GVJl3sS5gk\nIkU+5eiz+El+7uONy/T3l4Cjd6eutJi9RSvBLm9fg7Q7EaCHUjde6/ZTE0sEquXe\n0iVdhSUtgSMF3celqGj+CfX3OLmtsSE5Isrs3rMeye8/YeXdyAEwb/MLt20UWUEv\noAQhL9cG+baxAxP/88YJJOHN2/GEH5Z2d5gXBOapSkVCRM7oF4Det+2DSy0NQT9X\n+ok43llNHEKrcpA8STH/B28dzCZ4SdoxzCJXCE4xSQKBgQD/xGVRm5oiWabFdZCR\nR+pwXTnhqRjbZv5XJN8LqQT+xGUCU65v6TV/GZilW6sJzgF5rHBKQ84AANZ8QDXs\n64jTjybxFI+mhDz1HrcGsvghN4B4wGlWTkqFvYc84PAa5C2RdzX/JM5BpFFFiObe\noXCu8Lklqq9n/+csgO/T/Zbo6QKBgQDztGaw0RU90F4C0+4uoIRJwBZFJASOtW6f\nYpr/2K3Q2o1q/2Pthwp51VekX8FJLG0FIE4PzTU/kb1/j+vthDYX+K2HyxS0S3Gv\nOtsiicT/wTct4T88cTsmwXtJQ1C+XRSvqqKUIFN9i4DLbDIQ8bV8o9ZUy/g1huoe\nR4hZrs1uRwKBgBjiGpld8hj1b+w2C+KWhJB6AW+a6/gshQIlbC3OO9YtdUZMrePl\nZHcBHoC38mP5ztrvk90ly5zkd/mOpbBvGdi7TKaXwYIJy4RtgJD+SHWy2KTm01i6\nNTXdwpKBr9pt6KEGYBJ6mjZ4rg99yjhOrI/Yi6rGeFo941fJE4wkV9JBAoGACp7J\n+tqhulfiQO1La+zC1xPv5IN1T2LIt1lst8mRiZB8qTUH/cnswvJxJ1Ck87Nj7N1D\niZy/vU10nKKA/ZDNaq4Doe9Pr6u6AJDoC9FFLIAXD4DJaLDmiwHThZXRZvpXdHBT\nNXFTMh1qN3M3m1VtO0lIhdl9r5d5jGhBoOblPPECgYEA+UQuFm1Xldc9NQXOp3yP\nbfd71dk3ssBbrUG/0d56RSJr/ws0WkRt0WB3XF9twi9/SilhkJ7zZfYZtz/kv27Y\nq1EsSQFJo12FTMiWwoauO9Jvn70oBy2lgSxQJq3ZjJr3eT7wa78RFTUJHVfJY2fh\nXGkw0mXV1d+veaxOgPN0FkQ=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-3m7sq@alfnn-10.iam.gserviceaccount.com",
  client_id: "118199200639085290271",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3m7sq%40alfnn-10.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://alfnn-10.appspot.com",
});

app.post("/api/blog", upload.single("image"), async (req, res) => {
  try {
    const { title, introduction, link, datePublished } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const bucket = admin.storage().bucket();

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();
    blobStream.end(file.buffer);

    await new Promise((resolve, reject) => {
      blobStream.on("finish", async () => {
        const filePath = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(fileName)}?alt=media`;

        const postBlog = new Blog({
          title,
          image: filePath, // Set the image field to the Firebase Storage URL
          introduction,
          link,
          datePublished,
        });
        await postBlog.save();

        res.status(201).json({ message: "Blog posted successfully" });
        resolve();
      });
      blobStream.on("error", (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error("Error posting blog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/blog", async (req, res) => {
  try {
    // Fetch all blog posts from MongoDB
    const blogs = await Blog.find();

    // Fetch images and details from Firebase Storage
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles();
    files.forEach((file, index) => {
      console.log("Id:", file.id);
    });
    console.log(bucket.name);
    // Create a map for quick lookup
    const imageMap = new Map(
      files.map((file) => ({
        name: file.name,
        url: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${file.id}?alt=media`,
      }))
    );

    // Combine blog post data with image URLs
    const blogsWithImages = blogs.map((blog) => {
      const imageURL = blog.filePath;
      const imageInfo = imageMap.get(imageURL);
      if (imageInfo) {
        return {
          ...blog._doc,
          image: imageInfo.url,
        };
      }
      return blog;
    });

    res.status(200).json(blogsWithImages);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

mongoose.connect(
  "mongodb+srv://khodorhasan17:khodorhasan22@chatapp.lk2gioe.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
