import zod from "zod";

export const urlSchema = zod.object({
   
    longUrl : zod.string().startsWith("http").url("Must be an http/https URL")
})