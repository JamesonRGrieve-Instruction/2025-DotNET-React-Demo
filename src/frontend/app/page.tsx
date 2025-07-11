"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  ArrowRight,
  FileText,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

const API_URI = process.env.NEXT_PUBLIC_API_URI || "";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Stats {
  posts: number;
  comments: number;
  recentActivity: boolean;
}

export default function LandingPage() {
  const { data: posts } = useSWR(`${API_URI}/api/Post?pageSize=1000`, fetcher);
  const { data: comments } = useSWR(
    `${API_URI}/api/Comment?pageSize=1000`,
    fetcher
  );

  const stats: Stats = {
    posts: posts?.length || 0,
    comments: comments?.length || 0,
    recentActivity:
      posts?.some((p: any) => {
        const date = new Date(p.createdAt);
        const dayAgo = new Date();
        dayAgo.setDate(dayAgo.getDate() - 1);
        return date > dayAgo;
      }) || false,
  };

  const resources = [
    {
      name: "Post",
      icon: FileText,
      operations: ["GET", "POST", "PUT", "DELETE"],
      path: "/api/Post",
      description: "Manage blog posts and articles",
    },
    {
      name: "Comment",
      icon: MessageSquare,
      operations: ["GET", "POST", "PUT", "DELETE"],
      path: "/api/Comment",
      description: "Handle user comments on posts",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
          Backend API Dashboard
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A modern content management system with full CRUD operations for Posts
          and Comments
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/post">
              <FileText className="mr-2 h-5 w-5" />
              Manage Posts
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/comment">
              <MessageSquare className="mr-2 h-5 w-5" />
              Manage Comments
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.posts}</div>
            <p className="text-xs text-muted-foreground">
              Active content pieces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Comments
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.comments}</div>
            <p className="text-xs text-muted-foreground">User interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.posts > 0
                ? (stats.comments / stats.posts).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Comments per post</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Activity Status
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={stats.recentActivity ? "default" : "secondary"}>
                {stats.recentActivity ? "Active" : "Idle"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {resource.name} Management
                </CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">
                      Available Operations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {resource.operations.map((op) => (
                        <Badge key={op} variant="outline">
                          {op}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">API Endpoint</h4>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {resource.path}
                    </code>
                  </div>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/${resource.name.toLowerCase()}`}>
                      Go to {resource.name}s
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">API Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold mb-2">Version</h3>
            <p className="text-muted-foreground">1.0</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Base URL</h3>
            <code className="text-sm bg-background px-2 py-1 rounded">
              {API_URI || "Not configured"}
            </code>
          </div>
          <div>
            <h3 className="font-semibold mb-2">OpenAPI Specification</h3>
            <p className="text-muted-foreground">3.0.4</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Available Resources</h3>
            <p className="text-muted-foreground">Post, Comment</p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <a
              href={`${API_URI}/swagger`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Interactive API Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
