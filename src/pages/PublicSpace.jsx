import { useState, useEffect } from "react";

import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  Alert,
  LinearProgress,
} from "@mui/material";

import {
  CloudUpload,
  Image as ImageIcon,
  VideoLibrary,
  Favorite,
  FavoriteBorder,
  Share,
  Comment,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const PublicSpace = () => {
  const { t } = useTranslation();

  // ================================
  // UPLOAD STATES
  // ================================

  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================================
  // PUBLIC POSTS
  // ================================

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // ================================
  // COMMENTS
  // ================================

  const [commentText, setCommentText] = useState({});

  // ================================
  // CURRENT USER
  // ================================

  const [currentUserId, setCurrentUserId] = useState("");

  // ================================
  // GET CURRENT USER ID FROM TOKEN
  // ================================

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return "";
      }

      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload.id || "";
    } catch (error) {
      console.error("Token decode error:", error);
      return "";
    }
  };

  // ================================
  // FETCH PUBLIC POSTS
  // ================================

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8000/api/public-posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Fetch Public Posts Error:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  // ================================
  // PAGE LOAD
  // ================================

  useEffect(() => {
    const userId = getCurrentUserId();

    setCurrentUserId(userId);

    fetchPosts();
  }, []);

  // ================================
  // FILE CHANGE
  // ================================

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setError("");
    setMessage("");

    if (!selectedFile) {
      return;
    }

    // Check file type

    if (
      !selectedFile.type.startsWith("image/") &&
      !selectedFile.type.startsWith("video/")
    ) {
      setError(t("publicSpace.onlyImageVideo"));
      return;
    }

    // Check file size

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError(t("publicSpace.fileSizeError"));
      return;
    }

    setFile(selectedFile);
  };

  // ================================
  // LIKE / UNLIKE
  // ================================

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("publicSpace.loginToLike"));
        return;
      }

      if (!currentUserId) {
        setError(t("publicSpace.unableIdentifyUser"));
        return;
      }

      const response = await axios.put(
        `http://localhost:8000/api/public-posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id !== postId) {
            return post;
          }

          let updatedLikes = [...(post.likes || [])];

          if (response.data.liked) {
            const alreadyLiked = updatedLikes.some(
              (id) =>
                id.toString() === currentUserId.toString()
            );

            if (!alreadyLiked) {
              updatedLikes.push(currentUserId);
            }
          } else {
            updatedLikes = updatedLikes.filter(
              (id) =>
                id.toString() !== currentUserId.toString()
            );
          }

          return {
            ...post,
            likes: updatedLikes,
          };
        })
      );
    } catch (error) {
      console.error("Like Error:", error);

      setError(
        error.response?.data?.message ||
          t("publicSpace.likeError")
      );
    }
  };

  // ================================
  // ADD COMMENT
  // ================================

  const handleComment = async (postId, text) => {
    try {
      if (!text || !text.trim()) {
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("publicSpace.loginToComment"));
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/public-posts/${postId}/comment`,
        {
          text: text.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? response.data.post
            : post
        )
      );

      setMessage(t("publicSpace.commentAdded"));
    } catch (error) {
      console.error("Comment Error:", error);

      setError(
        error.response?.data?.message ||
          t("publicSpace.commentError")
      );
    }
  };

  // ================================
  // SHARE POST
  // ================================

  const handleShare = async (postId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("publicSpace.loginToShare"));
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/api/public-posts/${postId}/share`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update share count

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                shareCount: response.data.shareCount,
              }
            : post
        )
      );

      const shareUrl = response.data.shareUrl;

      // Copy share URL

      if (navigator.share) {
        await navigator.share({
          title: t("publicSpace.shareTitle"),
          text: t("publicSpace.shareText"),
          url: shareUrl,
        });

        setMessage(t("publicSpace.linkCopied"));
      } else {
        await navigator.clipboard.writeText(shareUrl);

        setMessage(t("publicSpace.shareSuccess"));
      }
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      console.error("Share Error:", error);

      setError(
        error.response?.data?.message ||
          t("publicSpace.shareError")
      );
    }
  };

  // ================================
  // UPLOAD PUBLIC POST
  // ================================

  const handleUpload = async () => {
    if (!file) {
      setError(t("publicSpace.selectFile"));
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("media", file);
      formData.append("caption", caption);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/api/public-posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message ||
          t("publicSpace.uploadSuccess")
      );

      // Clear form

      setFile(null);
      setCaption("");

      // Refresh posts

      await fetchPosts();

      // Clear file input

      const fileInput = document.getElementById(
        "public-space-file"
      );

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "Public Space Upload Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          t("publicSpace.uploadError")
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // UI
  // ================================

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f7fa",
          py: 5,
        }}
      >
        <Container maxWidth="md">

          {/* ================================
              PAGE HEADING
          ================================= */}

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1f2937",
              mb: 1,
            }}
          >
            {t("publicSpace.title")}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              mb: 4,
            }}
          >
            {t("publicSpace.description")}
          </Typography>

          {/* ================================
              UPLOAD CARD
          ================================= */}

          <Paper
            elevation={2}
            sx={{
              p: 4,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
              }}
            >
              {t("publicSpace.createPost")}
            </Typography>

            {/* FILE UPLOAD */}

            <Box
              sx={{
                border: "2px dashed #cbd5e1",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                mb: 3,
              }}
            >
              <CloudUpload
                sx={{
                  fontSize: 45,
                  color: "primary.main",
                  mb: 1,
                }}
              />

              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  color: "#475569",
                }}
              >
                {t("publicSpace.uploadMedia")}
              </Typography>

              <input
                id="public-space-file"
                type="file"
                accept="image/*,video/*"
                hidden
                onChange={handleFileChange}
              />

              <label htmlFor="public-space-file">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                >
                  {t("publicSpace.chooseFile")}
                </Button>
              </label>

              {/* SELECTED FILE */}

              {file && (
                <Box sx={{ mt: 2 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    alignItems="center"
                  >
                    {file.type.startsWith("image/") ? (
                      <ImageIcon color="primary" />
                    ) : (
                      <VideoLibrary color="primary" />
                    )}

                    <Typography variant="body2">
                      {file.name}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#64748b",
                      mt: 0.5,
                    }}
                  >
                    {(
                      file.size /
                      (1024 * 1024)
                    ).toFixed(2)}{" "}
                    MB
                  </Typography>
                </Box>
              )}
            </Box>

            {/* CAPTION */}

            <TextField
              fullWidth
              multiline
              rows={4}
              label={t("publicSpace.caption")}
              placeholder={t(
                "publicSpace.captionPlaceholder"
              )}
              value={caption}
              onChange={(e) =>
                setCaption(e.target.value)
              }
              inputProps={{
                maxLength: 500,
              }}
              sx={{ mb: 3 }}
            />

            {/* ERROR */}

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
              >
                {error}
              </Alert>
            )}

            {/* SUCCESS */}

            {message && (
              <Alert
                severity="success"
                sx={{ mb: 2 }}
              >
                {message}
              </Alert>
            )}

            {/* UPLOAD BUTTON */}

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<CloudUpload />}
              onClick={handleUpload}
              disabled={loading || !file}
            >
              {loading
                ? t("publicSpace.uploading")
                : t("publicSpace.createPublicPost")}
            </Button>

            {/* PROGRESS */}

            {loading && (
              <LinearProgress sx={{ mt: 2 }} />
            )}

            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "#64748b",
                mt: 2,
                textAlign: "center",
              }}
            >
              {t("publicSpace.maxFileSize")}
            </Typography>
          </Paper>

          {/* ================================
              PUBLIC POSTS
          ================================= */}

          <Box sx={{ mt: 4 }}>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              {t("publicSpace.publicPosts")}
            </Typography>

            {/* LOADING */}

            {postsLoading ? (
              <Paper
                elevation={1}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">
                  {t("publicSpace.loadingPosts")}
                </Typography>
              </Paper>

            ) : posts.length === 0 ? (

              /* NO POSTS */

              <Paper
                elevation={1}
                sx={{
                  p: 5,
                  borderRadius: 3,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">
                  {t("publicSpace.noPosts")}
                </Typography>
              </Paper>

            ) : (

              /* POSTS */

              <Stack spacing={3}>

                {posts.map((post) => {

                  // Check current user like

                  const isLiked =
                    currentUserId &&
                    post.likes?.some(
                      (id) =>
                        id.toString() ===
                        currentUserId.toString()
                    );

                  return (
                    <Paper
                      key={post._id}
                      elevation={2}
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >

                      {/* ================================
                          USER INFORMATION
                      ================================= */}

                      <Box sx={{ p: 2 }}>

                        <Typography fontWeight="bold">
                          {post.user?.name ||
                            t("publicSpace.user")}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {new Date(
                            post.createdAt
                          ).toLocaleString()}
                        </Typography>

                      </Box>

                      {/* ================================
                          MEDIA
                      ================================= */}

                      {post.mediaType === "image" ? (

                        <Box
                          component="img"
                          src={post.mediaUrl}
                          alt={t(
                            "publicSpace.publicPostAlt"
                          )}
                          sx={{
                            width: "100%",
                            maxHeight: "600px",
                            objectFit: "contain",
                            display: "block",
                            backgroundColor: "#000",
                          }}
                        />

                      ) : (

                        <Box
                          component="video"
                          src={post.mediaUrl}
                          controls
                          sx={{
                            width: "100%",
                            maxHeight: "600px",
                            display: "block",
                            backgroundColor: "#000",
                          }}
                        />

                      )}

                      {/* ================================
                          CAPTION
                      ================================= */}

                      {post.caption && (
                        <Box sx={{ p: 2 }}>
                          <Typography>
                            {post.caption}
                          </Typography>
                        </Box>
                      )}

                      {/* ================================
                          LIKE / SHARE
                      ================================= */}

                      <Box
                        sx={{
                          px: 2,
                          pb: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >

                        {/* LIKE */}

                        <Button
                          startIcon={
                            isLiked ? (
                              <Favorite />
                            ) : (
                              <FavoriteBorder />
                            )
                          }
                          onClick={() =>
                            handleLike(post._id)
                          }
                          color="error"
                        >
                          {post.likes?.length || 0}
                        </Button>

                        {/* SHARE */}

                        <Button
                          startIcon={<Share />}
                          onClick={() =>
                            handleShare(post._id)
                          }
                        >
                          {post.shareCount || 0}
                        </Button>

                      </Box>

                      {/* ================================
                          COMMENTS SECTION
                      ================================= */}

                      <Box
                        sx={{
                          px: 2,
                          pb: 2,
                        }}
                      >

                        {/* COMMENT HEADING */}

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mb: 2 }}
                        >

                          <Comment color="primary" />

                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            {t("publicSpace.comments")} (
                            {post.comments?.length || 0}
                            )
                          </Typography>

                        </Stack>

                        {/* EXISTING COMMENTS */}

                        {post.comments?.length > 0 && (
                          <Stack
                            spacing={1.5}
                            sx={{ mb: 2 }}
                          >

                            {post.comments.map(
                              (comment, index) => (
                                <Box
                                  key={
                                    comment._id ||
                                    index
                                  }
                                  sx={{
                                    backgroundColor:
                                      "#f5f7fa",
                                    borderRadius: 2,
                                    p: 1.5,
                                  }}
                                >

                                  {/* COMMENT USER */}

                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                    }}
                                  >
                                    {comment.user?.name ||
                                      t("publicSpace.user")}
                                  </Typography>

                                  {/* COMMENT TEXT */}

                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mt: 0.5,
                                      color: "#374151",
                                    }}
                                  >
                                    {comment.text}
                                  </Typography>

                                  {/* COMMENT DATE */}

                                  {comment.createdAt && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {new Date(
                                        comment.createdAt
                                      ).toLocaleString()}
                                    </Typography>
                                  )}

                                </Box>
                              )
                            )}

                          </Stack>
                        )}

                        {/* ADD COMMENT */}

                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                          }}
                          spacing={1}
                        >

                          <TextField
                            fullWidth
                            size="small"
                            placeholder={t(
                              "publicSpace.writeComment"
                            )}
                            value={
                              commentText[post._id] ||
                              ""
                            }
                            onChange={(e) =>
                              setCommentText(
                                (prev) => ({
                                  ...prev,
                                  [post._id]:
                                    e.target.value,
                                })
                              )
                            }
                            inputProps={{
                              maxLength: 500,
                            }}
                          />

                          <Button
                            variant="contained"
                            startIcon={<Comment />}
                            onClick={async () => {

                              const text =
                                commentText[
                                  post._id
                                ] || "";

                              await handleComment(
                                post._id,
                                text
                              );

                              setCommentText(
                                (prev) => ({
                                  ...prev,
                                  [post._id]: "",
                                })
                              );

                            }}
                            disabled={
                              !(
                                commentText[
                                  post._id
                                ] || ""
                              ).trim()
                            }
                          >
                            {t("publicSpace.comment")}
                          </Button>

                        </Stack>

                      </Box>

                    </Paper>
                  );
                })}

              </Stack>
            )}

          </Box>

        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default PublicSpace;


// import { useState, useEffect } from "react";

// import {
//   Box,
//   Container,
//   Typography,
//   Paper,
//   Button,
//   TextField,
//   Stack,
//   Alert,
//   LinearProgress,
// } from "@mui/material";

// import {
//   CloudUpload,
//   Image as ImageIcon,
//   VideoLibrary,
//   Favorite,
//   FavoriteBorder,
//   Share,
//   Comment,
// } from "@mui/icons-material";

// import { useTranslation } from "react-i18next";
// import axios from "axios";
// import Navbar from "../components/layout/Navbar";
// import Footer from "../components/layout/Footer";

// const PublicSpace = () => {
//   const { t } = useTranslation();

//   // ================================
//   // UPLOAD STATES
//   // ================================

//   const [file, setFile] = useState(null);
//   const [caption, setCaption] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // ================================
//   // PUBLIC POSTS
//   // ================================

//   const [posts, setPosts] = useState([]);
//   const [postsLoading, setPostsLoading] = useState(true);

//   // ================================
//   // COMMENTS
//   // ================================

//   const [commentText, setCommentText] = useState({});

//   // ================================
//   // CURRENT USER
//   // ================================

//   const [currentUserId, setCurrentUserId] = useState("");

//   // ================================
//   // GET CURRENT USER ID FROM TOKEN
//   // ================================

//   const getCurrentUserId = () => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         return "";
//       }

//       const payload = JSON.parse(atob(token.split(".")[1]));

//       return payload.id || "";
//     } catch (error) {
//       console.error("Token decode error:", error);
//       return "";
//     }
//   };

//   // ================================
//   // FETCH PUBLIC POSTS
//   // ================================

//   const fetchPosts = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         "http://localhost:8000/api/public-posts",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setPosts(response.data.posts || []);
//     } catch (error) {
//       console.error("Fetch Public Posts Error:", error);
//     } finally {
//       setPostsLoading(false);
//     }
//   };

//   // ================================
//   // PAGE LOAD
//   // ================================

//   useEffect(() => {
//     const userId = getCurrentUserId();

//     setCurrentUserId(userId);

//     fetchPosts();
//   }, []);

//   // ================================
//   // FILE CHANGE
//   // ================================

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];

//     setError("");
//     setMessage("");

//     if (!selectedFile) {
//       return;
//     }

//     // Check file type

//     if (
//       !selectedFile.type.startsWith("image/") &&
//       !selectedFile.type.startsWith("video/")
//     ) {
//       setError("Only image and video files are allowed.");
//       return;
//     }

//     // Check file size

//     if (selectedFile.size > 50 * 1024 * 1024) {
//       setError("File size must be less than 50MB.");
//       return;
//     }

//     setFile(selectedFile);
//   };

//   // ================================
//   // LIKE / UNLIKE
//   // ================================

//   const handleLike = async (postId) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("Please login to like a post.");
//         return;
//       }

//       if (!currentUserId) {
//         setError("Unable to identify current user.");
//         return;
//       }

//       const response = await axios.put(
//         `http://localhost:8000/api/public-posts/${postId}/like`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setPosts((prevPosts) =>
//         prevPosts.map((post) => {
//           if (post._id !== postId) {
//             return post;
//           }

