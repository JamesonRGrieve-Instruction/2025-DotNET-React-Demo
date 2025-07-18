"use client";
import api from "@/lib/api";
import useSWR from "swr";
export default function Home() {
  const { data, isLoading, error } = useSWR("weather", async () => {
    return (await api.get("/api/joke")).data;
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.toString()}</div>;
  }
  return (
    <main>
      <p>{data}</p>
    </main>
  );
}
