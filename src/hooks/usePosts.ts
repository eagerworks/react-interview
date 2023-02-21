import { useEffect, useRef, useState } from 'react';

type PostData = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  userId: string;
};

type User = {
  firstName: string;
  lastName: string;
  age: number;
};

type Post = Omit<PostData, 'userId'> & { user: User };

const usePosts = (skip: number, limit: number) => {
  const totalRef = useRef<number | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      console.log('Requesting ', { skip, limit });
      try {
        let skipAmount = skip;
        if (totalRef.current && skipAmount + limit >= totalRef.current) {
          skipAmount = Math.max(totalRef.current - (skipAmount + limit), 0);
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/posts?limit=${limit}&skip=${skipAmount}`
        );
        const jsonData = (await response.json()) as {
          posts: PostData[];
          total: number;
        };
        totalRef.current = jsonData.total;

        const posts = await Promise.all(
          jsonData.posts.map(async (post) => {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/users/${post.userId}`
            );
            const jsonData = (await response.json()) as User;

            return {
              ...post,
              user: jsonData,
            } as Post;
          })
        );

        if (skip === 0) {
          setPosts(posts);
        } else {
          setPosts((prevPosts) => [...prevPosts, ...posts]);
        }
      } catch {
        setPosts([]);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [skip, limit]);

  return { posts, error, loading };
};

export default usePosts;
