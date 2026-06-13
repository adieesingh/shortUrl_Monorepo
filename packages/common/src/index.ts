import zod from "zod";

export const urlSchema = zod.object({
   
    longUrl :zod.string()
})