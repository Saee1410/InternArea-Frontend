import { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  IconButton,
  Stack,
  Avatar,
  TextField,
  Button,
  Alert,
} from "@mui/material";

import {
  Favorite,
  FavoriteBorder,
  Comment,
  Share,
  ChevronLeft,
  ChevronRight,
  Send,
} from "@mui/icons-material";

import axios from "axios";
import { useTranslation } from "react-i18next";

function CommunitySection() {
  const { t, i18n } = useTranslation();

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentUserId, setCurrentUserId] = useState("");
  const [commentText, setCommentText] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // GET CURRENT USER ID
  // =====================================================

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return "";

      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload.id || "";
    } catch (error) {
      console.error("Token decode error:", error);
      return "";
    }
  };

  // =====================================================
  // FETCH POSTS
  // =====================================================

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8000/api/public-posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": i18n.language || "en"
          },
        }
      );

      const fetchedPosts = response.data.posts || [];

      setPosts(fetchedPosts);
      setCurrentIndex((prev) => (fetchedPosts.length > 0 ? Math.min(prev, fetchedPosts.length - 1) : 0));
    } catch (error) {
      console.error("Fetch Public Posts Error:", error);

      setError(
        error.response?.data?.message ||
          t("community.unableToLoad")
      );
    } finally {
      setPostsLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const userId = getCurrentUserId();

    setCurrentUserId(userId);

    fetchPosts();
  }, []);

  // =====================================================
  // AUTO SLIDER
  // EVERY 5 SECONDS
  // =====================================================

  useEffect(() => {
    if (posts.length <= 1) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === posts.length - 1) {
          return 0;
        }

        return prevIndex + 1;
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, posts.length]);

  // =====================================================
  // PREVIOUS
  // =====================================================

  const handlePrevious = () => {
    if (posts.length <= 1) return;

    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return posts.length - 1;
      }

      return prevIndex - 1;
    });

    setMessage("");
    setError("");
  };

  // =====================================================
  // NEXT
  // =====================================================

  const handleNext = () => {
    if (posts.length <= 1) return;

    setCurrentIndex((prevIndex) => {
      if (prevIndex === posts.length - 1) {
        return 0;
      }

      return prevIndex + 1;
    });

    setMessage("");
    setError("");
  };

  // =====================================================
  // DOT CLICK
  // =====================================================

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setMessage("");
    setError("");
  };

  // =====================================================
  // LIKE
  // =====================================================

  const handleLike = async (postId) => {
    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("community.loginToLike"));
        return;
      }

      if (!currentUserId) {
        setError(t("community.unableToIdentifyUser"));
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

      setPosts((previousPosts) =>
        previousPosts.map((post) => {
          if (post._id !== postId) {
            return post;
          }

          let updatedLikes = [...(post.likes || [])];

          if (response.data.liked) {
            const alreadyLiked = updatedLikes.some(
              (id) =>
                id?.toString() ===
                currentUserId?.toString()
            );

            if (!alreadyLiked) {
              updatedLikes.push(currentUserId);
            }
          } else {
            updatedLikes = updatedLikes.filter(
              (id) =>
                id?.toString() !==
                currentUserId?.toString()
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
          t("community.unableToLike")
      );
    }
  };

  // =====================================================
  // COMMENT
  // =====================================================

  const handleComment = async (postId) => {
    try {
      const text = commentText[postId] || "";

      if (!text.trim()) return;

      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("community.loginToComment"));
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
            "Accept-Language": i18n.language || "en"
          },
        }
      );

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? response.data.post
            : post
        )
      );

      setCommentText((previous) => ({
        ...previous,
        [postId]: "",
      }));

      setMessage(t("community.commentAdded"));
    } catch (error) {
      console.error("Comment Error:", error);

      setError(
        error.response?.data?.message ||
          t("community.unableToComment")
      );
    }
  };

  // =====================================================
  // SHARE
  // =====================================================

  const handleShare = async (postId) => {
    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError(t("community.loginToShare"));
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

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                shareCount: response.data.shareCount,
              }
            : post
        )
      );

      const shareUrl = response.data.shareUrl;

      if (navigator.share) {
        await navigator.share({
          title: t("community.shareTitle"),
          text: t("community.shareText"),
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);

        setMessage(t("community.postLinkCopied"));
      } else {
        setMessage(t("community.shareLinkGenerated"));
      }
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      console.error("Share Error:", error);

      setError(
        error.response?.data?.message ||
          t("community.unableToShare")
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (postsLoading) {
    return (
      <Box
        sx={{
          py: 3,
          px: 2,
          textAlign: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <Typography color="text.secondary">
          {t("community.loading")}
        </Typography>
      </Box>
    );
  }

  // =====================================================
  // NO POSTS
  // =====================================================

  if (posts.length === 0) {
    return null;
  }

  const post = posts[currentIndex] || posts[0];

  if (!post) {
    return null;
  }

  // =====================================================
  // CHECK LIKE
  // =====================================================

  const isLiked =
    currentUserId &&
    post.likes?.some(
      (id) =>
        id?.toString() ===
        currentUserId?.toString()
    );

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        pt: 0,
        pb: 1,
        px: {
          xs: 2,
          sm: 3,
          md: 5,
        },
        backgroundColor: "#f8fafc",
      }}
    >
      {/* SECTION HEADER */}

      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          mb: 2,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#111827",
            mb: 1,
          }}
        >
          {t("community.title")}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#64748b",
          }}
        >
          {t("community.subtitle")}
        </Typography>
      </Box>

      {/* SUCCESS */}

      {message && (
        <Box
          sx={{
            maxWidth: 850,
            mx: "auto",
            mb: 2,
          }}
        >
          <Alert severity="success">
            {message}
          </Alert>
        </Box>
      )}

      {/* ERROR */}

      {error && (
        <Box
          sx={{
            maxWidth: 850,
            mx: "auto",
            mb: 2,
          }}
        >
          <Alert severity="error">
            {error}
          </Alert>
        </Box>
      )}

      {/* SLIDER */}

      <Box
        sx={{
          maxWidth: 850,
          mx: "auto",
          position: "relative",
        }}
      >
        {/* POST CARD */}

        <Paper
          key={post._id}
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",

            animation:
              "communityPostSlide 0.55s ease",

            "@keyframes communityPostSlide": {
              "0%": {
                opacity: 0,
                transform: "translateX(60px)",
              },

              "100%": {
                opacity: 1,
                transform: "translateX(0)",
              },
            },
          }}
        >
          {/* USER */}

          <Box
            sx={{
              p: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              src={post.user?.profilePhoto || ""}
              sx={{
                width: 48,
                height: 48,
              }}
            >
              {post.user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {post.user?.name ||
                  t("community.user")}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {post.createdAt
                  ? new Date(
                      post.createdAt
                    ).toLocaleString()
                  : ""}
              </Typography>
            </Box>
          </Box>

          {/* MEDIA */}

          {post.mediaType === "image" ? (
            <Box
              component="img"
              src={post.mediaUrl}
              alt={t("community.communityPost")}
              sx={{
                width: "100%",
                height: {
                  xs: 280,
                  sm: 400,
                  md: 500,
                },
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
                height: {
                  xs: 280,
                  sm: 400,
                  md: 500,
                },
                objectFit: "contain",
                display: "block",
                backgroundColor: "#000",
              }}
            />
          )}

          {/* CAPTION */}

          {post.caption && (
            <Box
              sx={{
                px: 3,
                pt: 2,
                pb: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#374151",
                  lineHeight: 1.6,
                }}
              >
                {post.caption}
              </Typography>
            </Box>
          )}

          {/* ACTIONS */}

          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              borderTop: "1px solid #e5e7eb",
              borderBottom: "1px solid #e5e7eb",
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
              sx={{
                textTransform: "none",
                color: isLiked
                  ? "error.main"
                  : "text.secondary",
                fontWeight: 600,

                "&:hover": {
                  backgroundColor:
                    "rgba(244,67,54,0.08)",
                },
              }}
            >
              {post.likes?.length || 0}
            </Button>

            {/* COMMENT COUNT */}

            <Button
              startIcon={<Comment />}
              sx={{
                textTransform: "none",
                color: "text.secondary",
                fontWeight: 600,

                "&:hover": {
                  backgroundColor:
                    "rgba(25,118,210,0.08)",
                },
              }}
            >
              {post.comments?.length || 0}
            </Button>

            {/* SHARE */}

            <Button
              startIcon={<Share />}
              onClick={() =>
                handleShare(post._id)
              }
              sx={{
                textTransform: "none",
                color: "text.secondary",
                fontWeight: 600,

                "&:hover": {
                  backgroundColor:
                    "rgba(25,118,210,0.08)",
                },
              }}
            >
              {post.shareCount || 0}
            </Button>
          </Box>

          {/* COMMENTS */}

          <Box
            sx={{
              px: 2.5,
              py: 2.5,
            }}
          >
            {/* EXISTING COMMENTS */}

            {post.comments?.length > 0 && (
              <Stack
                spacing={1.5}
                sx={{
                  mb: 2,
                  maxHeight: 180,
                  overflowY: "auto",
                  pr: 1,
                }}
              >
                {post.comments.map(
                  (comment, index) => (
                    <Box
                      key={
                        comment._id || index
                      }
                      sx={{
                        backgroundColor:
                          "#f5f7fa",
                        borderRadius: 2,
                        p: 1.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {comment.user?.name ||
                          t("community.user")}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          color: "#374151",
                        }}
                      >
                        {comment.text}
                      </Typography>

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
                  "community.commentPlaceholder"
                )}
                value={
                  commentText[post._id] || ""
                }
                onChange={(event) =>
                  setCommentText((previous) => ({
                    ...previous,
                    [post._id]:
                      event.target.value,
                  }))
                }
                inputProps={{
                  maxLength: 500,
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    handleComment(post._id);
                  }
                }}
              />

              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={() =>
                  handleComment(post._id)
                }
                disabled={
                  !(
                    commentText[post._id] || ""
                  ).trim()
                }
                sx={{
                  minWidth: {
                    xs: "100%",
                    sm: 120,
                  },
                  textTransform: "none",
                }}
              >
                {t("community.comment")}
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* PREVIOUS */}

        {posts.length > 1 && (
          <IconButton
            onClick={handlePrevious}
            aria-label={t(
              "community.previousPost"
            )}
            sx={{
              position: "absolute",
              left: {
                xs: 5,
                md: -28,
              },
              top: "50%",
              transform:
                "translateY(-50%)",
              backgroundColor: "#fff",
              boxShadow: 3,
              zIndex: 5,

              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}

        {/* NEXT */}

        {posts.length > 1 && (
          <IconButton
            onClick={handleNext}
            aria-label={t(
              "community.nextPost"
            )}
            sx={{
              position: "absolute",
              right: {
                xs: 5,
                md: -28,
              },
              top: "50%",
              transform:
                "translateY(-50%)",
              backgroundColor: "#fff",
              boxShadow: 3,
              zIndex: 5,

              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        )}
      </Box>

      {/* DOTS */}

      {posts.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{
            mt: 3,
          }}
        >
          {posts.map((item, index) => (
            <Box
              key={item._id || index}
              onClick={() =>
                handleDotClick(index)
              }
              sx={{
                width:
                  index === currentIndex
                    ? 28
                    : 8,
                height: 8,
                borderRadius: 10,

                backgroundColor:
                  index === currentIndex
                    ? "#1976d2"
                    : "#cbd5e1",

                cursor: "pointer",
                transition:
                  "all 0.3s ease",

                "&:hover": {
                  backgroundColor:
                    "#1976d2",
                },
              }}
            />
          ))}
        </Stack>
      )}

      {/* COUNTER */}

      {posts.length > 1 && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 1.5,
            color: "#64748b",
          }}
        >
          {currentIndex + 1} / {posts.length}
        </Typography>
      )}
    </Box>
  );
}

export default CommunitySection;



// import { useEffect, useState } from "react";

// import {
//   Box,
//   Paper,
//   Typography,
//   IconButton,
//   Stack,
//   Avatar,
//   TextField,
//   Button,
//   Alert,
// } from "@mui/material";

// import {
//   Favorite,
//   FavoriteBorder,
//   Comment,
//   Share,
//   ChevronLeft,
//   ChevronRight,
//   Send,
// } from "@mui/icons-material";

// import axios from "axios";
// import { useTranslation } from "react-i18next";

// function CommunitySection() {
//   const { t } = useTranslation();

//   const [posts, setPosts] = useState([]);
//   const [postsLoading, setPostsLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [currentUserId, setCurrentUserId] = useState("");
//   const [commentText, setCommentText] = useState({});
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // =====================================================
//   // GET CURRENT USER ID
//   // =====================================================

//   const getCurrentUserId = () => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) return "";

//       const payload = JSON.parse(atob(token.split(".")[1]));

//       return payload.id || "";
//     } catch (error) {
//       console.error("Token decode error:", error);
//       return "";
//     }
//   };

//   // =====================================================
//   // FETCH POSTS
//   // =====================================================

//   const fetchPosts = async () => {
//     try {
//       setPostsLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         "http://localhost:8000/api/public-posts",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const fetchedPosts = response.data.posts || [];

//       setPosts(fetchedPosts);
//       setCurrentIndex(0);
//     } catch (error) {
//       console.error("Fetch Public Posts Error:", error);

//       setError(
//         error.response?.data?.message ||
//           t("community.unableToLoad")
//       );
//     } finally {
//       setPostsLoading(false);
//     }
//   };

//   // =====================================================
//   // INITIAL LOAD
//   // =====================================================

//   useEffect(() => {
//     const userId = getCurrentUserId();

//     setCurrentUserId(userId);

//     fetchPosts();
//   }, []);

//   // =====================================================
//   // AUTO SLIDER
//   // EVERY 5 SECONDS
//   // =====================================================

//   useEffect(() => {
//     if (posts.length <= 1) return;

//     const timer = setTimeout(() => {
//       setCurrentIndex((prevIndex) => {
//         if (prevIndex === posts.length - 1) {
//           return 0;
//         }

//         return prevIndex + 1;
//       });
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [currentIndex, posts.length]);

//   // =====================================================
//   // PREVIOUS
//   // =====================================================

//   const handlePrevious = () => {
//     if (posts.length <= 1) return;

//     setCurrentIndex((prevIndex) => {
//       if (prevIndex === 0) {
//         return posts.length - 1;
//       }

//       return prevIndex - 1;
//     });

//     setMessage("");
//     setError("");
//   };

//   // =====================================================
//   // NEXT
//   // =====================================================

//   const handleNext = () => {
//     if (posts.length <= 1) return;

//     setCurrentIndex((prevIndex) => {
//       if (prevIndex === posts.length - 1) {
//         return 0;
//       }

//       return prevIndex + 1;
//     });

//     setMessage("");
//     setError("");
//   };

//   // =====================================================
//   // DOT CLICK
//   // =====================================================

//   const handleDotClick = (index) => {
//     setCurrentIndex(index);
//     setMessage("");
//     setError("");
//   };

//   // =====================================================
//   // LIKE
//   // =====================================================

//   const handleLike = async (postId) => {
//     try {
//       setError("");
//       setMessage("");

//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError(t("community.loginToLike"));
//         return;
//       }

//       if (!currentUserId) {
//         setError(t("community.unableToIdentifyUser"));
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

//       setPosts((previousPosts) =>
//         previousPosts.map((post) => {
//           if (post._id !== postId) {
//             return post;
//           }

//           let updatedLikes = [...(post.likes || [])];

//           if (response.data.liked) {
//             const alreadyLiked = updatedLikes.some(
//               (id) =>
//                 id?.toString() ===
//                 currentUserId?.toString()
//             );

//             if (!alreadyLiked) {
//               updatedLikes.push(currentUserId);
//             }
//           } else {
//             updatedLikes = updatedLikes.filter(
//               (id) =>
//                 id?.toString() !==
//                 currentUserId?.toString()
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
//           t("community.unableToLike")
//       );
//     }
//   };

//   // =====================================================
//   // COMMENT
//   // =====================================================

//   const handleComment = async (postId) => {
//     try {
//       const text = commentText[postId] || "";

//       if (!text.trim()) return;

//       setError("");
//       setMessage("");

//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError(t("community.loginToComment"));
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

//       setPosts((previousPosts) =>
//         previousPosts.map((post) =>
//           post._id === postId
//             ? response.data.post
//             : post
//         )
//       );

//       setCommentText((previous) => ({
//         ...previous,
//         [postId]: "",
//       }));

//       setMessage(t("community.commentAdded"));
//     } catch (error) {
//       console.error("Comment Error:", error);

//       setError(
//         error.response?.data?.message ||
//           t("community.unableToComment")
//       );
//     }
//   };

//   // =====================================================
//   // SHARE
//   // =====================================================

//   const handleShare = async (postId) => {
//     try {
//       setError("");
//       setMessage("");

//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError(t("community.loginToShare"));
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

//       setPosts((previousPosts) =>
//         previousPosts.map((post) =>
//           post._id === postId
//             ? {
//                 ...post,
//                 shareCount: response.data.shareCount,
//               }
//             : post
//         )
//       );

//       const shareUrl = response.data.shareUrl;

//       if (navigator.share) {
//         await navigator.share({
//           title: t("community.shareTitle"),
//           text: t("community.shareText"),
//           url: shareUrl,
//         });
//       } else if (navigator.clipboard) {
//         await navigator.clipboard.writeText(shareUrl);

//         setMessage(t("community.postLinkCopied"));
//       } else {
//         setMessage(t("community.shareLinkGenerated"));
//       }
//     } catch (error) {
//       if (error.name === "AbortError") {
//         return;
//       }

//       console.error("Share Error:", error);

//       setError(
//         error.response?.data?.message ||
//           t("community.unableToShare")
//       );
//     }
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (postsLoading) {
//     return (
//       <Box
//         sx={{
//           py: 3,
//           px: 2,
//           textAlign: "center",
//           backgroundColor: "#f8fafc",
//         }}
//       >
//         <Typography color="text.secondary">
//           {t("community.loading")}
//         </Typography>
//       </Box>
//     );
//   }

//   // =====================================================
//   // NO POSTS
//   // =====================================================

//   if (posts.length === 0) {
//     return null;
//   }

//   const post = posts[currentIndex];

//   if (!post) {
//     return null;
//   }

//   // =====================================================
//   // CHECK LIKE
//   // =====================================================

//   const isLiked =
//     currentUserId &&
//     post.likes?.some(
//       (id) =>
//         id?.toString() ===
//         currentUserId?.toString()
//     );

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <Box
//       sx={{
//         pt: 0,
//         pb: 1,
//         px: {
//           xs: 2,
//           sm: 3,
//           md: 5,
//         },
//         backgroundColor: "#f8fafc",
//       }}
//     >
//       {/* SECTION HEADER */}

//       <Box
//         sx={{
//           maxWidth: 900,
//           mx: "auto",
//           mb: 2,
//           textAlign: "center",
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: 700,
//             color: "#111827",
//             mb: 1,
//           }}
//         >
//           {t("community.title")}
//         </Typography>

//         <Typography
//           variant="body1"
//           sx={{
//             color: "#64748b",
//           }}
//         >
//           {t("community.subtitle")}
//         </Typography>
//       </Box>

//       {/* SUCCESS */}

//       {message && (
//         <Box
//           sx={{
//             maxWidth: 850,
//             mx: "auto",
//             mb: 2,
//           }}
//         >
//           <Alert severity="success">
//             {message}
//           </Alert>
//         </Box>
//       )}

//       {/* ERROR */}

//       {error && (
//         <Box
//           sx={{
//             maxWidth: 850,
//             mx: "auto",
//             mb: 2,
//           }}
//         >
//           <Alert severity="error">
//             {error}
//           </Alert>
//         </Box>
//       )}

//       {/* SLIDER */}

//       <Box
//         sx={{
//           maxWidth: 850,
//           mx: "auto",
//           position: "relative",
//         }}
//       >
//         {/* POST CARD */}

//         <Paper
//           key={post._id}
//           elevation={3}
//           sx={{
//             borderRadius: 4,
//             overflow: "hidden",

//             animation:
//               "communityPostSlide 0.55s ease",

//             "@keyframes communityPostSlide": {
//               "0%": {
//                 opacity: 0,
//                 transform: "translateX(60px)",
//               },

//               "100%": {
//                 opacity: 1,
//                 transform: "translateX(0)",
//               },
//             },
//           }}
//         >
//           {/* USER */}

//           <Box
//             sx={{
//               p: 2.5,
//               display: "flex",
//               alignItems: "center",
//               gap: 2,
//             }}
//           >
//             <Avatar
//               src={post.user?.profilePhoto || ""}
//               sx={{
//                 width: 48,
//                 height: 48,
//               }}
//             >
//               {post.user?.name
//                 ?.charAt(0)
//                 ?.toUpperCase() || "U"}
//             </Avatar>

//             <Box>
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   color: "#111827",
//                 }}
//               >
//                 {post.user?.name ||
//                   t("community.user")}
//               </Typography>

//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//               >
//                 {post.createdAt
//                   ? new Date(
//                       post.createdAt
//                     ).toLocaleString()
//                   : ""}
//               </Typography>
//             </Box>
//           </Box>

//           {/* MEDIA */}

//           {post.mediaType === "image" ? (
//             <Box
//               component="img"
//               src={post.mediaUrl}
//               alt={t("community.communityPost")}
//               sx={{
//                 width: "100%",
//                 height: {
//                   xs: 280,
//                   sm: 400,
//                   md: 500,
//                 },
//                 objectFit: "contain",
//                 display: "block",
//                 backgroundColor: "#000",
//               }}
//             />
//           ) : (
//             <Box
//               component="video"
//               src={post.mediaUrl}
//               controls
//               sx={{
//                 width: "100%",
//                 height: {
//                   xs: 280,
//                   sm: 400,
//                   md: 500,
//                 },
//                 objectFit: "contain",
//                 display: "block",
//                 backgroundColor: "#000",
//               }}
//             />
//           )}

//           {/* CAPTION */}

//           {post.caption && (
//             <Box
//               sx={{
//                 px: 3,
//                 pt: 2,
//                 pb: 1,
//               }}
//             >
//               <Typography
//                 sx={{
//                   color: "#374151",
//                   lineHeight: 1.6,
//                 }}
//               >
//                 {post.caption}
//               </Typography>
//             </Box>
//           )}

//           {/* ACTIONS */}

//           <Box
//             sx={{
//               px: 2,
//               py: 1.5,
//               display: "flex",
//               alignItems: "center",
//               gap: 0.5,
//               borderTop: "1px solid #e5e7eb",
//               borderBottom: "1px solid #e5e7eb",
//             }}
//           >
//             {/* LIKE */}

//             <Button
//               startIcon={
//                 isLiked ? (
//                   <Favorite />
//                 ) : (
//                   <FavoriteBorder />
//                 )
//               }
//               onClick={() =>
//                 handleLike(post._id)
//               }
//               sx={{
//                 textTransform: "none",
//                 color: isLiked
//                   ? "error.main"
//                   : "text.secondary",
//                 fontWeight: 600,

//                 "&:hover": {
//                   backgroundColor:
//                     "rgba(244,67,54,0.08)",
//                 },
//               }}
//             >
//               {post.likes?.length || 0}
//             </Button>

//             {/* COMMENT COUNT */}

//             <Button
//               startIcon={<Comment />}
//               sx={{
//                 textTransform: "none",
//                 color: "text.secondary",
//                 fontWeight: 600,

//                 "&:hover": {
//                   backgroundColor:
//                     "rgba(25,118,210,0.08)",
//                 },
//               }}
//             >
//               {post.comments?.length || 0}
//             </Button>

//             {/* SHARE */}

//             <Button
//               startIcon={<Share />}
//               onClick={() =>
//                 handleShare(post._id)
//               }
//               sx={{
//                 textTransform: "none",
//                 color: "text.secondary",
//                 fontWeight: 600,

//                 "&:hover": {
//                   backgroundColor:
//                     "rgba(25,118,210,0.08)",
//                 },
//               }}
//             >
//               {post.shareCount || 0}
//             </Button>
//           </Box>

//           {/* COMMENTS */}

//           <Box
//             sx={{
//               px: 2.5,
//               py: 2.5,
//             }}
//           >
//             {/* EXISTING COMMENTS */}

//             {post.comments?.length > 0 && (
//               <Stack
//                 spacing={1.5}
//                 sx={{
//                   mb: 2,
//                   maxHeight: 180,
//                   overflowY: "auto",
//                   pr: 1,
//                 }}
//               >
//                 {post.comments.map(
//                   (comment, index) => (
//                     <Box
//                       key={
//                         comment._id || index
//                       }
//                       sx={{
//                         backgroundColor:
//                           "#f5f7fa",
//                         borderRadius: 2,
//                         p: 1.5,
//                       }}
//                     >
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           fontWeight: 700,
//                         }}
//                       >
//                         {comment.user?.name ||
//                           t("community.user")}
//                       </Typography>

//                       <Typography
//                         variant="body2"
//                         sx={{
//                           mt: 0.5,
//                           color: "#374151",
//                         }}
//                       >
//                         {comment.text}
//                       </Typography>

//                       {comment.createdAt && (
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                         >
//                           {new Date(
//                             comment.createdAt
//                           ).toLocaleString()}
//                         </Typography>
//                       )}
//                     </Box>
//                   )
//                 )}
//               </Stack>
//             )}

//             {/* ADD COMMENT */}

//             <Stack
//               direction={{
//                 xs: "column",
//                 sm: "row",
//               }}
//               spacing={1}
//             >
//               <TextField
//                 fullWidth
//                 size="small"
//                 placeholder={t(
//                   "community.commentPlaceholder"
//                 )}
//                 value={
//                   commentText[post._id] || ""
//                 }
//                 onChange={(event) =>
//                   setCommentText((previous) => ({
//                     ...previous,
//                     [post._id]:
//                       event.target.value,
//                   }))
//                 }
//                 inputProps={{
//                   maxLength: 500,
//                 }}
//                 onKeyDown={(event) => {
//                   if (
//                     event.key === "Enter" &&
//                     !event.shiftKey
//                   ) {
//                     event.preventDefault();
//                     handleComment(post._id);
//                   }
//                 }}
//               />

//               <Button
//                 variant="contained"
//                 startIcon={<Send />}
//                 onClick={() =>
//                   handleComment(post._id)
//                 }
//                 disabled={
//                   !(
//                     commentText[post._id] || ""
//                   ).trim()
//                 }
//                 sx={{
//                   minWidth: {
//                     xs: "100%",
//                     sm: 120,
//                   },
//                   textTransform: "none",
//                 }}
//               >
//                 {t("community.comment")}
//               </Button>
//             </Stack>
//           </Box>
//         </Paper>

//         {/* PREVIOUS */}

//         {posts.length > 1 && (
//           <IconButton
//             onClick={handlePrevious}
//             aria-label={t(
//               "community.previousPost"
//             )}
//             sx={{
//               position: "absolute",
//               left: {
//                 xs: 5,
//                 md: -28,
//               },
//               top: "50%",
//               transform:
//                 "translateY(-50%)",
//               backgroundColor: "#fff",
//               boxShadow: 3,
//               zIndex: 5,

//               "&:hover": {
//                 backgroundColor: "#f1f5f9",
//               },
//             }}
//           >
//             <ChevronLeft />
//           </IconButton>
//         )}

//         {/* NEXT */}

//         {posts.length > 1 && (
//           <IconButton
//             onClick={handleNext}
//             aria-label={t(
//               "community.nextPost"
//             )}
//             sx={{
//               position: "absolute",
//               right: {
//                 xs: 5,
//                 md: -28,
//               },
//               top: "50%",
//               transform:
//                 "translateY(-50%)",
//               backgroundColor: "#fff",
//               boxShadow: 3,
//               zIndex: 5,

//               "&:hover": {
//                 backgroundColor: "#f1f5f9",
//               },
//             }}
//           >
//             <ChevronRight />
//           </IconButton>
//         )}
//       </Box>

//       {/* DOTS */}

//       {posts.length > 1 && (
//         <Stack
//           direction="row"
//           spacing={1}
//           justifyContent="center"
//           sx={{
//             mt: 3,
//           }}
//         >
//           {posts.map((item, index) => (
//             <Box
//               key={item._id || index}
//               onClick={() =>
//                 handleDotClick(index)
//               }
//               sx={{
//                 width:
//                   index === currentIndex
//                     ? 28
//                     : 8,
//                 height: 8,
//                 borderRadius: 10,

//                 backgroundColor:
//                   index === currentIndex
//                     ? "#1976d2"
//                     : "#cbd5e1",

//                 cursor: "pointer",
//                 transition:
//                   "all 0.3s ease",

//                 "&:hover": {
//                   backgroundColor:
//                     "#1976d2",
//                 },
//               }}
//             />
//           ))}
//         </Stack>
//       )}

//       {/* COUNTER */}

//       {posts.length > 1 && (
//         <Typography
//           variant="caption"
//           sx={{
//             display: "block",
//             textAlign: "center",
//             mt: 1.5,
//             color: "#64748b",
//           }}
//         >
//           {currentIndex + 1} / {posts.length}
//         </Typography>
//       )}
//     </Box>
//   );
// }

// export default CommunitySection;



// import { useEffect, useState } from "react";

// import {
//   Box,
//   Paper,
//   Typography,
//   IconButton,
//   Stack,
//   Avatar,
//   TextField,
//   Button,
//   Alert,
// } from "@mui/material";

// import {
//   Favorite,
//   FavoriteBorder,
//   Comment,
//   Share,
//   ChevronLeft,
//   ChevronRight,
//   Send,
// } from "@mui/icons-material";

// import axios from "axios";

// function CommunitySection() {
//   const [posts, setPosts] = useState([]);
//   const [postsLoading, setPostsLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [currentUserId, setCurrentUserId] = useState("");
//   const [commentText, setCommentText] = useState({});
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // =====================================================
//   // GET CURRENT USER ID
//   // =====================================================

//   const getCurrentUserId = () => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) return "";

//       const payload = JSON.parse(atob(token.split(".")[1]));

//       return payload.id || "";
//     } catch (error) {
//       console.error("Token decode error:", error);
//       return "";
//     }
//   };

//   // =====================================================
//   // FETCH POSTS
//   // =====================================================

//   const fetchPosts = async () => {
//     try {
//       setPostsLoading(true);
//       setError("");

//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         "http://localhost:8000/api/public-posts",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const fetchedPosts = response.data.posts || [];

//       setPosts(fetchedPosts);
//       setCurrentIndex(0);
//     } catch (error) {
//       console.error("Fetch Public Posts Error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Unable to load community posts."
//       );
//     } finally {
//       setPostsLoading(false);
//     }
//   };

//   // =====================================================
//   // INITIAL LOAD
//   // =====================================================

//   useEffect(() => {
//     const userId = getCurrentUserId();

//     setCurrentUserId(userId);

//     fetchPosts();
//   }, []);

//   // =====================================================
//   // AUTO SLIDER
//   // EVERY 5 SECONDS
//   // =====================================================

//   useEffect(() => {
//     if (posts.length <= 1) return;

//     const timer = setTimeout(() => {
//       setCurrentIndex((prevIndex) => {
//         if (prevIndex === posts.length - 1) {
//           return 0;
//         }

//         return prevIndex + 1;
//       });
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [currentIndex, posts.length]);

//   // =====================================================
//   // PREVIOUS
//   // =====================================================

//   const handlePrevious = () => {
//     if (posts.length <= 1) return;

//     setCurrentIndex((prevIndex) => {
//       if (prevIndex === 0) {
//         return posts.length - 1;
//       }

//       return prevIndex - 1;
//     });

//     setMessage("");
//     setError("");
//   };

//   // =====================================================
//   // NEXT
//   // =====================================================

//   const handleNext = () => {
//     if (posts.length <= 1) return;

//     setCurrentIndex((prevIndex) => {
//       if (prevIndex === posts.length - 1) {
//         return 0;
//       }

//       return prevIndex + 1;
//     });

//     setMessage("");
//     setError("");
//   };

//   // =====================================================
//   // DOT CLICK
//   // =====================================================

//   const handleDotClick = (index) => {
//     setCurrentIndex(index);
//     setMessage("");
//     setError("");
//   };

//   // =====================================================
//   // LIKE
//   // =====================================================

//   const handleLike = async (postId) => {
//     try {
//       setError("");
//       setMessage("");

//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("Please login to like this post.");
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

//       setPosts((previousPosts) =>
//         previousPosts.map((post) => {
//           if (post._id !== postId) {
//             return post;
//           }

//           let updatedLikes = [...(post.likes || [])];

//           if (response.data.liked) {
//             const alreadyLiked = updatedLikes.some(
//               (id) =>
//                 id?.toString() ===
//                 currentUserId?.toString()
//             );

//             if (!alreadyLiked) {
//               updatedLikes.push(currentUserId);
//             }
//           } else {
//             updatedLikes = updatedLikes.filter(
//               (id) =>
//                 id?.toString() !==
//                 currentUserId?.toString()
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
//           "Unable to like this post."
//       );
//     }
//   };

//   // =====================================================
//   // COMMENT
//   // =====================================================

//   const handleComment = async (postId) => {
//     try {
//       const text = commentText[postId] || "";

//       if (!text.trim()) return;

//       setError("");
//       setMessage("");

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

//       setPosts((previousPosts) =>
//         previousPosts.map((post) =>
//           post._id === postId
//             ? response.data.post
//             : post
//         )
//       );

//       setCommentText((previous) => ({
//         ...previous,
//         [postId]: "",
//       }));

//       setMessage("Comment added successfully.");
//     } catch (error) {
//       console.error("Comment Error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Unable to add comment."
//       );
//     }
//   };

//   // =====================================================
//   // SHARE
//   // =====================================================

//   const handleShare = async (postId) => {
//     try {
//       setError("");
//       setMessage("");

//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("Please login to share this post.");
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

//       setPosts((previousPosts) =>
//         previousPosts.map((post) =>
//           post._id === postId
//             ? {
//                 ...post,
//                 shareCount: response.data.shareCount,
//               }
//             : post
//         )
//       );

//       const shareUrl = response.data.shareUrl;

//       if (navigator.share) {
//         await navigator.share({
//           title: "InternArea Community Post",
//           text: "Check out this post on InternArea",
//           url: shareUrl,
//         });
//       } else if (navigator.clipboard) {
//         await navigator.clipboard.writeText(shareUrl);

//         setMessage("Post link copied successfully.");
//       } else {
//         setMessage("Share link generated successfully.");
//       }
//     } catch (error) {
//       if (error.name === "AbortError") {
//         return;
//       }

//       console.error("Share Error:", error);

//       setError(
//         error.response?.data?.message ||
//           "Unable to share this post."
//       );
//     }
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (postsLoading) {
//     return (
//       <Box
//         sx={{
//           py: 3,
//           px: 2,
//           textAlign: "center",
//           backgroundColor: "#f8fafc",
//         }}
//       >
//         <Typography color="text.secondary">
//           Loading community posts...
//         </Typography>
//       </Box>
//     );
//   }

//   // =====================================================
//   // NO POSTS
//   // =====================================================

//   if (posts.length === 0) {
//     return null;
//   }

//   const post = posts[currentIndex];

//   if (!post) {
//     return null;
//   }

//   // =====================================================
//   // CHECK LIKE
//   // =====================================================

//   const isLiked =
//     currentUserId &&
//     post.likes?.some(
//       (id) =>
//         id?.toString() ===
//         currentUserId?.toString()
//     );

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <Box
//       sx={{
//         pt: 0,
//         pb: 1,
//         px: {
//           xs: 2,
//           sm: 3,
//           md: 5,
//         },
//         backgroundColor: "#f8fafc",
//       }}
//     >
//       {/* SECTION HEADER */}

//       <Box
//         sx={{
//           maxWidth: 900,
//           mx: "auto",
//           mb: 2,
//           textAlign: "center",
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: 700,
//             color: "#111827",
//             mb: 1,
//           }}
//         >
//           Community Posts
//         </Typography>

//         <Typography
//           variant="body1"
//           sx={{
//             color: "#64748b",
//           }}
//         >
//           See what students are sharing with the
//           InternArea community
//         </Typography>
//       </Box>

//       {/* SUCCESS */}

//       {message && (
//         <Box
//           sx={{
//             maxWidth: 850,
//             mx: "auto",
//             mb: 2,
//           }}
//         >
//           <Alert severity="success">
//             {message}
//           </Alert>
//         </Box>
//       )}

//       {/* ERROR */}

//       {error && (
//         <Box
//           sx={{
//             maxWidth: 850,
//             mx: "auto",
//             mb: 2,
//           }}
//         >
//           <Alert severity="error">
//             {error}
//           </Alert>
//         </Box>
//       )}

//       {/* SLIDER */}

//       <Box
//         sx={{
//           maxWidth: 850,
//           mx: "auto",
//           position: "relative",
//         }}
//       >
//         {/* POST CARD */}

//         <Paper
//           key={post._id}
//           elevation={3}
//           sx={{
//             borderRadius: 4,
//             overflow: "hidden",

//             animation:
//               "communityPostSlide 0.55s ease",

//             "@keyframes communityPostSlide": {
//               "0%": {
//                 opacity: 0,
//                 transform: "translateX(60px)",
//               },

//               "100%": {
//                 opacity: 1,
//                 transform: "translateX(0)",
//               },
//             },
//           }}
//         >
//           {/* USER */}

//           <Box
//             sx={{
//               p: 2.5,
//               display: "flex",
//               alignItems: "center",
//               gap: 2,
//             }}
//           >
//             <Avatar
//               src={post.user?.profilePhoto || ""}
//               sx={{
//                 width: 48,
//                 height: 48,
//               }}
//             >
//               {post.user?.name
//                 ?.charAt(0)
//                 ?.toUpperCase() || "U"}
//             </Avatar>

//             <Box>
//               <Typography
//                 sx={{
//                   fontWeight: 700,
//                   color: "#111827",
//                 }}
//               >
//                 {post.user?.name || "User"}
//               </Typography>

//               <Typography
//                 variant="caption"
//                 color="text.secondary"
//               >
//                 {post.createdAt
//                   ? new Date(
//                       post.createdAt
//                     ).toLocaleString()
//                   : ""}
//               </Typography>
//             </Box>
//           </Box>

//           {/* MEDIA */}

//           {post.mediaType === "image" ? (
//             <Box
//               component="img"
//               src={post.mediaUrl}
//               alt="Community post"
//               sx={{
//                 width: "100%",
//                 height: {
//                   xs: 280,
//                   sm: 400,
//                   md: 500,
//                 },
//                 objectFit: "contain",
//                 display: "block",
//                 backgroundColor: "#000",
//               }}
//             />
//           ) : (
//             <Box
//               component="video"
//               src={post.mediaUrl}
//               controls
//               sx={{
//                 width: "100%",
//                 height: {
//                   xs: 280,
//                   sm: 400,
//                   md: 500,
//                 },
//                 objectFit: "contain",
//                 display: "block",
//                 backgroundColor: "#000",
//               }}
//             />
//           )}

//           {/* CAPTION */}

//           {post.caption && (
//             <Box
//               sx={{
//                 px: 3,
//                 pt: 2,
//                 pb: 1,
//               }}
//             >
//               <Typography
//                 sx={{
//                   color: "#374151",
//                   lineHeight: 1.6,
//                 }}
//               >
//                 {post.caption}
//               </Typography>
//             </Box>
//           )}

//           {/* ACTIONS */}

//           <Box
//             sx={{
//               px: 2,
//               py: 1.5,
//               display: "flex",
//               alignItems: "center",
//               gap: 0.5,
//               borderTop: "1px solid #e5e7eb",
//               borderBottom: "1px solid #e5e7eb",
//             }}
//           >
//             {/* LIKE */}

//             <Button
//               startIcon={
//                 isLiked ? (
//                   <Favorite />
//                 ) : (
//                   <FavoriteBorder />
//                 )
//               }
//               onClick={() =>
//                 handleLike(post._id)
//               }
//               sx={{
//                 textTransform: "none",
//                 color: isLiked
//                   ? "error.main"
//                   : "text.secondary",
//                 fontWeight: 600,

//                 "&:hover": {
//                   backgroundColor:
//                     "rgba(244,67,54,0.08)",
//                 },
//               }}
//             >
//               {post.likes?.length || 0}
//             </Button>

//             {/* COMMENT COUNT */}

//             <Button
//               startIcon={<Comment />}
//               sx={{
//                 textTransform: "none",
//                 color: "text.secondary",
//                 fontWeight: 600,

//                 "&:hover": {
//                   backgroundColor:
//                     "rgba(25,118,210,0.08)",
//                 },
//               }}
//             >
//               {post.comments?.length || 0}
//             </Button>

//             {/* SHARE */}

//             <Button
//               startIcon={<Share />}
//               onClick={() =>
//                 handleShare(post._id)
//               }
//               sx={{
//                 textTransform: "none",
//                 color: "text.secondary",
//                 fontWeight: 600,

//                 "&:hover": {
//                   backgroundColor:
//                     "rgba(25,118,210,0.08)",
//                 },
//               }}
//             >
//               {post.shareCount || 0}
//             </Button>
//           </Box>

//           {/* COMMENTS */}

//           <Box
//             sx={{
//               px: 2.5,
//               py: 2.5,
//             }}
//           >
//             {/* EXISTING COMMENTS */}

//             {post.comments?.length > 0 && (
//               <Stack
//                 spacing={1.5}
//                 sx={{
//                   mb: 2,
//                   maxHeight: 180,
//                   overflowY: "auto",
//                   pr: 1,
//                 }}
//               >
//                 {post.comments.map(
//                   (comment, index) => (
//                     <Box
//                       key={
//                         comment._id || index
//                       }
//                       sx={{
//                         backgroundColor:
//                           "#f5f7fa",
//                         borderRadius: 2,
//                         p: 1.5,
//                       }}
//                     >
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           fontWeight: 700,
//                         }}
//                       >
//                         {comment.user?.name ||
//                           "User"}
//                       </Typography>

//                       <Typography
//                         variant="body2"
//                         sx={{
//                           mt: 0.5,
//                           color: "#374151",
//                         }}
//                       >
//                         {comment.text}
//                       </Typography>

//                       {comment.createdAt && (
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                         >
//                           {new Date(
//                             comment.createdAt
//                           ).toLocaleString()}
//                         </Typography>
//                       )}
//                     </Box>
//                   )
//                 )}
//               </Stack>
//             )}

//             {/* ADD COMMENT */}

//             <Stack
//               direction={{
//                 xs: "column",
//                 sm: "row",
//               }}
//               spacing={1}
//             >
//               <TextField
//                 fullWidth
//                 size="small"
//                 placeholder="Write a comment..."
//                 value={
//                   commentText[post._id] || ""
//                 }
//                 onChange={(event) =>
//                   setCommentText((previous) => ({
//                     ...previous,
//                     [post._id]:
//                       event.target.value,
//                   }))
//                 }
//                 inputProps={{
//                   maxLength: 500,
//                 }}
//                 onKeyDown={(event) => {
//                   if (
//                     event.key === "Enter" &&
//                     !event.shiftKey
//                   ) {
//                     event.preventDefault();
//                     handleComment(post._id);
//                   }
//                 }}
//               />

//               <Button
//                 variant="contained"
//                 startIcon={<Send />}
//                 onClick={() =>
//                   handleComment(post._id)
//                 }
//                 disabled={
//                   !(
//                     commentText[post._id] || ""
//                   ).trim()
//                 }
//                 sx={{
//                   minWidth: {
//                     xs: "100%",
//                     sm: 120,
//                   },
//                   textTransform: "none",
//                 }}
//               >
//                 Comment
//               </Button>
//             </Stack>
//           </Box>
//         </Paper>

//         {/* PREVIOUS */}

//         {posts.length > 1 && (
//           <IconButton
//             onClick={handlePrevious}
//             aria-label="Previous post"
//             sx={{
//               position: "absolute",
//               left: {
//                 xs: 5,
//                 md: -28,
//               },
//               top: "50%",
//               transform:
//                 "translateY(-50%)",
//               backgroundColor: "#fff",
//               boxShadow: 3,
//               zIndex: 5,

//               "&:hover": {
//                 backgroundColor: "#f1f5f9",
//               },
//             }}
//           >
//             <ChevronLeft />
//           </IconButton>
//         )}

//         {/* NEXT */}

//         {posts.length > 1 && (
//           <IconButton
//             onClick={handleNext}
//             aria-label="Next post"
//             sx={{
//               position: "absolute",
//               right: {
//                 xs: 5,
//                 md: -28,
//               },
//               top: "50%",
//               transform:
//                 "translateY(-50%)",
//               backgroundColor: "#fff",
//               boxShadow: 3,
//               zIndex: 5,

//               "&:hover": {
//                 backgroundColor: "#f1f5f9",
//               },
//             }}
//           >
//             <ChevronRight />
//           </IconButton>
//         )}
//       </Box>

//       {/* DOTS */}

//       {posts.length > 1 && (
//         <Stack
//           direction="row"
//           spacing={1}
//           justifyContent="center"
//           sx={{
//             mt: 3,
//           }}
//         >
//           {posts.map((item, index) => (
//             <Box
//               key={item._id || index}
//               onClick={() =>
//                 handleDotClick(index)
//               }
//               sx={{
//                 width:
//                   index === currentIndex
//                     ? 28
//                     : 8,
//                 height: 8,
//                 borderRadius: 10,

//                 backgroundColor:
//                   index === currentIndex
//                     ? "#1976d2"
//                     : "#cbd5e1",

//                 cursor: "pointer",
//                 transition:
//                   "all 0.3s ease",

//                 "&:hover": {
//                   backgroundColor:
//                     "#1976d2",
//                 },
//               }}
//             />
//           ))}
//         </Stack>
//       )}

//       {/* COUNTER */}

//       {posts.length > 1 && (
//         <Typography
//           variant="caption"
//           sx={{
//             display: "block",
//             textAlign: "center",
//             mt: 1.5,
//             color: "#64748b",
//           }}
//         >
//           {currentIndex + 1} / {posts.length}
//         </Typography>
//       )}
//     </Box>
//   );
// }

// export default CommunitySection;



