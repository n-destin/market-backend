import AWS from 'aws-sdk'
import dotenv from 'dotenv'
dotenv.config({silent: true});

const BUCKET_NAME = 'cs52-notify-video-bucket'

const getS3Url = (req, res)=>{
    // console.log(req);
    const file_name = req.query['file_name'];
    const file_type = req.query['file_type'];
    console.log('here is the details about everything' + file_name + ' ' + file_type);
    const requestParams = {
        Bucket : BUCKET_NAME,
        Key : file_name,
        ContentType : file_type,
        Expires : 60,
        ACL : 'public-read'
    }
    // configure the AWS
    AWS.config.update({
        accessKeyId : 'AKIA5GN4K5Z7DECRN6HR',
        secretAccessKey : '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',
        region : 'us-east-1'
    })
    
    const S3 = new AWS.S3();
   try {
         S3.getSignedUrl('putObject', requestParams, (error, data)=>{
            if(error) throw new Error(error.message);
            const returnData = {
                Data : data,
                url : `https://${BUCKET_NAME}.s3.amazonaws.com/${file_name}`
            }
            return res.send(JSON.stringify(returnData));
        })
   } catch (error) {
    console.log(error.message);
   }
}

export default getS3Url;