//           let updatedLikes = [...(post.likes || [])];

//           if (response.data.liked) {
//             const alreadyLiked = updatedLikes.some(
//               (id) =>
//                 id.toString() === currentUserId.toString()
//             );

//             if (!alreadyLiked) {
//               updatedLikes.push(currentUserId);
//             }
//           } else {
//             updatedLikes = updatedLikes.filter(
//               (id) =>
//                 id.toString() !== currentUserId.toString()
//             );
//           }

//           return {
//             ...post,
//             likes: updatedLikes,
//           };
//         })
//       );
//     } catch (error) {
//       console.error("Like Error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Something went wrong while liking the post."
//       );
//     }
//   };

//   // ================================
//   // ADD COMMENT
//   // ================================

//   const handleComment = async (postId, text) => {
//     try {
//       if (!text || !text.trim()) {
//         return;
//       }

//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("Please login to comment.");
//         return;
//       }

//       const response = await axios.post(
//         `http://localhost:8000/api/public-posts/${postId}/comment`,
//         {
//           text: text.trim(),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId
//             ? response.data.post
//             : post
//         )
//       );

//       setMessage("Comment added successfully!");
//     } catch (error) {
//       console.error("Comment Error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Something went wrong while adding comment."
//       );
//     }
//   };

//   // ================================
//   // SHARE POST
//   // ================================

