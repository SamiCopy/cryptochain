// {
//     "name": "cryptochain",
//     "version": "1.0.0",
//     "main": "index.js",
//     "scripts": {
//       "test": "jest --watchAll",   ---runs tests on all test files automatically
//       "start": "node index.js",   ---default start file
//       "dev": "nodemon index.js",      -- reruns the servers if sees any changes in files             
//       "dev-peer": "cross-env GENERATE_PEER_PORT='true' nodemon index.js"  -- looks for GENERATE_PEER_PORT=true in the index.js file
//    "build-client": "parcel-build frontend/code/index.html --out-dir frontend/dist"  -- bundle up everything that is neccessary into a single js file to be served on to the browser,
// "clean": "rimraf .cache frontend/dist" -- rimraf is windows equivalent of remove recursively with force of linux -rm rf, to clean the cache/old builts by react as sometimes it doesnt pick up all the changes live.

//     },
//     "keywords": [],
//     "author": "",
//     "license": "ISC",
//     "description": "",
//     "devDependencies": {
//       "cross-env": "^7.0.3",  -- used to set environment variables to be consisten across differnt files
//       "jest": "^29.7.0",
//       "nodemon": "^3.1.4",
//       "npm-check-updates": "^17.1.1"
//     },
//     "dependencies": {
//       "body-parser": "^1.20.2",  -- reads the incoming post req, if it realizes itss in JSON, it stores it as an object to later parse it to express/node js
//       "express": "^4.19.2",
//       "hex-to-binary": "^1.0.1",
//       "pubnub": "^8.2.7"
//     }
//   }
  