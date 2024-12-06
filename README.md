This is a [Next.js](https://nextjs.org) front end bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Clone and pull the repo.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## AWS Setup

Create an S3 bucket, and in the Permissions tab paste this into the CORS tab.
```
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "POST", "GET", "DELETE"],
    "AllowedOrigins": ["*"], 
    "ExposeHeaders": ["ETag"]
  }
]
```
In the repo, you will need to create a .env file with the following information in it*:
```
NEXT_PUBLIC_AWS_REGION="eu-west-1"
NEXT_PUBLIC_AWS_BUCKET_NAME="new_bucket_name"
NEXT_PUBLIC_AWS_ACCESS_KEY_ID="AWS IAM user access key id"
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY="AWS IAM user access key"
```

*The IAMS User account will need to have S3:Put permissions, which should be included as part of Administrator Access.

Now you should be able to upload csv files to the S3 bucket.

