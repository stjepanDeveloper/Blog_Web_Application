const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const methodOverride = require('method-override');



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride('_method'));
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});


let posts = [
    { title: "The Rise of Chatbots", content: "In the age of AI, chatbots have become our digital companions. Discover how these clever bots are changing the way we interact online, from providing customer support to engaging in casual conversations. Join the chatbot revolution!" },
    { title: "Journey to the Red Planet", content: "Embark on a cosmic adventure as we delve into the latest updates on Mars exploration. From the perseverance of rovers to the dreams of human colonization, we explore the mysteries of the Red Planet. Buckle up, space enthusiasts!" },
    { title: "The Unstoppable Comeback", content: "Witness the heart-stopping moments of the greatest sports comebacks in history. From the underdog stories to the miraculous turnarounds, we celebrate the resilience and determination that define these epic sporting moments." },
    { title: "Coding: The Art of Problem-Solving", content: "Dive into the world of programming, where lines of code transform into elegant solutions. Explore the art of problem-solving, the joy of debugging, and the thrill of crafting software that makes an impact. Coding is not just a skill; it's an art form." },
    { title: "Navigating the Digital Jungle", content: "In the vast digital jungle of social media, discover the latest trends, pitfalls, and success stories. From viral memes to impactful campaigns, we explore the ever-evolving landscape of online interaction. Grab your virtual binoculars and join the expedition!" }
  ];


const homeStartingContent = "Welcome to our Blog App!"
// Create a schema for blog posts
const postSchema = {
    title: String,
    content: String,
    date: {
        type: Date,
        default: Date.now
    }
};

// Create a model based on the schema
const Post = mongoose.model("Post", postSchema);



// Other routes and logic will be added later

app.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: 'desc' });
        res.render('home', { startingContent: homeStartingContent, posts: posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/about', (req, res) => {
    // Descriptive text about the blog
    const aboutContent = "Welcome to The CyberJungle Blog, your go-to source for a wild ride through the realms of technology, AI, space exploration, sports, programming, and social media. Our team of passionate writers is dedicated to bringing you captivating stories and insights from the digital jungle. Join us on this adventure into the future!"

    // Render the about view and pass the about content
    res.render('about', { aboutContent: aboutContent });
});


app.get('/contact', (req, res) => {
    // Render the contact view
    const contactContent = "If you want to contact me, here is the information below:"
    res.render('contact', { contactContent: contactContent });
});


app.get('/create', (req, res) => {
    res.render('makeposts');
});

app.post('/create', async (req, res) => {
    const postTitle = req.body.postTitle;
    const postBody = req.body.postBody;

    const date = new Date();
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}`;


    const post = new Post({
        title: postTitle,
        content: postBody,
        date: formattedDate
    });

    try {
        await post.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/edit/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        // Render the edit form template and pass the post details
        res.render('edit', { post: post });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// POST route to handle form submission for editing a post
app.post('/edit/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const updatedTitle = req.body.postTitle;
        const updatedContent = req.body.postBody;

        // Find the post by ID and update the title and content
        await Post.findByIdAndUpdate(postId, { title: updatedTitle, content: updatedContent });

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.delete('/delete/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;

        // Find the post by ID and delete it
        await Post.findByIdAndDelete(postId);

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});









// Start the server
const port = 3000; // You can change the port as needed
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});