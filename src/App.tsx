// import { useQuery } from '@tanstack/react-query';
import { type JSX, useState } from 'react';

import { useQuery } from '~custom-react-query';

export interface Posts {
  title: string;
}

export interface Post {
  name: string;
  description: string;
}

const state: {
  posts: Post[];
} = {
  posts: [
    { name: 'Title 1', description: 'This is post 1' },
    { name: 'Title 2', description: 'This is post 2' },
  ],
};

const fetchPosts = (): Promise<Post[]> => {
  // eslint-disable-next-line no-console
  console.log('fetching posts');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(state.posts);
    }, 1000);
  });
};

const usePostsQuery = () =>
  useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5000,
  });

const Posts = ({ title }: Posts) => {
  const { status, isFetching, error, data } = usePostsQuery();

  if (status === 'pending') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error.message}</div>;
  }

  return (
    <div className="p-5">
      <h1>{title}</h1>
      {isFetching && <p>Refetching...</p>}
      {data &&
        data.map((post) => (
          <div key={post.name}>
            <h3>{post.name}</h3>
            <p>{post.description}</p>
          </div>
        ))}
    </div>
  );
};

export const App = (): JSX.Element => {
  const [showPosts1, setShowPosts1] = useState(true);
  const [showPosts2, setShowPosts2] = useState(true);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShowPosts1(!showPosts1);
        }}
      >
        Toggle Posts 1
      </button>
      <button
        type="button"
        onClick={() => {
          setShowPosts2(!showPosts2);
        }}
      >
        Toggle Posts 2
      </button>
      <div className="flex">
        {showPosts1 && <Posts title="Posts 1" />}
        {showPosts2 && <Posts title="Posts 2" />}
      </div>
    </>
  );
};
