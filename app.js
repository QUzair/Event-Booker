const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');
const isAuth = require('./middleware/is-auth')

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');


const app = express();

app.use(bodyParser.json());

app.use(isAuth);

//Middleware where we configure our API
app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}))


mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@productiv-mongo-up9nk.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true })
    .then(() => {
        app.listen(process.env.PORT);
        console.log(`Started server on http://localhost:${process.env.PORT}`)
    })
    .catch(err => {
        console.log(err);
    })

