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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Comment {
  id: number;
  text: string | null;
  createdAt: string;
  postID: number;
  post?: Post;
  author: string | null;
}

interface Post {
  id: number;
  title: string | null;
  content: string | null;
  createdAt: string;
  comments?: Comment[] | null;
}

const API_URI = process.env.NEXT_PUBLIC_API_URI || "";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CommentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    author: "",
    postID: "",
  });

  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (searchTerm) params.append("search", searchTerm);

  const {
    data: comments,
    error,
    isLoading,
  } = useSWR<Comment[]>(`${API_URI}/api/Comment?${params}`, fetcher);

  const { data: allPosts } = useSWR<Post[]>(
    `${API_URI}/api/Post?pageSize=1000`,
    fetcher
  );

  const getPostTitle = (comment: Comment) => {
    if (comment.post?.title) return comment.post.title;
    const post = allPosts?.find((p) => p.id === comment.postID);
    return post?.title || "-";
  };

  const createComment = async () => {
    try {
      const params = new URLSearchParams({
        text: formData.text,
        author: formData.author,
        postID: formData.postID,
      });

      const response = await fetch(`${API_URI}/api/Comment?${params}`, {
        method: "POST",
      });

      if (response.ok) {
        setIsCreateOpen(false);
        setFormData({ text: "", author: "", postID: "" });
        await mutate(`${API_URI}/api/Comment?${params}`);
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const updateComment = async () => {
    if (!editingComment) return;

    try {
      const params = new URLSearchParams({
        text: formData.text,
        author: formData.author,
        postID: formData.postID,
      });

      const response = await fetch(
        `${API_URI}/api/Comment/${editingComment.id}?${params}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        setIsEditOpen(false);
        setEditingComment(null);
        setFormData({ text: "", author: "", postID: "" });
        await mutate(`${API_URI}/api/Comment?${params}`);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const deleteComment = async (id: number) => {
    try {
      const response = await fetch(`${API_URI}/api/Comment/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await mutate(`${API_URI}/api/Comment?${params}`);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const openEditDialog = (comment: Comment) => {
    setEditingComment(comment);
    setFormData({
      text: comment.text || "",
      author: comment.author || "",
      postID: comment.postID.toString(),
    });
    setIsEditOpen(true);
  };

  const openCreateDialog = () => {
    setFormData({ text: "", author: "", postID: "" });
    setIsCreateOpen(true);
  };

  if (error)
    return <div className="container mx-auto p-6">Failed to load comments</div>;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Comments</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Create Comment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Comment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="text">Comment Text</Label>
                  <Textarea
                    id="text"
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({ ...formData, text: e.target.value })
                    }
                    placeholder="Enter comment text"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    placeholder="Enter author name"
                  />
                </div>
                <div>
                  <Label htmlFor="post">Post</Label>
                  <Select
                    value={formData.postID}
                    onValueChange={(value) =>
                      setFormData({ ...formData, postID: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a post" />
                    </SelectTrigger>
                    <SelectContent>
                      {allPosts?.map((post) => (
                        <SelectItem key={post.id} value={post.id.toString()}>
                          {post.title || `Post ${post.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={createComment} className="w-full">
                  Create Comment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search comments..."
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
                    <TableHead>Text</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Post</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments?.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="max-w-xs truncate">
                        {comment.text || "-"}
                      </TableCell>
                      <TableCell>{comment.author || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {getPostTitle(comment)}
                      </TableCell>
                      <TableCell>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(comment)}
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
                                <AlertDialogTitle>
                                  Delete Comment
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this comment?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteComment(comment.id)}
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
                  disabled={!comments || comments.length < pageSize}
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
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-text">Comment Text</Label>
              <Textarea
                id="edit-text"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                placeholder="Enter comment text"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-author">Author</Label>
              <Input
                id="edit-author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="Enter author name"
              />
            </div>
            <div>
              <Label htmlFor="edit-post">Post</Label>
              <Select
                value={formData.postID}
                onValueChange={(value) =>
                  setFormData({ ...formData, postID: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a post" />
                </SelectTrigger>
                <SelectContent>
                  {allPosts?.map((post) => (
                    <SelectItem key={post.id} value={post.id.toString()}>
                      {post.title || `Post ${post.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={updateComment} className="w-full">
              Update Comment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
