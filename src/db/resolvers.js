const { PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const bcryptjs = require("bcryptjs")

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



        }
    },
}

module.exports = resolvers