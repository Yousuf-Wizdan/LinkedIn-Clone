import{
    BlobServiceClient,
    StorageSharedKeyCredential,
    BlobSASPermissions,
    generateBlobSASQueryParameters,
} from '@azure/storage-blob';

export const containerName = 'posts';

const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const accountName = process.env.AZURE_STORAGE_NAME;

if(!accountKey || !accountName){
    throw new Error('Azure Storage account name and key are required')
}

const sharedKeyCredentials = new StorageSharedKeyCredential(
    accountName,
    accountKey
)

const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredentials
)

async function generateSAStoken(){
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const permissons = new BlobSASPermissions();
    permissons.write = true;
    permissons.create = true;
    permissons.read = true

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);

    const sasToken = generateBlobSASQueryParameters(
        {
            containerName: containerClient.containerName,
            permissions: permissons,
            expiresOn: expiryDate
        },
        sharedKeyCredentials
    ).toString()

    return sasToken;
}

export default generateSAStoken;