"use client";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import { publish } from "../graphql/mutations";
import { onMessage } from "../graphql/subscriptions";

const client = generateClient();

export default function Home() {
  const [data, setData] = useState("");
  const [received, setReceived] = useState([]);

  // Define the channel name here
  let name = "robots";

  // Publish data to subscribed clients
  async function handleSubmit(evt) {
    evt.preventDefault();
    if (!data) return;
    await client.graphql({
      query: publish,
      variables: { name, data },
    });
  }

  // subscribe to events
  useEffect(() => {
    const sub = client
      .graphql({ query: onMessage, variables: { tenantCode: "MBC" } })
      .subscribe({
        next: ({ data }) => setReceived((prev) => [...prev, data.onMessage]),
        error: (error) => console.warn(error),
      });
    return () => sub.unsubscribe();
  }, [name]);

  return (
    <div className="App">
      <header className="App-header">
        <p>Send/Push JSON to channel &quot;{name}&quot;...</p>
        <form onSubmit={handleSubmit}>
          <textarea
            rows="5"
            cols="60"
            name="description"
            onChange={(e) => setData(e.target.value)}
            value={data}
            placeholder="Enter valid JSON here... (use quotes for keys and values)"
          ></textarea>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <p>Subscribed/Listening to channel &quot;{name}&quot;...</p>
        <pre>{!received || JSON.stringify(received, null, 2)}</pre>
      </header>
    </div>
  );
}
