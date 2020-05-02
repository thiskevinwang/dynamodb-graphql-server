import type { ResolverFn } from "resolvers/ResolverFn"
import { getUserId } from "../../utils"

type Args = {
  fileName: string
  fileType: "image/jpeg" | "image/png"
  fileSize: number
}
type Response = {
  signedPutObjectUrl: string
  objectUrl: string
}

/**
 * Get a signed s3 url to POST an image to S3
 */
export const s3GetSignedPutObjectUrl: ResolverFn<Response, Args> = async (
  parent,
  { fileName, fileType, fileSize },
  context,
  info
) => {
  const userId = getUserId(context)
  if (!userId) throw new Error("You're not allowed to do that")
  if (fileSize > 10000000) throw new Error("File size cannot exceed 10mb")
  const { s3 } = context

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    // 1 minute expiry
    Expires: 60,
    ContentType: fileType,
    ACL: "public-read",
  }

  const signedPutObjectUrl = s3.getSignedUrl("putObject", params)
  const objectUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`

  return {
    signedPutObjectUrl,
    objectUrl,
  }
}
