import React from "react";
import PostCard, { PostSummary } from "components/post-card";

type Props = {
  posts: PostSummary[];
};

export default function PostCardList({ posts }: Props) {

  return (
    <div className="post-card-list">
      {posts.map((post: PostSummary) => <PostCard post={post} />)}
    </div>
  );
}
