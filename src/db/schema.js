
const {gql} =require("apollo-server")
const typeDefs = gql`
    type Query {
        obtenerPedidos:[Pedidos]
        auto: [Auto]

        obtenerClientes: [Cliente]
        obtenerClienteVendedor: [Cliente]
        obtenerCliente(id:ID):Cliente
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

        nuevoCliente(input:ClienteInput):ClientePayload
        actualizarCliente(id:ID!, input:ClienteInput):Cliente
        eliminarCliente(id:ID) :String
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
        userId:ID
        
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
    input ClienteInput {
        name:String
        apellido:String
        empresa:String
        email:String
        telefono:String
         
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
    type ClientePayload {
        
        cliente:Cliente
    }
    `
    module.exports = typeDefs