//   const handleShare = async (postId) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("Please login to share a post.");
//         return;
//       }

//       const response = await axios.post(
//         `http://localhost:8000/api/public-posts/${postId}/share`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Update share count

//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post._id === postId
//             ? {
//                 ...post,
//                 shareCount: response.data.shareCount,
//               }
//             : post
//         )
//       );

//       const shareUrl = response.data.shareUrl;

//       // Copy share URL

//       if (navigator.share) {
//         await navigator.share({
//             title: "InternArea Public Space",
//             text: "Check out this post on InternArea!",
//             url: shareUrl,
//         });

//         setMessage(
//           "Post link copied successfully!"
//         );
//       } else {
//         await navigator.clipboard.writeText(shareUrl);

//         setMessage(
//           "Post shared successfully!"
//         );
//       }
//     } catch (error) {
//       if(error.name === "AbortError"){
//            return;
//       }

//       console.error("Share Error:", error);
//       setError(
//         error.response?.data?.message ||
//           "Something went wrong while sharing the post."
//       );
//     }
//   };

//   // ================================
//   // UPLOAD PUBLIC POST
//   // ================================

//   const handleUpload = async () => {
//     if (!file) {
//       setError("Please select an image or video.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setMessage("");

//       const formData = new FormData();

//       formData.append("media", file);
//       formData.append("caption", caption);

