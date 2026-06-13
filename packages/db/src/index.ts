import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client.js';
import dotenv from "dotenv"
dotenv.config({path:"../../.env"})
const adapter = new PrismaPg({connectionString:process.env.DATABASE_URL})
console.log(adapter)
export const prismaClient = new PrismaClient({adapter})