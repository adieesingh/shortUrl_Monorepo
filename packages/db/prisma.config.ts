import dotenv from "dotenv"
dotenv.config({path:"../../.env"});

export default ({
  schema: "prisma/schema.prisma",

  datasource: {
    url:process.env.DATABASE_URL, 
  },
});