//       const token = localStorage.getItem("token");

//       const response = await axios.post(
//         "http://localhost:8000/api/public-posts",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage(
//         response.data.message ||
//           "Public post created successfully!"
//       );

//       // Clear form

//       setFile(null);
//       setCaption("");

//       // Refresh posts

//       await fetchPosts();

//       // Clear file input

//       const fileInput = document.getElementById(
//         "public-space-file"
//       );

//       if (fileInput) {
//         fileInput.value = "";
//       }
//     } catch (error) {
//       console.error(
//         "Public Space Upload Error:",
//         error
//       );

//       setError(
//         error.response?.data?.message ||
//           "Something went wrong while uploading the post."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================================
//   // UI
//   // ================================

//   return (
//     <>
//    <Navbar />
//     <Box
//       sx={{
//         minHeight: "100vh",
//         backgroundColor: "#f5f7fa",
//         py: 5,
//       }}
//     >
//       <Container maxWidth="md">

//         {/* ================================
//             PAGE HEADING
//         ================================= */}

//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: 700,
//             color: "#1f2937",
//             mb: 1,
//           }}
//         >
//           {t("publicSpace.title")}
//         </Typography>

//         <Typography
//           variant="body1"
//           sx={{
//             color: "#6b7280",
//             mb: 4,
//           }}
//         >
//           {t("publicSpace.description")}
//         </Typography>

