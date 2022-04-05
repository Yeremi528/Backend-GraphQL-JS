
const {gql} =require("apollo-server")
const typeDefs = gql`
    type Query {
        obtenerProductos:[Productos]
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

        crearProducto(input:InputProducto):ProductoPayload
        actualizarProducto(productoId:ID,input:InputProducto):ProductoPayload
        eliminarProducto(productoId:ID):ProductoPayload

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
        productos: [Productos]
        userId:ID
        
    }
    type Productos {
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
    input InputProducto{
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
    type ProductoPayload {
        userErrors: [UserErrors!]!
        productos:Productos
    }
    type ClientePayload {
        
        cliente:Cliente
    }
    `
    module.exports = typeDefs