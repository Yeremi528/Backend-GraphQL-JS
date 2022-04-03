
const {gql} =require("apollo-server")
const typeDefs = gql`
    type Query {
        hello:String
    }
    type Mutation {
        signup(input:NuevoUsuario):AuthPayload
        singin(input:Credentials):AuthSignPayload
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
    input Credentials {
        email:String!
        password:String!
    }
    type AuthSignPayload {
        token:String!
        signError: [SignError!]!
    }
    type SignError{
        message:String
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