//         {/* ================================
//             UPLOAD CARD
//         ================================= */}

//         <Paper
//           elevation={2}
//           sx={{
//             p: 4,
//             borderRadius: 3,
//           }}
//         >
//           <Typography
//             variant="h6"
//             sx={{
//               fontWeight: 600,
//               mb: 3,
//             }}
//           >
//             Create a Public Post
//           </Typography>

//           {/* FILE UPLOAD */}

//           <Box
//             sx={{
//               border: "2px dashed #cbd5e1",
//               borderRadius: 2,
//               p: 4,
//               textAlign: "center",
//               mb: 3,
//             }}
//           >
//             <CloudUpload
//               sx={{
//                 fontSize: 45,
//                 color: "primary.main",
//                 mb: 1,
//               }}
//             />

//             <Typography
//               variant="body1"
//               sx={{
//                 mb: 2,
//                 color: "#475569",
//               }}
//             >
//               Upload an image or video
//             </Typography>

//             <input
//               id="public-space-file"
//               type="file"
//               accept="image/*,video/*"
//               hidden
//               onChange={handleFileChange}
//             />

//             <label htmlFor="public-space-file">
//               <Button
//                 component="span"
//                 variant="outlined"
//                 startIcon={<CloudUpload />}
//               >
//                 Choose File
//               </Button>
//             </label>

