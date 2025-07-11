"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import useSWR, { mutate } from "swr";

interface Post {
  id: number;
  title: string | null;
  content: string | null;
  createdAt: string;
  comments: Comment[] | null;
}

interface Comment {
  id: number;
  text: string | null;
  createdAt: string;
  postID: number;
  author: string | null;
}

const API_URI = process.env.NEXT_PUBLIC_API_URI || "";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PostPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    userID: "user123",
  });

  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (searchTerm) params.append("search", searchTerm);

  const {
    data: posts,
    error,
    isLoading,
  } = useSWR<Post[]>(`${API_URI}/api/Post?${params}`, fetcher);

  const createPost = async () => {
    try {
      const params = new URLSearchParams({
        title: formData.title,
        content: formData.content,
        userID: formData.userID,
      });

      const response = await fetch(`${API_URI}/api/Post?${params}`, {
        method: "POST",
      });

      if (response.ok) {
        setIsCreateOpen(false);
        setFormData({ title: "", content: "", userID: "user123" });
        mutate(`${API_URI}/api/Post?${params}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const updatePost = async () => {
    if (!editingPost) return;

    try {
      const params = new URLSearchParams({
        title: formData.title,
        content: formData.content,
        userID: formData.userID,
      });

      const response = await fetch(
        `${API_URI}/api/Post/${editingPost.id}?${params}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        setIsEditOpen(false);
        setEditingPost(null);
        setFormData({ title: "", content: "", userID: "user123" });
        mutate(`${API_URI}/api/Post?${params}`);
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const deletePost = async (id: number) => {
    try {
      const response = await fetch(`${API_URI}/api/Post/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        mutate(`${API_URI}/api/Post?${params}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      content: post.content || "",
      userID: "user123",
    });
    setIsEditOpen(true);
  };

  const openCreateDialog = () => {
    setFormData({ title: "", content: "", userID: "user123" });
    setIsCreateOpen(true);
  };

  if (error)
    return <div className="container mx-auto p-6">Failed to load posts</div>;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Posts</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter post title"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Enter post content"
                    rows={4}
                  />
                </div>
                <Button onClick={createPost} className="w-full">
                  Create Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts?.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.title || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {post.content || "-"}
                      </TableCell>
                      <TableCell>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{post.comments?.length || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(post)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this post?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deletePost(post.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="py-2 px-4">Page {page}</span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!posts || posts.length < pageSize}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter post title"
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Enter post content"
                rows={4}
              />
            </div>
            <Button onClick={updatePost} className="w-full">
              Update Post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
