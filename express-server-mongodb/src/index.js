const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const {ApolloServer, AuthenticationError} = require('apollo-server-express')
const schemas = require('./schemas');
const resolvers = require('./resolvers');

const userModel = require('./models/userModel');
const postModel = require('./models/postModel');

const app = express();
app.use(cors());

const getUser = async (req) => {
    const token = req.headers['token'];

    if (token) {
        try {
            return await jwt.verify(token, "special")
        } catch (e) {
            throw new AuthenticationError('Your session expired, sign in again.')
        }
    }
}

const server = new ApolloServer({
    typeDefs: schemas,
    resolvers,
    context: async ({req}) => {
        if (req) {
            const user = await getUser(req);

            return {
                user,
                models: {
                    userModel,
                    postModel
                }
            }
        }
    }
})

server.applyMiddleware({
    app,
    path: "/graphql"
})

app.listen(5000, () => {
    mongoose.connect("mongodb://localhost/express-server-mongodb-example")
})