//             {/* SELECTED FILE */}

//             {file && (
//               <Box sx={{ mt: 2 }}>
//                 <Stack
//                   direction="row"
//                   spacing={1}
//                   justifyContent="center"
//                   alignItems="center"
//                 >
//                   {file.type.startsWith("image/") ? (
//                     <ImageIcon color="primary" />
//                   ) : (
//                     <VideoLibrary color="primary" />
//                   )}

//                   <Typography variant="body2">
//                     {file.name}
//                   </Typography>
//                 </Stack>

//                 <Typography
//                   variant="caption"
//                   sx={{
//                     display: "block",
//                     color: "#64748b",
//                     mt: 0.5,
//                   }}
//                 >
//                   {(
//                     file.size /
//                     (1024 * 1024)
//                   ).toFixed(2)}{" "}
//                   MB
//                 </Typography>
//               </Box>
//             )}
//           </Box>

//           {/* CAPTION */}

//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             label="Caption"
//             placeholder="Write something about your post..."
//             value={caption}
//             onChange={(e) =>
//               setCaption(e.target.value)
//             }
//             inputProps={{
//               maxLength: 500,
//             }}
//             sx={{ mb: 3 }}
//           />

//           {/* ERROR */}

//           {error && (
//             <Alert
//               severity="error"
//               sx={{ mb: 2 }}
//             >
//               {error}
//             </Alert>
//           )}

//           {/* SUCCESS */}

//           {message && (
//             <Alert
//               severity="success"
//               sx={{ mb: 2 }}
//             >
//               {message}
//             </Alert>
//           )}

//           {/* UPLOAD BUTTON */}

