const {ApolloServer} = require("apollo-server")

const  resolvers = require("./db/resolvers")
const  typeDefs  = require("./db/schema")




const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Servidor corriendo en el puerto ${url}`)
})