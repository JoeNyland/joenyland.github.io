---
layout: post
title:  "Allow an IAM user access to an S3 bucket"
excerpt: "You'd think it was easy to allow an IAM user access to a specific S3 bucket... Think again."
---

If you follow me on Twitter ([@JoeNyland][1]) you'll probably have noticed that I was banging my head against trying 
to assign an IAM user access to a specific bucket in S3:

<blockquote class="twitter-tweet" lang="en"><p lang="en" dir="ltr">How hard is it to allow an IAM user read write access to one S3 bucket only?</p>&mdash; Joe Nyland (@JoeNyland) <a href="https://twitter.com/JoeNyland/status/653509648490872832">October 12, 2015</a></blockquote> <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

I had completed the simple tasks of creating a user, creating the bucket, generating access keys for the user, but I 
could not work out how to tell S3 that that user could read/write in a specific bucket, but nowhere else. IAM has 
pre-configured ["Managed Policies"][2] which you can use, but the closest policy that I could find to what I was trying 
to do was the "AmazonS3FullAccess" policy, which essentially grants full access to S3 and all buckets in there - not 
what I want!

So I figured that I had to write my own policy to grant access to a specific bucket and assign that policy to the IAM 
user. Seems reasonable. I tried:

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "Stmt1444646654000",
                "Action": [
                    "s3:DeleteObject",
                    "s3:DeleteObjectVersion",
                    "s3:GetObject",
                    "s3:GetObjectVersion",
                    "s3:PutObject"
                ],
                "Effect": "Allow",
                "Resource": "arn:aws:s3:::bucket-name-here"
            }
        ]
    }
    
With the above policy in place, the IAM user was still denied access to the bucket and I received a `403 Forbidden` 
response from the S3 API when my Rails app tried to write into the bucket.

The trick is to terminate the bucket name in the resource ARN with `/*`. So, the above policy would become:

    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "Stmt1444646654000",
                "Action": [
                    "s3:DeleteObject",
                    "s3:DeleteObjectVersion",
                    "s3:GetObject",
                    "s3:GetObjectVersion",
                    "s3:PutObject"
                ],
                "Effect": "Allow",
                "Resource": "arn:aws:s3:::bucket-name-here/*"
            }
        ]
    }
    
After that, the IAM user has read/write access to the S3 bucket and I get a lovely `200 OK` response logged from the 
AWS API in my Rails app logs! Happy days! :tada::dancers::tada:

As awesome as AWS is, this took me far too long to work out from the documentation and in the end I turned to Uncle 
Google for help. If I need to Google how to do something with a service, then the documentation isn't doing it's job, 
is it? In Amazon's defence, AWS is humongous and usually their documentation is up to standard, so I can't get too 
mad at them. :relaxed:

Don't forget to chime in below in the comments section if this helps or if you're facing the same issue and this 
doesn't work for you.

[1]: https://twitter.com/JoeNyland
[2]: https://aws.amazon.com/blogs/aws/new-managed-policies-for-aws-identity-access-management/