//           <Button
//             fullWidth
//             variant="contained"
//             size="large"
//             startIcon={<CloudUpload />}
//             onClick={handleUpload}
//             disabled={loading || !file}
//           >
//             {loading
//               ? "Uploading..."
//               : "Create Public Post"}
//           </Button>

//           {/* PROGRESS */}

//           {loading && (
//             <LinearProgress sx={{ mt: 2 }} />
//           )}

//           <Typography
//             variant="caption"
//             sx={{
//               display: "block",
//               color: "#64748b",
//               mt: 2,
//               textAlign: "center",
//             }}
//           >
//             Maximum file size: 50MB
//           </Typography>
//         </Paper>

//         {/* ================================
//             PUBLIC POSTS
//         ================================= */}

//         <Box sx={{ mt: 4 }}>

//           <Typography
//             variant="h5"
//             sx={{
//               fontWeight: 700,
//               mb: 3,
//             }}
//           >
//             Public Posts
//           </Typography>

//           {/* LOADING */}

//           {postsLoading ? (
//             <Paper
//               elevation={1}
//               sx={{
//                 p: 4,
//                 borderRadius: 3,
//                 textAlign: "center",
//               }}
//             >
//               <Typography color="text.secondary">
//                 Loading posts...
//               </Typography>
//             </Paper>

//           ) : posts.length === 0 ? (

//             /* NO POSTS */

//             <Paper
//               elevation={1}
//               sx={{
//                 p: 5,
//                 borderRadius: 3,
//                 textAlign: "center",
//               }}
//             >
//               <Typography color="text.secondary">
//                 No public posts yet.
//               </Typography>
//             </Paper>

//           ) : (

//             /* POSTS */

//             <Stack spacing={3}>

//               {posts.map((post) => {

//                 // Check current user like

//                 const isLiked =
//                   currentUserId &&
//                   post.likes?.some(
//                     (id) =>
//                       id.toString() ===
//                       currentUserId.toString()
//                   );

//                 return (
//                   <Paper
//                     key={post._id}
//                     elevation={2}
//                     sx={{
//                       borderRadius: 3,
//                       overflow: "hidden",
//                     }}
//                   >

//                     {/* ================================
//                         USER INFORMATION
//                     ================================= */}

//                     <Box sx={{ p: 2 }}>

//                       <Typography fontWeight="bold">
//                         {post.user?.name || "User"}
//                       </Typography>

//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                       >
//                         {new Date(
//                           post.createdAt
//                         ).toLocaleString()}
//                       </Typography>

//                     </Box>

//                     {/* ================================
//                         MEDIA
//                     ================================= */}

//                     {post.mediaType === "image" ? (

//                       <Box
//                         component="img"
//                         src={post.mediaUrl}
//                         alt="Public post"
//                         sx={{
//                           width: "100%",
//                           maxHeight: "600px",
//                           objectFit: "contain",
//                           display: "block",
//                           backgroundColor: "#000",
//                         }}
//                       />

//                     ) : (

//                       <Box
//                         component="video"
//                         src={post.mediaUrl}
//                         controls
//                         sx={{
//                           width: "100%",
//                           maxHeight: "600px",
//                           display: "block",
//                           backgroundColor: "#000",
//                         }}
//                       />

//                     )}

//                     {/* ================================
//                         CAPTION
//                     ================================= */}

//                     {post.caption && (
//                       <Box sx={{ p: 2 }}>
//                         <Typography>
//                           {post.caption}
//                         </Typography>
//                       </Box>
//                     )}

//                     {/* ================================
//                         LIKE / SHARE
//                     ================================= */}

//                     <Box
//                       sx={{
//                         px: 2,
//                         pb: 2,
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 1,
//                       }}
//                     >

//                       {/* LIKE */}

//                       <Button
//                         startIcon={
//                           isLiked ? (
//                             <Favorite />
//                           ) : (
//                             <FavoriteBorder />
//                           )
//                         }
//                         onClick={() =>
//                           handleLike(post._id)
//                         }
//                         color="error"
//                       >
//                         {post.likes?.length || 0}
//                       </Button>

