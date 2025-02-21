import {z} from "zod"

export const createProductSchema = z.object({
    name:z.string(),
    image:z.string(),
    description:z.string(),
    price:z.number()
})

