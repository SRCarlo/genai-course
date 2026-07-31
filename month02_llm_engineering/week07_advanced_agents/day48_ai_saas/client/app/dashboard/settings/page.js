"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("Ninja");

  const [email, setEmail] = useState("ninja@gmail.com");

  const saveProfile = () => {
    alert("Profile updated successfully");
  };

  return (
    <div>
      <h1
        className="
text-4xl
font-bold
mb-3
"
      >
        Settings ⚙️
      </h1>

      <p
        className="
text-gray-500
mb-8
"
      >
        Manage your account and preferences
      </p>

      {/* Profile Section */}

      <div
        className="
bg-white
rounded-2xl
shadow
p-8
mb-8
"
      >
        <h2
          className="
text-2xl
font-bold
mb-6
"
        >
          Profile Information
        </h2>

        <div
          className="
flex
items-center
gap-5
mb-8
"
        >
          <div
            className="
w-20
h-20
rounded-full
bg-blue-600
text-white
flex
items-center
justify-center
text-3xl
"
          >
            N
          </div>

          <div>
            <h3
              className="
text-xl
font-bold
"
            >
              Ninja
            </h3>

            <p
              className="
text-gray-500
"
            >
              AI Developer
            </p>
          </div>
        </div>

        <label
          className="
font-semibold
"
        >
          Full Name
        </label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
w-full
border
rounded-xl
p-3
mt-2
mb-5
"
        />

        <label
          className="
font-semibold
"
        >
          Email Address
        </label>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
w-full
border
rounded-xl
p-3
mt-2
"
        />

        <button
          onClick={saveProfile}
          className="
mt-6
bg-blue-600
text-white
px-8
py-3
rounded-xl
"
        >
          Save Changes
        </button>
      </div>

      {/* Password */}

      <div
        className="
bg-white
rounded-2xl
shadow
p-8
mb-8
"
      >
        <h2
          className="
text-2xl
font-bold
mb-5
"
        >
          Security 🔐
        </h2>

        <p
          className="
text-gray-600
mb-5
"
        >
          Update your password to keep your account secure.
        </p>

        <button
          className="
bg-gray-900
text-white
px-6
py-3
rounded-xl
"
        >
          Change Password
        </button>
      </div>

      {/* API Key */}

      <div
        className="
bg-white
rounded-2xl
shadow
p-8
mb-8
"
      >
        <h2
          className="
text-2xl
font-bold
mb-5
"
        >
          API Access 🔑
        </h2>

        <p
          className="
text-gray-600
mb-4
"
        >
          Your AI API key for external integrations.
        </p>

        <div
          className="
bg-gray-100
p-4
rounded-xl
font-mono
"
        >
          sk-ai-xxxxxxxxxxxx
        </div>

        <button
          className="
mt-5
bg-blue-600
text-white
px-6
py-3
rounded-xl
"
        >
          Regenerate Key
        </button>
      </div>

      {/* Danger Zone */}

      <div
        className="
bg-red-50
border
border-red-200
rounded-2xl
p-8
"
      >
        <h2
          className="
text-2xl
font-bold
text-red-600
mb-4
"
        >
          Danger Zone ⚠️
        </h2>

        <p
          className="
text-gray-600
mb-5
"
        >
          Deleting your account permanently removes all data.
        </p>

        <button
          className="
bg-red-600
text-white
px-6
py-3
rounded-xl
"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
