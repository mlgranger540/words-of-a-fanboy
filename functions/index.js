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

// Get post page when URL matches /post/uid
app.get("/post/:uid", (req, res) => {
    res.sendFile("post.html", {root : __dirname + "/../public/"});
});

// Get posts-by-fandom page when URL matches /fandom/fandom_id
app.get("/fandom/:fandom_id", (req, res) => {
    res.sendFile("posts-by-fandom.html", {root : __dirname + "/../public/"});
});

// Get posts-by-fandom-type page when URL matches /media-type/fandom_type_id
app.get("/media-type/:fandom_type_id", (req, res) => {
    res.sendFile("posts-by-fandom-type.html", {root : __dirname + "/../public/"});
});

// GET Routes for Prismic Data
// Get all posts sorted by post type
app.get("/getAllPosts", async (req, res) => {
    const documents = await client.getAllByType("post", {
        orderings: [
            {field: "my.post.type", direction: "asc"}
        ]
    });
    res.send(documents);
});

// Get all posts sorted by date written (newest first), then title (reverse alphabetical)
app.get("/getRecentPosts", async (req, res) => {
    const documents = await client.getAllByType("post", {
        orderings: [
            {field: "my.post.date_written", direction: "desc"},
            {field: "my.post.title", direction: "desc"}
        ]
    });
    res.send(documents);
});

// Get all posts that contain selected fandom ID
app.get("/getPostsByFandom/fandom/:fandom_id", async (req, res) => {
    const documents = await client.getAllByType("post", {
        filters: [
            prismic.filter.at("my.post.fandoms.fandom_id", req.params.fandom_id),
        ]
    });
    res.send(documents);
});

// Get all posts that contain selected fandom type
app.get("/getPostsByFandomType/media-type/:fandom_type_id", async (req, res) => {
    const documents = await client.getAllByType("post", {
        filters: [
            prismic.filter.at("my.post.fandoms.fandom_type_id", req.params.fandom_type_id),
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
