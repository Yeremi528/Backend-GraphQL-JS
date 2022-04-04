const { PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const bcryptjs = require("bcryptjs")
require('dotenv').config({ path: '.env' });



const jwt = require('jsonwebtoken')


const crearToken = (usuario, secreta, expiresIn) => {
    // console.log(usuario);
    const { id, email,nombre, apellido } = usuario;

    return jwt.sign( { id, email, nombre, apellido }, secreta, { expiresIn } )
}


const resolvers = {
    Query:{
        auto: async() =>  {
            return prisma.auto.findMany({
                where:{
                    authorId:1
                }
            })
        },
        obtenerPedidos: async(_,) => {
            return prisma.pedidos.findMany()
        },
        obtenerClientes: async(_,{},ctx) => {
            try{
                const clientes = await prisma.cliente.findMany()
                return clientes
            }catch (error){
                console.log(error)
            }
        },
        obtenerClienteVendedor:async (_,{},ctx) => {
            try{
                const clientes = await prisma.cliente.findMany({
                    where:{
                        userId:ctx.usuario.id
                    }
                })
                return clientes
            }catch(error){
                console.log("Este vendedor no tiene clientes")
            }
        },
        obtenerCliente: async(_, {id } ,ctx ) => {
            //Revisar si el cliente existe o no
            const cliente = await prisma.cliente.findUnique({
                where:{
                    id:Number(id)
                }
            })
            if(!cliente){
                throw new Error("Cliete no encontrado")
            }
            if(cliente.userId.toString() !== ctx.usuario.id) {
                throw new Error("No tienes las credenciales");
            }
            return cliente
            //Quien lo creo puede verlo
        }
        
    },
    Mutation:{
        signup : async (_,{input}) => {
            const {name,apellido,email,password} = input
            //Validar que existe usuario
            const userValidate = await prisma.user.findUnique({
                where:{
                    email
                }
            })
            if(userValidate){
                return{
                    userErrors:[{
                        message:"Usuario ya existente"
                    }],user:null
                }
            }
            //Hashear Clave
            const hashedPassword =  await bcryptjs.hash(password,10)
            
            
            const user =  await prisma.user.create({
                data:{
                    name,
                    apellido,
                    email,
                    password:hashedPassword
                }
            })
            return {
                userErrors:[],
                user
            }
        },
        singin : async (_,{input}) => {
            const {email,password} = input
            //Validar si el usuario existe
            const user = await prisma.user.findUnique({
                where:{
                    email
                },
            });
            if(!user){
                throw new Error("El usuario no existe")
            }

             const passwordCorrecto = await bcryptjs.compare( password, user.password );

            if(!passwordCorrecto){
                throw new Error("La clave no es correcta")
            }
            return { 
                token: crearToken(user,process.env.SECRETA, '8h')
            }
        },
        crearAuto: async (_,{input}) => {
            const {titulo,descripcion,imagen,precio} = input
            if(!titulo,!descripcion,!imagen,!precio){
                return {
                    userErrors:[{
                        message: "Faltan datos"
                    }]
                }
            }
            const auto = await prisma.auto.create({data:{  
                authorId:1,
                titulo,
                descripcion,
                imagen,
                precio,
            }})
           return {
               userErrors:[],
               auto
           }
        },
        actualizarAuto: async(_,{autosId,input}) => {
            const {titulo,descripcion,imagen,precio} = input

            const  ExistenAutos = await prisma.auto.findUnique({
                where:{
                    id: Number(autosId)
                }
            })
            if(!ExistenAutos){
                return {
                    userErrors:[{
                        message:"Auto no encontrado"
                    }],auto:null
                }
            }
            let payloadToUpdate = {
                titulo,
                descripcion,
                imagen,
                precio
            }
            
            return {
                userErrors:[],
                autos : await prisma.auto.update({
                data:{
                    ...payloadToUpdate
                },
                where:{
                    id:Number(autosId)
                }
            })
            }
        },
        eliminarAuto:async (_,{autosId}) => {
            const ExisteAuto = await prisma.auto.findUnique({
                where:{
                    id: Number(autosId)
                }
            })
            if(!ExisteAuto){
                return{
                    userErrors:[{
                        message: "Auto no encontrado"
                    }]
                }
            }
            const auto = await prisma.auto.delete({
                where:{
                    id: Number(autosId)
                }
            })

            return {
                userErrors:[],
                auto
            }
        },
        crearPedido: async (_,{input}) => {
            const {titulo,contenido,precio} = input
            if(!titulo && !contenido && !precio){
                return{
                    userErrors:[{
                        message:"Faltan datos"
                    }]
                }
            }

            return {
                userErrors:[],
                pedidos: prisma.pedidos.create({
                    data:{
                        contenido,
                        precio,
                        titulo,
                        clienteId:1
                    }
                })
            }
        },
        actualizarPedido: async(_,{pedidoId,input}) => {
            const {titulo,contenido,precio} = input
            const buscarPedido = await prisma.pedidos.findUnique({
                where:{
                    id: Number(pedidoId)
                }
            })
            if(!buscarPedido){
                return{
                    userErrors:[{
                        message:"Pedido no encontrado"
                    }]
                }
            }
            let payloadUpdate = {
                titulo,contenido,precio
            }
            return{
                userErrors:[],
                pedidos: prisma.pedidos.update({
                    data:{
                        ...payloadUpdate
                    },
                    where:{
                        id:Number(pedidoId)
                    }
                })
            }  
        },
        eliminarPedido:async(_,{pedidoId}) => {
            const buscarPedido = await prisma.pedidos.findUnique({
                where:{
                    id: Number(pedidoId)
                }
            })
            if(!buscarPedido){
                return{
                    userErrors:[{
                        message: "Pedido no existente"
                    }]
                }
            }
        },
        nuevoCliente: async(_,{input},ctx) => {
            const {name,apellido,password,email,empresa,telefono} = input
            console.log(ctx)
            const existeCliente = await prisma.cliente.findUnique({
                where:{
                    email
                }
            })
            if(existeCliente){
                throw new Error("Usuario ya existe")
            }
            const cliente = await prisma.cliente.create({
                data:{
                    email,
                    apellido,
                    password,
                    empresa,
                    name,
                    telefono,
                    userId:ctx.usuario.id
                }
            })
            return {
                cliente
            }
            
            
        
        },
        actualizarCliente : async (_,{id,input},ctx) => {
            const {name,apellido,empresa,email,telefono} = input
            //Verificar si existe o no
            let cliente = await prisma.cliente.findUnique({
                where:{
                    id: Number(id)
                }
            })
            if(!cliente){
                throw new Error("El cliente no fue encontrado")
            }
            //Verificar quien lo edita
            if(cliente.userId.toString !== ctx.usuario.id){
                throw new Error("No tienes las credenciales")
            }

            let payloadToUpdate = {
                name,apellido,email,empresa,telefono
            }
            //Guardar el Cliente
            const clienteActualizado= await prisma.cliente.update({
                data:{
                    ...payloadToUpdate
                },
                where:{
                    id:Number(id)
                }
            })
            return {
                clienteActualizado
            }
        },
        eliminarCliente:async(  _,{id} , ctx ) => {
            const cliente = await prisma.cliente.findUnique({
                where:{
                     id: Number(id)
                }
            })
            if(!cliente){
                throw new Error("No existe el Usuario")
            }
            if(cliente.userId.toString !== ctx.usuario.id) {
                throw new Error("No tienes las credenciales para hacer las modificaciones")
            }

            await prisma.cliente.delete({
                where:{
                    id: Number(id)
                }
            })
            return "Cliente Eliminado"
        }

    
        
    },
}

module.exports = resolvers