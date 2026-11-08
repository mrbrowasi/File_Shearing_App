import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [files, setFiles] = useState([]);
    const [post, setPost] = useState(null);

    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData
        ? post.userid === userData.$id
        : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then(async (post) => {
                if (post) {
                    setPost(post);

                    let attachmentIds = [];

                    try {
                        attachmentIds = JSON.parse(post.attachments || "[]");
                    } catch (error) {
                        console.log("Invalid attachments data:", error);
                    }

                    const fileDetails = await Promise.all(
                        attachmentIds.map((id) =>
                            appwriteService.getFileDetails(id)
                        )
                    );

                    setFiles(fileDetails.filter(Boolean));
                } else {
                    navigate("/");
                }
            });
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then(async (status) => {
            if (status) {
                await Promise.all(
                    files.map((file) =>
                        appwriteService.deleteFile(file.$id)
                    )
                );

                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                {isAuthor && (
                    <div className="flex justify-end mb-6">
                        <Link to={`/edit-post/${post.$id}`}>
                            <Button bgColor="bg-green-500" className="mr-3">
                                Edit
                            </Button>
                        </Link>

                        <Button
                            bgColor="bg-red-500"
                            onClick={deletePost}
                        >
                            Delete
                        </Button>
                    </div>
                )}

                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">
                        {post.Title}
                    </h1>
                </div>

                <div className="browser-css">
                    {parse(post.content)}
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">
                        Attached Files
                    </h2>

                    {files.length > 0 ? (
                        files.map((file) => (
                            <div
                                key={file.$id}
                                className="border p-4 rounded-lg mb-3"
                            >
                                <p className="font-semibold">
                                    {file.name}
                                </p>

                                <a
                                    href={appwriteService.getFileView(file.$id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    Open / Download
                                </a>
                            </div>
                        ))
                    ) : (
                        <p>No files attached.</p>
                    )}
                </div>
            </Container>
        </div>
    ) : null;
}
