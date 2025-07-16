"use client";
import axios from "axios";
import { setCookie } from "cookies-next";
import { useCallback, useState } from "react";
export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI}/api/auth/login`,
        {
          Email: email,
          Password: password,
        },
        {
          validateStatus: () => true,
        }
      );
      if (result.status === 200) {
        setError("");
        setCookie("jwt", result.data.token);
      } else setError(result.status + " " + result.data.message);
      console.log(result);
    },
    [email, password]
  );
  return (
    <main className="mx-auto w-72">
      <form className="flex flex-col">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>
          Login
        </button>
        {error && <p>ERROR: {error}</p>}
      </form>
    </main>
  );
}
