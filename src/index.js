const {ApolloServer} = require("apollo-server")

const  resolvers = require("./db/resolvers")
const  typeDefs  = require("./db/schema")




const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        // console.log(req.headers['authorization'])

        // console.log(req.headers);

        const token = req.headers['authorization'] || '';
        if(token) {
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA );
                // console.log(usuario);
                return {
                    usuario
                }
            } catch (error) {
                console.log('Hubo un error');
                console.log(error);
            }
        }
    }
})

server.listen().then(({url}) => {
    console.log(`Servidor corriendo en el puerto ${url}`)
})