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



        }
    },
}

module.exports = resolvers