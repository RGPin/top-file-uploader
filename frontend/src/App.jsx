import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  async function testFetch() {
    try {
      const reponse = await fetch("/api/user/profile");
      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  }

  useEffect(() => {
    testFetch();
  }, []);
  return <h1>Haru warudo</h1>;
}

export default App;
