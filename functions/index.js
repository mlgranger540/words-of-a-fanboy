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
        type: 'blog_post',
        path: '/:uid',
    },
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

app.get("/getBlogPosts", async (req, res)=>{
    const documents = await client.getAllByType("blog_post");
    console.log(documents)
    res.send(documents);
});

exports.woaf_app = functions.https.onRequest(app);
