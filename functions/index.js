/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const express = require('express');
const client = require('./config/prismicConfig.js');
//const client = await import('./config/prismicConfig.js');

//const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

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

app.get('/getBlogPosts', async (req, res)=>{
    const document = await client.getSingle('blog_post');
    res.send(document);
});

exports.app = functions.https.onRequest(app);
