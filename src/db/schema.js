
const {gql} =require("apollo-server")
const typeDefs = gql`
    type Query {
        hello:String
    }
    type Mutation {
        signup(input:NuevoUsuario):AuthPayload
        singin(input:Credentials):Token

        crearAuto(input:NuevoAuto):AutoPayload

    }
    type User {
        id: ID!
        name:String!
        apellido:String!
        email:String!
        password:String!
    }
    type Admin {
        id:         ID!
        name:       String!
        email:      String!
        apellido:   String!
        password:   String!
        autos:      [Auto]
    }
    type Auto{
        id:         ID!
        titulo:     String!
        imagen:     String! 
        descripcion:String!
        precio:     String!
        admin:      Admin
    
    }
    input NuevoAuto{
        titulo:     String!
        descripcion:String!
        imagen:     String!
        precio:     Int!
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
    type Token {
        token:String!
    
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
    type AutoPayload {
        userErrors: [UserErrors!]!
        auto:Auto
    }
    `
    module.exports = typeDefs