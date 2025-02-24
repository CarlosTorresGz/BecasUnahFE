import { BlobServiceClient, AnonymousCredential } from '@azure/storage-blob';

const AZURE_STORAGE_ACCOUNT_NAME = 'storageprojectunah';
const containerName = 'contenedorpictures';
const sasToken = 'sp=racw&st=2025-02-24T19:51:49Z&se=2025-04-25T03:51:49Z&sv=2022-11-02&sr=c&sig=EM79r3Wzz%2FuTP9LBmy0eplE6rs7vhnzdaL84Hq2vBB4%3D';  // Reemplaza con tu token SAS

export const uploadImageToAzure = async (file) => {
    const blobServiceClient = new BlobServiceClient(
        `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net?${sasToken}`,
        new AnonymousCredential()
    );
    console.log('blobServiceClient: ', blobServiceClient);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log('containerClient: ', containerClient);
    const blobName = `${Date.now()}-${file.name}`;
    console.log('blobName: ', blobName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    console.log('blockBlobClient: ', blockBlobClient);

    try {
        await blockBlobClient.uploadData(file, {
            blobHTTPHeaders: {
                blobContentType: file.type
            }
        });
        console.log('url: ', blockBlobClient.url)
        return blockBlobClient.url;
    } catch (error) {
        console.error('Error al subir la imagen:', error.message);
        throw error;
    }
};
