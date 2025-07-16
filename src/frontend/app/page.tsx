"use client";
import api from "@/lib/api";
import useSWR from "swr";
export default function Home() {
  const { data, isLoading, error } = useSWR("weather", async () => {
    return (await api.get("/weatherforecast")).data;
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.toString()}</div>;
  }
  return (
    <main>
      <ul>
        {data.map((weatherObj: any, index: number) => (
          <li key={index}>
            {weatherObj.date} - {weatherObj.summary}: {weatherObj.temperatureC}c
            ({weatherObj.temperatureF}f)
          </li>
        ))}
      </ul>
    </main>
  );
}
