import zod from "zod";

export const urlSchema = zod.object({
   
    longUrl : zod.string().startsWith("http").url("Must be an http/https URL"),
    shortUrl:zod.string().max(15,{error:"Max 15 letter should be there"}).optional()
})