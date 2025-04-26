import express from "express";
import bodyParser from "body-parser"
import _ from 'lodash';     
import supabase from './supabaseClient.js';
import { v4 as uuidv4 } from 'uuid';



const app=express();
const port=3000;

//radom constant to be displayed  on home screen
const para1="The world of technology is constantly evolving, bringing new innovations and opportunities every day. From artificial intelligence to blockchain, the advancements are reshaping industries and transforming the way we live and work. As developers, staying updated with the latest trends and tools is crucial. Whether it's learning a new programming language or exploring frameworks like Node.js and Express, the journey of a developer is filled with challenges and excitement. Building projects, solving problems, and collaborating with others are all part of the process. The key is to stay curious, keep learning, and embrace the ever-changing landscape of technology.";
const para2="Traveling is one of the most enriching experiences one can have. It opens your mind to new cultures, traditions, and perspectives. Whether it's exploring the bustling streets of a vibrant city or hiking through serene landscapes, every journey has something unique to offer. Traveling teaches you to adapt, be patient, and appreciate the beauty of diversity. It also allows you to disconnect from the daily grind and reconnect with yourself. From tasting exotic cuisines to meeting new people, the memories created during travels last a lifetime. So pack your bags, step out of your comfort zone, and embark on an adventure.";
const para3="Health and wellness have become a top priority for many people in recent years. With busy schedules and demanding lifestyles, finding time to focus on physical and mental well-being is essential. Regular exercise, a balanced diet, and mindfulness practices like meditation can significantly improve your quality of life. Small changes, such as taking short breaks during work or staying hydrated, can make a big difference. It's also important to listen to your body and give it the rest it needs. Remember, a healthy lifestyle is not about perfection but about making consistent efforts to take care of yourself.";
const para4="Books have the power to transport you to different worlds and introduce you to new ideas. Reading is not just a hobby but a way to expand your knowledge and imagination. Whether it's fiction, non-fiction, or poetry, every book has something valuable to offer. It allows you to see the world through someone else's eyes and gain a deeper understanding of life. In today's fast-paced world, setting aside time to read can be a form of self-care. So, pick up a book, find a cozy spot, and lose yourself in the magic of storytelling.";

//home, about & contact 
const about="Hi, I’m Insha Khan, a passionate programmer, writer and content creator dedicated to sharing stories, insights, and inspiration. With a love for words and a curiosity for the world, I aim to create engaging and meaningful content that resonates with readers. Whether it’s exploring new ideas, offering practical advice, or simply sparking conversations, my goal is to connect with you through my blog. Join me on this journey as we navigate life’s adventures, learn together, and celebrate the beauty of storytelling. Thank you for being here—your support means the world to me!";
const contact="Have a question, suggestion, or just want to say hello? I’d love to hear from you! Feel free to reach out via email at khanxinsha@gmail.com, and I’ll get back to you as soon as possible. Your feedback and ideas are invaluable, and I’m always excited to connect with readers. Whether it’s about collaborations, blog topics, or simply sharing your thoughts, don’t hesitate to get in touch. Let’s create something amazing together—I’m looking forward to hearing from you!";
const home="Welcome to my corner of the internet! I’m Insha Khan, a writer and storyteller passionate about creating content that inspires, informs, and connects. Here, you’ll find a mix of personal reflections, practical advice, and thought-provoking ideas on topics close to my heart. Whether you’re looking for inspiration, tips, or simply a good read, this blog is a space for us to explore life’s adventures together. Dive in, explore, and let’s embark on this journey of learning and growth. Thank you for visiting—I’m thrilled to have you here! Stay curious, and let’s make every word count.";


// Home route - fetch posts from Supabase
app.get("/", async (req, res) => {
    const { data: posts, error } = await supabase.from("posts").select("*").order('created_at', {ascending:false});
    // if (error) return res.status(500).send("Error fetching posts");
    // const sortedPosts = posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.render("index.ejs", { homepg: home, allPosts: posts });
  });
  
  // About and Contact
  app.get("/about", (req, res) => res.render("about.ejs", { aboutpg: about }));
  app.get("/contact", (req, res) => res.render("contact.ejs", { contactpg: contact }));
  
  // Create Post page
  app.get("/create", (req, res) => res.render("create.ejs"));
  


  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());   

  // Create Post in Supabase
  app.post("/create", async (req, res) => {
    const { title, post } = req.body;
    try {
      const { error } = await supabase.from("posts").insert([
        { id: uuidv4(), title: title, content: post }
      ]);
  
      if (error) {
        console.error("Supabase Insert Error:", error);  // 🔍 Detailed log
        return res.status(500).send("Error creating post");
      }
  
      res.redirect("/");
    } catch (err) {
      console.error("Unexpected Error:", err);  // 🔍 Log unexpected errors
      res.status(500).send("Error creating post");
    }
  });
  
  

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json()); // <-- optional but good for JSON
  
  // Dynamic post route
  app.get("/posts/:title", async (req, res) => {
    const requestedTitle = _.kebabCase(_.lowerCase(req.params.title));
  
    const { data: posts, error } = await supabase.from("posts").select("*");
    if (error) return res.status(500).send("Error fetching posts");
  
    const matchedPost = posts.find(post =>
      _.kebabCase(_.lowerCase(post.title)) === requestedTitle
    );
  
    if (matchedPost) {
      res.render("post.ejs", {
        title: matchedPost.title,
        content: matchedPost.content
      });
    } else {
      res.status(404).send("Post not found");
    }
  });
  
  // Start server
  app.listen(port, () => {
    console.log(`Server started at port ${port}`);
  });