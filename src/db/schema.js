
const {gql} =require("apollo-server")
const typeDefs = gql`
    type Query {
        hello:String
        auto: [Auto]
    }
    type Mutation {
        signup(input:NuevoUsuario):AuthPayload
        singin(input:Credentials):Token

        crearAuto(input:InputAuto!):AutoPayload
        actualizarAuto(autosId:ID!,input:InputAuto!):AutoPayload
        eliminarAuto(autosId:ID!): AutoPayload

        crearPedido(input:InputPedido):PedidoPayload
        actualizarPedido(pedidoId:ID,input:InputPedido):PedidoPayload
        eliminarPedido(pedidoId:ID):PedidoPayload
    }
    type User {
        id: ID!
        name:String!
        apellido:String!
        email:String!
        password:String!
        autos: [Auto]
    }
    type Cliente{
        id:ID!
        name:String!
        apellido:String!
        telefono:String!
        empresa:String!
        email:String!
        pedidos: [Pedidos]
        vendedor:ID
        
    }
    type Pedidos {
        id:ID
        titulo:String
        contenido:String
        precio:Int
        cliente:Cliente
    }
    type Auto{
        id:         ID!
        titulo:     String!
        imagen:     String! 
        descripcion:String!
        precio:     String!
        user:      User
    
    }
    input InputAuto{
        titulo:     String!
        descripcion:String!
        imagen:     String!
        precio:     Int!
    }
    input InputPedido{
        titulo:String
        contenido:String
        precio:Int
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
    type PedidoPayload {
        userErrors: [UserErrors!]!
        pedidos:Pedidos
    }
    `
    module.exports = typeDefs