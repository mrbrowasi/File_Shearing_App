import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        getValues,
    } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
            fileType: post?.fileType || "",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        const selectedFile = data.image?.[0];

        if (post) {
            const file = selectedFile
                ? await appwriteService.uploadFile(selectedFile)
                : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
                fileType: selectedFile ? selectedFile.type : post.fileType,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            if (!selectedFile) return;

            const file = await appwriteService.uploadFile(selectedFile);

            if (file) {
                const dbPost = await appwriteService.createPost({
                    ...data,
                    featuredImage: file.$id,
                    fileType: selectedFile.type,
                    userId: userData.$id,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), {
                    shouldValidate: true,
                });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    const selectedFile = watch("image")?.[0];
    const isImage = selectedFile?.type?.startsWith("image/");

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />

                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue(
                            "slug",
                            slugTransform(e.currentTarget.value),
                            { shouldValidate: true }
                        );
                    }}
                />

                <RTE
                    label="Content :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                />
            </div>

            <div className="w-1/3 px-2">
                <Input
                    label="Upload Image / Document :"
                    type="file"
                    className="mb-4"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    {...register("image", { required: !post })}
                />

                {selectedFile && (
                    <div className="mb-4 rounded-lg bg-gray-100 p-3">
                        {isImage ? (
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt="Preview"
                                className="w-full rounded-lg"
                            />
                        ) : (
                            <p className="text-sm font-semibold">
                                Selected file: {selectedFile.name}
                            </p>
                        )}
                    </div>
                )}

                {post && !selectedFile && (
                    <div className="mb-4 rounded-lg bg-gray-100 p-3">
                        <p className="text-sm">
                            Current file: {post.featuredImage}
                        </p>
                        <p className="text-sm">
                            File type: {post.fileType}
                        </p>
                    </div>
                )}

                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />

                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : undefined}
                    className="w-full"
                >
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
