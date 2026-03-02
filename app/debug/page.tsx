// app/debug/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function DebugPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Debug page - Session:", session);
    console.log("Debug page - Status:", status);
  }, [session, status]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Session Debug Page</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-lg font-semibold mb-2">Session Status</h2>
          <p className="text-gray-600">{status}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Session Data</h2>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        {session?.user && (
          <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-2">User Info</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {session.user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {session.user.email}
              </p>
              <p>
                <span className="font-medium">Role:</span>{" "}
                {session.user.role || "Not set"}
              </p>
              <p>
                <span className="font-medium">Is Admin:</span>{" "}
                {session.user.isAdmin ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
