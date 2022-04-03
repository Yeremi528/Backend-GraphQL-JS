
const {gql} =require("apollo-server")
const typeDefs = gql`
    type Query {
        hello:String
    }
    type Mutation {
        signup(input:NuevoUsuario):AuthPayload
    }
    type User {
        name:String
        apellido:String
        email:String
        password:String
    }
    input NuevoUsuario {
        name:String
        apellido:String
        email:String
        password:String
        
    }
    type AuthPayload {
        userErrors: [UserErrors!]!
        user:User
    }
    type UserErrors {
        message:String
    }
    `
    module.exports = typeDefs