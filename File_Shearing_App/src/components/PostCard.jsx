import React from 'react'
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featureImage, fileType }) {

    const fileUrl = appwriteService.getFilePreview(featureImage)

    const isImage = fileType?.startsWith('image/')

    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-gray-100 rounded-xl p-4'>

                <div className='w-full justify-center mb-4'>

                    {isImage ? (
                        <img
                            src={fileUrl}
                            alt={title}
                            className='rounded-xl w-full'
                        />
                    ) : (
                        <div className='p-8 text-center bg-gray-200 rounded-xl'>
                            <p className='text-lg font-semibold'>
                                {title}
                            </p>
                            <p className='text-sm text-gray-600'>
                                {fileType || 'Document'}
                            </p>
                            <a
                                href={fileUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                onClick={(e) => e.stopPropagation()}
                                className='text-blue-600 underline'
                            >
                                Open File
                            </a>
                        </div>
                    )}

                </div>

                <h2 className='text-xl font-bold'>
                    {title}
                </h2>

            </div>
        </Link>
    )
}

export default PostCard