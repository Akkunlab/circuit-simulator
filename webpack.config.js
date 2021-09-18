const Dotenv = require('dotenv-webpack');
const JavaScriptObfuscator = require('webpack-obfuscator');
require('dotenv').config();

module.exports = {
    
  entry: {
    "main": "./src/client/main.js",
    "admin": "./src/client/admin.js"
  },
  
  output: {
    path: `${__dirname}/public/js`,
    filename: "[name].js"
  },

  mode: process.env.MODE,

  target: ["web", "es5"],
  
  plugins: [
    new Dotenv(),
    // new JavaScriptObfuscator({ rotateUnicodeArray: true }, [])
  ]
};