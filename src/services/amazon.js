import aws, { S3 } from 'aws-sdk'
import dotenv from 'dotenv'
dotenv.config({silent: true});


const getS3Url = (req, res)=>{
    const file_name = req['file_name'];
    const file_type = req['file_type'];
    const requestParams = {
        Bucket : process.env.BUCKET_NAME,
        Key : file_name,
        contentType : file_type,
        Expires : 60,
        ACL : 'public-read'
    }

    const S3 = new aws.S3();
    S3.getSignedUrl('putObject', requestParams, (error, data)=>{
        if(error) throw new Error('error uploading a file');
        returnData = {
            Data : data,
            url : `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${fileName}`
        }
        return res.send(JSON.stringify(returnData));
    })
}

export default getS3Url;