//                       {/* SHARE */}

//                       <Button
//                         startIcon={<Share />}
//                         onClick={() =>
//                           handleShare(post._id)
//                         }
//                       >
//                         {post.shareCount || 0}
//                       </Button>

//                     </Box>

//                     {/* ================================
//                         COMMENTS SECTION
//                     ================================= */}

//                     <Box
//                       sx={{
//                         px: 2,
//                         pb: 2,
//                       }}
//                     >

//                       {/* COMMENT HEADING */}

//                       <Stack
//                         direction="row"
//                         alignItems="center"
//                         spacing={1}
//                         sx={{ mb: 2 }}
//                       >

//                         <Comment color="primary" />

//                         <Typography
//                           variant="subtitle1"
//                           sx={{
//                             fontWeight: 600,
//                           }}
//                         >
//                           Comments (
//                           {post.comments?.length || 0}
//                           )
//                         </Typography>

//                       </Stack>

//                       {/* EXISTING COMMENTS */}

//                       {post.comments?.length > 0 && (
//                         <Stack
//                           spacing={1.5}
//                           sx={{ mb: 2 }}
//                         >

//                           {post.comments.map(
//                             (comment, index) => (
//                               <Box
//                                 key={
//                                   comment._id ||
//                                   index
//                                 }
//                                 sx={{
//                                   backgroundColor:
//                                     "#f5f7fa",
//                                   borderRadius: 2,
//                                   p: 1.5,
//                                 }}
//                               >

//                                 {/* COMMENT USER */}

//                                 <Typography
//                                   variant="body2"
//                                   sx={{
//                                     fontWeight: 600,
//                                   }}
//                                 >
//                                   {comment.user?.name ||
//                                     "User"}
//                                 </Typography>

//                                 {/* COMMENT TEXT */}

//                                 <Typography
//                                   variant="body2"
//                                   sx={{
//                                     mt: 0.5,
//                                     color: "#374151",
//                                   }}
//                                 >
//                                   {comment.text}
//                                 </Typography>

//                                 {/* COMMENT DATE */}

//                                 {comment.createdAt && (
//                                   <Typography
//                                     variant="caption"
//                                     color="text.secondary"
//                                   >
//                                     {new Date(
//                                       comment.createdAt
//                                     ).toLocaleString()}
//                                   </Typography>
//                                 )}

//                               </Box>
//                             )
//                           )}

//                         </Stack>
//                       )}

//                       {/* ADD COMMENT */}

//                       <Stack
//                         direction={{
//                           xs: "column",
//                           sm: "row",
//                         }}
//                         spacing={1}
//                       >

//                         <TextField
//                           fullWidth
//                           size="small"
//                           placeholder="Write a comment..."
//                           value={
//                             commentText[post._id] ||
//                             ""
//                           }
//                           onChange={(e) =>
//                             setCommentText(
//                               (prev) => ({
//                                 ...prev,
//                                 [post._id]:
//                                   e.target.value,
//                               })
//                             )
//                           }
//                           inputProps={{
//                             maxLength: 500,
//                           }}
//                         />

//                         <Button
//                           variant="contained"
//                           startIcon={<Comment />}
//                           onClick={async () => {

//                             const text =
//                               commentText[
//                                 post._id
//                               ] || "";

//                             await handleComment(
//                               post._id,
//                               text
//                             );

//                             setCommentText(
//                               (prev) => ({
//                                 ...prev,
//                                 [post._id]: "",
//                               })
//                             );

//                           }}
//                           disabled={
//                             !(
//                               commentText[
//                                 post._id
//                               ] || ""
//                             ).trim()
//                           }
//                         >
//                           Comment
//                         </Button>

//                       </Stack>

//                     </Box>

//                   </Paper>
//                 );
//               })}

//             </Stack>
//           )}

//         </Box>

//       </Container>
//     </Box>

//     <Footer />

//     </>
//   );
// };

// export default PublicSpace;