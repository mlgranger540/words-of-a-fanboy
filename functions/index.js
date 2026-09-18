/* eslint-disable no-undef */
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const express = require("express");
const prismic = require("@prismicio/client");
const fetch =  (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const repoName = 'words-of-a-fanboy' // Fill in your repository name.
const accessToken = '' // If your repository is private, add an access token.

// The `routes` property is your route resolver. It defines how you will 
// structure URLs in your project. Update the types to match the Custom 
// Types in your project, and edit the paths to match the routing in your 
// project.
const routes = [
    {
        type: 'post',
        path: '/:uid'
    }
]

const client = prismic.createClient(repoName, { 
    fetch, 
    accessToken,
    routes,
})

const app = express();

// Add a middleware function that runs on every route. It will inject 
// the prismic context to the locals so that we can access these in 
// our templates.
app.use((req, res, next) => {
    res.locals.ctx = {
        prismic,
    };
    next();
});

// Get second recent posts page when URL matches /page-n
app.get("/page-:page", (req, res) => {
    res.sendFile("recent.html", {root : __dirname + "/../public/"});
});

// Get all posts page when URL matches /all-posts/n
app.get("/all-posts/:page", (req, res) => {
    res.sendFile("all-posts.html", {root : __dirname + "/../public/"});
});

// Get post page when URL matches /post/uid
app.get("/post/:uid", (req, res) => {
    res.sendFile("post.html", {root : __dirname + "/../public/"});
});

// Get Posts by Fandom page when URL matches /fandom/fandom_id
app.get("/fandom/:fandom_id", (req, res) => {
    res.sendFile("posts-by-fandom.html", {root : __dirname + "/../public/"});
});

// Get Posts by Fandom Type page when URL matches /media-type/fandom_type_id
app.get("/media-type/:fandom_type_id", (req, res) => {
    res.sendFile("posts-by-fandom-type.html", {root : __dirname + "/../public/"});
});

// Get Posts by Post Type page when URL matches /post-type/post_type_id
app.get("/post-type/:post_type_id", (req, res) => {
    res.sendFile("posts-by-post-type.html", {root : __dirname + "/../public/"});
});

// GET Routes for Prismic Data
// Get paginated posts sorted by date written (newest first), then title (reverse alphabetical) for homepage
app.get("/getRecentPosts", async (req, res) => {
    const documents = await client.getByType("post", {
        orderings: [
            {field: "my.post.date_written", direction: "desc"},
            {field: "my.post.title", direction: "desc"}
        ],
        pageSize: 5
    });
    res.send(documents);
});

// Get paginated posts sorted by date written (newest first), then title (reverse alphabetical) for page 2 onwards
app.get("/getRecentPosts/page-:page", async (req, res) => {
    const documents = await client.getByType("post", {
        orderings: [
            {field: "my.post.date_written", direction: "desc"},
            {field: "my.post.title", direction: "desc"}
        ],
        pageSize: 5,
        page: req.params.page
    });
    res.send(documents);
});

// Get larger number of paginated posts sorted by date written (newest first), then title (reverse alphabetical) for All Posts page
app.get("/getRecentPosts/all-posts/:page", async (req, res) => {
    const documents = await client.getByType("post", {
        orderings: [
            {field: "my.post.date_written", direction: "desc"},
            {field: "my.post.title", direction: "desc"}
        ],
        pageSize: 10,
        page: req.params.page
    });
    res.send(documents);
});

// Get all posts sorted by post type
app.get("/getAllPosts", async (req, res) => {
    const documents = await client.getAllByType("post", {
        orderings: [
            {field: "my.post.type", direction: "asc"}
        ]
    });
    res.send(documents);
});

// Get all posts that contain selected fandom ID, sorted by date written (newest first), then title (reverse alphabetical)
app.get("/getPostsByFandom/fandom/:fandom_id", async (req, res) => {
    const documents = await client.getAllByType("post", {
        filters: [
            prismic.filter.at("my.post.fandoms.fandom_id", req.params.fandom_id),
        ],
        orderings: [
            {field: "my.post.date_written", direction: "desc"},
            {field: "my.post.title", direction: "desc"}
        ]
    });
    res.send(documents);
});

// Get all posts that contain selected fandom type, sorted by date written (newest first), then title (reverse alphabetical)
app.get("/getPostsByFandomType/media-type/:fandom_type_id", async (req, res) => {
    const documents = await client.getAllByType("post", {
        filters: [
            prismic.filter.at("my.post.fandoms.fandom_type_id", req.params.fandom_type_id),
        ],
        orderings: [
            {field: "my.post.date_written", direction: "desc"},
            {field: "my.post.title", direction: "desc"}
        ]
    });
    res.send(documents);
});

// Get all posts that match selected post type, sorted by date written (newest first), then title (reverse alphabetical)
app.get("/getPostsByType/post-type/:type_id", async (req, res) => {
    const documents = await client.getAllByType("post", {
        filters: [
            prismic.filter.at("my.post.type_id", req.params.type_id),
        ],
        orderings: [
            {field: "my.post.date_written", direction: "desc"},
            {field: "my.post.title", direction: "desc"}
        ]
    });
    res.send(documents);
});

// Get post with selected UID
app.get("/getPost/post/:uid", async (req, res) => {
    const document = await client.getByUID("post", req.params.uid);
    res.send(document);
});

exports.woaf_app = functions.https.onRequest(app);
