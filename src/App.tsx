import { useEffect, useRef, useState } from 'react';

/*
TODO:
- [ ] Load posts from API and show them in a list
- [ ] Show loading indicator when loading posts
- [ ] Show error message when loading posts fails
- [ ] Show user names instead of user IDs for each post
- [ ] Show "No posts" when there are no posts
- [ ] Add limit and show "Load more" button when there are more posts to load
- [ ] Add infinite scrolling
*/

/*
Endpoints:
Posts: `${import.meta.env.VITE_API_BASE_URL}/posts?limit=${limit}&skip=${skipAmount}`
User: `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`
*/

function App() {
  return (
    <main className="flex flex-col h-screen w-screen p-5">
      <h1 className="font-bold text-3xl">Welcome!</h1>
    </main>
  );
}

export default App;
