import { gql } from "apollo-server"

export const authTypeDef = gql`
  type S3Payload {
    signedPutObjectUrl: String!
    objectUrl: String!
  }

  type AuthPayload {
    token: String!
  }

  extend type Mutation {
    login(email: String!, password: String!, username: String!): AuthPayload
    signup(
      email: String!
      password: String!
      username: String!
      firstName: String!
      lastName: String!
    ): AuthPayload
    s3GetSignedPutObjectUrl(
      fileName: String!
      """
      A standard MIME type describing thhe format of the object data.
      jpg, jpeg, png, etc.
      """
      fileType: String!
      fileSize: Int!
    ): S3Payload! @auth
  }
`
