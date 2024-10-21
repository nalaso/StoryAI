import { utapi } from "@/lib/uploadthing";

export async function POST(req: Request) {
  const { imageURLs } = await req.json();

  const uploadedFiles = await utapi.uploadFilesFromUrl(imageURLs);

  console.log(uploadedFiles);
  
  return new Response(JSON.stringify({
    uploadedFiles,
  }), {
    headers: {
      'content-type': 'application/json',
    },
  });
}
