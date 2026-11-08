import conf from '../conf/conf.js';
import { Client, ID, TablesDB, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new TablesDB(this.client);
        this.bucket = new Storage(this.client);
    }

    // Create Post
    async createPost({ Title, slug, content, featureimage, status, userid, attachments }) {
        try {
            return await this.databases.createRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug,
                data: {
                    Title: Title,
                    content: content,
                    featureimage: featureimage,
                    status: status,
                    userid: userid,
                    attachments: attachments,
                }
            });
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            return false;
        }
    }

    // Update Post
    async updatePost(slug, { Title, content, featureimage, status }) {
        try {
            return await this.databases.updateRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug,
                data: {
                    Title: Title,
                    content: content,
                    featureimage: featureimage,
                    status: status,
                }
            });
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
            return false;
        }
    }

    // Delete Post
    async deletePost(slug) {
        try {
            await this.databases.deleteRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug
            });

            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    // Get Single Post
    async getPost(slug) {
        try {
            return await this.databases.getRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug
            });
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false;
        }
    }

    // Get All Posts
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listRows({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                queries: queries
            });
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    // File Upload Service
    async uploadFile(file) {
        try {
            return await this.bucket.createFile({
                bucketId: conf.appwriteBucketId,
                fileId: ID.unique(),
                file: file
            });
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    // Delete File
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile({
                bucketId: conf.appwriteBucketId,
                fileId: fileId
            });

            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    // Get File Preview
    getFileView(fileId) {
        return this.bucket.getFileView({
            bucketId: conf.appwriteBucketId,
            fileId: fileId
        });
    }
    async getFileDetails(fileId) {
    try {
        return await this.bucket.getFile({
            bucketId: conf.appwriteBucketId,
            fileId: fileId
        });
    } catch (error) {
        console.log("Appwrite service :: getFileDetails :: error", error);
        return false;
    }
}
}

const service = new Service();
export default service;
