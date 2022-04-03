const { PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

const resolvers = {
    Mutation:{
        signup : async (_,{input}) => {
            const {name,apellido,email,password} = input 
            const user =  await prisma.user.create({
                data:{
                    name,
                    apellido,
                    email,
                    password
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