import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3'

const defaultS3Bucket = process.env.S3_BUCKET || 'mcbrawl'

const s3 = new S3Client({
    region: process.env.S3_REGION || 'ru-central-0',
    endpoint: process.env.S3_URL || 'http://localhost:9000',
    credentials: {
        accessKeyId: process.env.S3_KEY_ID || 'minioadmin',
        secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
    },
    forcePathStyle: true
})

export const upload = async (file, key) => {
    let resultKey = key

    while (true) {
        try {
            const checkCommand = new GetObjectCommand({
                Bucket: defaultS3Bucket,
                Key: resultKey
            })    
            await s3.send(checkCommand)
            const appendix = new Date().getTime()
            const fileNameNoExt = key.substring(0, key.lastIndexOf('.'))
            const ext = key.substring(key.lastIndexOf('.'), key.length)

            resultKey = fileNameNoExt + appendix + ext
        } catch (error) {
            if (error.Code === 'NoSuchKey') {
                const putCommand = new PutObjectCommand({
                    Bucket: defaultS3Bucket,
                    Key: resultKey,
                    Body: file
                })
                await s3.send(putCommand)
                return resultKey
            }
        }
    }
}

export const get = async (key) => {
    const getCommand = new GetObjectCommand({
        Bucket: defaultS3Bucket,
        Key: key
    })    
    const response = await s3.send(getCommand)

    return await response.Body.transformToByteArray()
}

export const list = async () => {      
    const listCommand = new ListObjectsCommand({
        Bucket: defaultS3Bucket,
    })

    const listData = await s3.send(listCommand)

    const folders = {}

    for (const file of listData.Contents) {
        const folder = file.Key.substring(0, file.Key.indexOf('/'))

        if (!folders[folder]) folders[folder] = []

        folders[folder].push(`/images/${file.Key}`)
    }

    const response = []

    for (const folder of Object.keys(folders)) {
        response.push({ folder: folder, images: folders[folder] })
    }

    return response
}

get('privileges/anonimous.png')