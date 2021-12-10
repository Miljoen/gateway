const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');
const { readFileSync } = require('fs');

const supergraphSdl = readFileSync('./supergraph.graphql').toString();

const gateway = new ApolloGateway({
    supergraphSdl
});

function authenticate(context) {
    if (context.authScope !== 'hash') {
        throw new Error('Unauthenticated')
    }
}

const server = new ApolloServer({
    gateway,
    context: ({ req }) => authenticate(({ authScope: req.headers.authorization })),
});

server.listen().then(({ url }) => {
    console.log(`🚀 Gateway ready at ${url}`);
}).catch(err => {console.error(err)});