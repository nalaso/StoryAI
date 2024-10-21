import { UTApi } from "uploadthing/server";
export const utapi = new UTApi({
    token: process.env.UPLOADTHING_TOKEN,
});