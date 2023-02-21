import { useEffect, useRef, useState } from 'react';

import usePosts from './hooks/usePosts';

function App() {
  const [skip, setSkip] = useState(0);
  const { posts, error: postsErrors, loading: loadingPosts } = usePosts(skip, 10);

  const innerDivRef = useRef<HTMLDivElement>(null);
  const [scrollDivRef, setScrollDivRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const buffer = 50;
    if (scrollDivRef === null) {
      return;
    }

    const onScroll = () => {
      if (innerDivRef.current === undefined || innerDivRef.current === null) {
        return;
      }

      const { bottom } = scrollDivRef.getBoundingClientRect();
      const { bottom: innerDivBottom } = innerDivRef.current.getBoundingClientRect();

      if (!loadingPosts && bottom >= innerDivBottom - buffer) {
        setSkip((skip) => skip + 10);
      }
    };

    scrollDivRef.addEventListener('scroll', onScroll);

    return () => scrollDivRef.removeEventListener('scroll', onScroll);
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
