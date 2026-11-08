import React from 'react'
import { Link } from 'react-router-dom'

function PostCard({ $id, Title }) {

    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full bg-gray-100 rounded-xl p-4'>
                <h2 className='text-xl font-bold'>
                    {Title}
                </h2>
            </div>
        </Link>
    )
}

export default PostCard