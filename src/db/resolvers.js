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
        hello:() => {"hello"},
        auto: async() =>  {
            return prisma.auto.findMany({
                where:{
                    authorId:1
                }
            })
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
        }
        
    },
}

module.exports = resolvers