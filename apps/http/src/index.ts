import { prismaClient } from "@repo/db/client";
import express from "express";
import { urlSchema } from "@repo/common/type";
import { nanoid } from "nanoid";
import dotenv from "dotenv"
import cors from "cors"
dotenv.config({path:"../.env"})
const app = express();
app.use(cors())
app.use(express.json());
const baseUrl =process.env.BACKEND_URL
app.post("/url", async (req, res) => {
    try {
        const urlPayLoad = urlSchema.safeParse(req.body);
        if (!urlPayLoad.success) {
            return res.status(411).json({
                message: "Data doesmt valid"
            });
        }
        const shortParams = nanoid(6);
       const matchLongUrl = await prismaClient.url.findFirst({
        where:{
            longUrl:urlPayLoad.data.longUrl
        }
       })
       if(matchLongUrl){
        return res.status(211).json({
            shortUrl:baseUrl+matchLongUrl.shortUrl,
            message:"Done"
        })
       }
        
        const response = await prismaClient.url.create({
            data: {
                longUrl: urlPayLoad.data.longUrl,
                shortUrl: shortParams
            }
        });
        
        if (!response) {
            return res.status(411).json({
                message: "Data doesnt store"
            });
        }
        if (response) {
            return res.status(200).json({
                shortUrl: baseUrl+response.shortUrl,
                message: "Done"
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server down",
            error:error
        });
    }
});

app.get("/:shortUrl",async(req,res)=>{
    try {
        const shortUrl  = req.params.shortUrl;
        console.log(shortUrl)
        const response = await prismaClient.url.findFirst({
            where:{
                shortUrl:shortUrl
            }
        })
        console.log(shortUrl)
        if(!response){
            return res.status(411).json({
                message:"Link is not valid"
            })
        }
        if(response){
            res.redirect(response.longUrl)
        }
    } catch (error) {
        return res.status(500).json({
            message:"Interval server down"
        })
    }
})
app.listen(3002);
