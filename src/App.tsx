import { useCallback, useEffect, useRef, useState } from 'react';

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

function App() {
  const [skip, setSkip] = useState(0);
  const { posts, error: postsErrors, loading: loadingPosts } = usePosts(skip, 10);

  const innerDivRef = useRef<HTMLDivElement>(null);
  const [scrollDivRef, setScrollDivRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log('Setting up scroll', scrollDivRef);
    const buffer = 50;
    if (scrollDivRef === null) {
      return;
    }

    scrollDivRef.addEventListener('scroll', () => {
      console.log('scroll detected');
      if (innerDivRef.current === undefined || innerDivRef.current === null) {
        return;
      }

      const { bottom } = scrollDivRef.getBoundingClientRect();
      const { bottom: innerDivBottom } = innerDivRef.current.getBoundingClientRect();

      if (!loadingPosts && bottom >= innerDivBottom - buffer) {
        console.log('incrementing skip');
        setSkip((skip) => skip + 10);
      }
    });
  }, [scrollDivRef]);

  return (
    <main className="flex flex-col h-screen w-screen p-5">
      <h1 className="font-bold text-3xl">Welcome!</h1>

      {loadingPosts && <span>Loading...</span>}

      <div ref={(div) => setScrollDivRef(div)} className="overflow-auto">
        <div ref={innerDivRef}>
          {posts.map((post) => (
            <div className="p-2 shadow-sm" key={post.id}>
              <h2 className="text-xl font-bold">{post.title}</h2>
              <p className="truncate">{post.body}</p>
              <div className="flex justify-between items-center text-center">
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <h3 className="bg-orange-500 text-white p-1 rounded">{tag}</h3>
                  ))}
                </div>

                <h4 className="font-bold">
                  {post.user.firstName} {post.user.lastName}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      <span>{JSON.stringify(postsErrors)}</span>
    </main>
  );
}

export default App;
