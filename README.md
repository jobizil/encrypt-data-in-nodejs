# Encrypting and Decrypting Data in Nodejs

### Learn how to encrypt and decrypt data in nodejs

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Installing Dependencies](#installing-dependencies)
- [Modifying the package.json file](#modifying-the-packagejson-file)
- [Creating the Config File](#creating-the-config-file)
- [Creating the Server File](#creating-the-server-file)
- [Creating the encryption Module](#creating-the-encryption-module)
- [Creating the Routes](#creating-the-routes)
- [Testing the Routes](#testing-the-routes)
- [Conclusion](#conclusion)

## Introduction

This tutorial aims at teaching you how to encrypt and decrypt data in nodejs.
The method provided here are pretty straight forward and easy to understand, as it has been written with the intention of enabling other programmers and developers learn how to encrypt data in their applications.
This encryption method can be used for files, messages or any other data that needs to be encrypted in your application.

In this tutorial, the Encryption and Decryption methods provided are based on the _AES-256_ algorithm and why we are using this is because it is one of the most popular encryption algorithms in use today, and it’s well known for being secure.

> NOTE: The AES-256 algorithm is a symmetric-key algorithm, which means that the same key is used for both encryption and decryption. This is in contrast to asymmetric-key algorithms, which use a public key for encryption and a private key for decryption.

## Prerequisites

- Nodejs
- NPM or Yarn
- Knowledge of Javascript

## Getting Started

To get started, you need to create a new project folder and initialize npm or yarn in it. To do this, run the following commands in your terminal:

I'd be using yarn in this tutorial, but you can use npm if you prefer.

```bash
mkdir nodejs-encryption
cd nodejs-encryption
yarn init -y
```

> This will create a new folder called nodejs-encryption and initialize yarn in it. The -y flag is used to skip the interactive mode and use the default values.

## Installing Dependencies

To install the dependencies, run the following command in your terminal:

```bash
yarn add express dotenv
yarn add -D nodemon
```

> This will install the express and dotenv modules and the nodemon module will be installed in the devDependencies.

## Modifying the package.json file

We will be using the module type in the package.json file to enable the use of ES6 modules in our project also we will be adding the start and dev scripts to the scripts object in the package.json file.

```json

"type": "module",
"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }

```

## Creating the Config File

To create the config file, create a new file called config.js in the root directory of your project. In this file, you will be storing the secret key, secret iv, and encryption method. The secret key and secret iv are used to generate the secret hash, which is used for encryption and decryption. The encryption method is used to specify the encryption algorithm to use. In this tutorial, we will be using the AES-256 algorithm.

```javascript
// config.js
import dotenv from 'dotenv'

dotenv.config()

const { NODE_ENV, PORT, SECRET_KEY, SECRET_IV, ECNRYPTION_METHOD } = process.env

export default {
  env: NODE_ENV,
  port: PORT,
  secret_key: SECRET_KEY,
  secret_iv: SECRET_IV,
  ecnryption_method: ECNRYPTION_METHOD,
}
```

> NOTE: The config file is imported in the encryption.js file, so you need to make sure that the config file is in the same directory as the encryption.js file.

## Creating the Server File

To create the server file, create a new file called server.js in the root directory of your project.

```javascript
// server.js
import express from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
```

> This will create a new express server and listen on port 3000.

## Creating the encryption Module

To create the encryption module, create a new file called encryption.js in the root directory of your project.
<br>
In this file, you will be importing the crypto module and the config file. The config file contains secret_key, secret_iv, and ecnryption_method.

These variables are then assigned to their own variables. If any of these variables are missing, an error is thrown.

A secret hash is then generated with crypto to use for encryption. This hash is created using the sha512 method and the secret_key and secret_iv from the config file. The hash is then cut down to 32 characters for the key and 16 characters for the iv.

> NOTE: iv stands for **initialization vector.** The initialization vector is a random value that is used to encrypt the first block of plaintext. The initialization vector is required to decrypt the ciphertext, so it must be transmitted or stored alongside the ciphertext.

Two functions are then exported: encryptData() and decryptData(). The encryptData() function takes in data as an argument and uses the cipheriv method from crypto to encrypt it, converting it to hexadecimal format before converting it to base64 format. The decryptData() function takes in encrypted data as an argument, converts it to utf8 format before using decipheriv from crypto to decrypt it, converting it back to utf8 format.

```javascript
// encryption.js
import crypto from 'crypto'
import config from './config.js'

const { secret_key, secret_iv, ecnryption_method } = config

if (!secret_key || !secret_iv || !ecnryption_method) {
  throw new Error('secretKey, secretIV, and ecnryptionMethod are required')
}

// Generate secret hash with crypto to use for encryption
const key = crypto
  .createHash('sha512')
  .update(secret_key)
  .digest('hex')
  .substring(0, 32)
const encryptionIV = crypto
  .createHash('sha512')
  .update(secret_iv)
  .digest('hex')
  .substring(0, 16)

// Encrypt data
export function encryptData(data) {
  const cipher = crypto.createCipheriv(ecnryption_method, key, encryptionIV)
  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64') // Encrypts data and converts to hex and base64
}

// Decrypt data
export function decryptData(encryptedData) {
  const buff = Buffer.from(encryptedData, 'base64')
  const decipher = crypto.createDecipheriv(ecnryption_method, key, encryptionIV)
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  ) // Decrypts data and converts to utf8
}
```

## Creating the Routes

To create the routes, create a new file called routes.js in the root directory of your project.

In this file, you will be importing the express router and the encryption module. The encryption module contains the encryptData() and decryptData() functions.

The encryptData() function is used to encrypt the data sent in the request body and the decryptData() function is used to decrypt the data sent in the request body.

```javascript
// routes.js
import express from 'express'
import { encryptData, decryptData } from './encryption.js'

const router = express.Router()

router.post('/encrypt', (req, res) => {
  const { data } = req.body
  const encryptedData = encryptData(data)
  res.json({ encryptedData })
})

router.post('/decrypt', (req, res) => {
  const { encryptedData } = req.body
  const data = decryptData(encryptedData)
  res.json({ data })
})

export default router
```

## Creating the .env File

To create the .env file, create a new file called .env in the root directory of your project.

In this file, you will be storing the secret_key, secret_iv, and encryption_method. The secret_key and secret_iv are used to generate the secret hash, which is used for encryption and decryption. The encryption_method is used to specify the encryption algorithm to use.

In this tutorial, we will be using the AES-256 algorithm.

```bash

NODE_ENV=development
PORT=3000
SECRET_KEY=secretKey
SECRET_IV=secretIV
ECNRYPTION_METHOD=aes-256-cbc

```

> NOTE: The .env file is imported in the config.js file, which is used to store the secret_key, secret_iv, and encryption_method.

## Creating the .gitignore File

To create the .gitignore file, create a new file called .gitignore in the root directory of your project. In this file, you will be ignoring the node_modules folder and the .env file.

```bash
node_modules
.env
```

## Importing the Routes in the Server File

To import the routes in the server file, import the routes file in the server.js file. Our updated server.js file will look like this:

```javascript
// server.js
import express from 'express'
import routes from './routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(routes)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
```

## Testing the API

To test the API, start the server by running the following command in the terminal:

```bash
yarn dev
```

> NOTE: The dev script is defined in the package.json file.

To test the encrypt route, send a POST request to http://localhost:3000/encrypt with the following data in the request body:

```json
{
  "data": "Hello World"
}
```

To test the decrypt route, send a POST request to
http://localhost:3000/decrypt with the following data in the request body:

```json
{
  "data": "encryptedData"
}
```

## Conclusion

In this tutorial, you learned how to create an API that encrypts and decrypts data using Node.js and Express. You also learned how to use the crypto module to encrypt and decrypt data.

You can find the source code for this tutorial on [GitHub](https://github.com/jobizil/encrypt-data-in-nodejs) repo.

If you have any questions, feel free to ask them in the comments section below.

Happy coding!

## References

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Crypto](https://nodejs.org/api/crypto.html)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [GitHub](https://github.com)
