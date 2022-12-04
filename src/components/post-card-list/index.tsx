import React from "react"
import PostCard, { PostSummary } from "components/post-card"

type Props = {
  posts: PostSummary[]
  showAuthor?: boolean
}

export default function PostCardList({ posts, showAuthor }: Props) {
  return (
    <div className="post-card-list">
      {posts.map((post: PostSummary) => (
        <PostCard
          key={`post-card-${post.id}`}
          post={post}
          showAuthor={showAuthor}
        />
      ))}
    </div>
  )
}
