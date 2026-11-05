import conf from "../conf/conf";
import { Client, TablesDB, Query, Storage, ID } from "appwrite";

export class Service {
    client = new Client();
    database;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.database = new TablesDB(this.client);
        this.bucket = new Storage(this.client);
    }

    // CREATE POST
    async createPost({
        title,
        slug,
        content,
        featuredImage,
        status,
        userId,
        fileType
    }) {
        try {
            return await this.database.createRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug,
                data: {
                    title,
                    slug,
                    content,
                    featuredImage,
                    status,
                    userId,
                    fileType
                }
            });
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            throw error;
        }
    }

    // UPDATE POST
    async updatePost(rowId, {
        title,
        content,
        featuredImage,
        status,
        fileType
    }) {
        try {
            const data = {
                title,
                content,
                status
            };

            if (featuredImage !== undefined) {
                data.featuredImage = featuredImage;
            }

            if (fileType !== undefined) {
                data.fileType = fileType;
            }

            return await this.database.updateRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId,
                data
            });
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
            throw error;
        }
    }

    // DELETE POST
    async deletePost(rowId) {
        try {
            await this.database.deleteRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId
            });

            return true;
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    // GET SINGLE POST
    async getPost(rowId) {
        try {
            return await this.database.getRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId
            });
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false;
        }
    }

    // GET ALL POSTS
    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.database.listRows({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                queries
            });
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    // UPLOAD FILE
    async uploadFile(file) {
        try {
            return await this.bucket.createFile({
                bucketId: conf.appwriteBucketId,
                fileId: ID.unique(),
                file
            });
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    // DELETE FILE
    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile({
                bucketId: conf.appwriteBucketId,
                fileId
            });

            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    // IMAGE PREVIEW
    getFilePreview(fileId) {
        return this.bucket.getFilePreview({
            bucketId: conf.appwriteBucketId,
            fileId
        });
    }

    // DOCUMENT / FILE VIEW
    getFileView(fileId) {
        return this.bucket.getFileView({
            bucketId: conf.appwriteBucketId,
            fileId
        });
    }
}

const service = new Service();

export default service;
