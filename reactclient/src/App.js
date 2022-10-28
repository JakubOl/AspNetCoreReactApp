import React, { useState } from "react";
import Constants from "./utilites/Constants";
import PostCreateFrom from "./components/PostCreateForm";
import PostUpdateForm from "./components/PostUpdateForm";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [showingCreateNewPostForm, setShowingCreateNewPostForm] =
    useState(false);
  const [postCurrentlyBeingUpdated, setPostCurrentlyBeingUpdated] =
    useState(false);

  function getPosts() {
    const url = Constants.API_URL_GET_ALL_POSTS;

    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((postsFromServer) => {
        setPosts(postsFromServer);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  return (
    <div className="container">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          {showingCreateNewPostForm === false &&
            postCurrentlyBeingUpdated === null && (
              <div>
                <h1 className="text-black">ASP.NET React Tutorial</h1>
                <div className="mt-5">
                  <button
                    onClick={getPosts}
                    className="btn btn-dark btn-lg w-100"
                  >
                    Get Posts from server
                  </button>
                  <button
                    onClick={() => setShowingCreateNewPostForm(true)}
                    className="btn btn-secondary btn-lg w-100 mt-4"
                  >
                    Create New Post
                  </button>
                </div>
              </div>
            )}

          {posts.length > 0 &&
            showingCreateNewPostForm === false &&
            postCurrentlyBeingUpdated === null &&
            renderPostsTable()}

          {showingCreateNewPostForm && (
            <PostCreateFrom onPostCreated={onPostCreated} />
          )}

          {postCurrentlyBeingUpdated !== null && (
            <PostUpdateForm
              post={postCurrentlyBeingUpdated}
              onPostCreated={onPostUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );

  function renderPostsTable() {
    return (
      <div className="table-responsive mt-5">
        <table className="table table-bordered border-dark">
          <thead>
            <tr>
              <th scope="col">PostId (PK)</th>
              <th scope="col">Title</th>
              <th scope="col">Content</th>
              <th scope="col">CRUD Operations</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              return (
                <tr key={post.postId}>
                  <th scope="row">{post.postId}</th>
                  <td>{post.title}</td>
                  <td>{post.content}</td>
                  <td>
                    <button
                      className="btn btn-dark btn-lg mx-3 my-3"
                      onClick={() => setPostCurrentlyBeingUpdated(post)}
                    >
                      Update
                    </button>
                    <button className="btn btn-secondary btn-lg">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          onClick={() => setPosts([])}
          className="btn btn-dark btn-lg w-100"
        >
          Empty React posts array
        </button>
      </div>
    );
  }

  function onPostCreated(createdPost) {
    setShowingCreateNewPostForm(false);

    if (createdPost === null) {
      return;
    }

    alert(
      `Post successfully created. After clicking OK, your new post tilted "${createdPost.title}" `
    );

    getPosts();
  }

  function onPostUpdated(updatedPost) {
    setPostCurrentlyBeingUpdated(null);

    if (updatedPost === null) {
      return;
    }

    let postsCopy = [...posts];

    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if (postsCopyPost.postId === updatedPost.postId) {
        return true;
      }
    });

    if (index !== -1) {
      postsCopy[index] = updatedPost;
    }

    setPosts(postsCopy);

    alert(
      `Post successfully updated, after clicking OK look for the post with the title "${updatedPost.title}" in the table below to see updates.`
    );
  }
}
