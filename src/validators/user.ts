import {z} from "zod"

const createUserSchema = z.object({
    username:z.string().min(8),
    password:z.string().min(8),
    email:z.string().email(),
})

const loginUserSchema = z.object({
    email:z.string().email().min(8),
    password:z.string().min(8)
})

const tokenSchema = z.object({
    refreshToken:z.string()
})

export const userValidator = {
    createUserSchema,loginUserSchema,tokenSchema
}
