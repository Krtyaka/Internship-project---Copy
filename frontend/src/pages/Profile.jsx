import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User } from "lucide-react";

export default function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="text-center mt-10">
        <p className="text-xl">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 card bg-base-200 shadow-xl p-6">
      <div className="flex flex-col items-center">
        <div className="avatar placeholder mb-4">
          <div className="bg-primary text-primary-content rounded-full w-24">
            <span className="text-3xl">{user.name?.charAt(0) || <User />}</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold">{user.name}</h2>
        <p className="text-sm opacity-70">{user.role}</p>
      </div>

      <div className="divider"></div>

      <div className="space-y-2">
        <p>
          <span className="font-bold">Email:</span> {user.email}
        </p>
        {user.department && (
          <p>
            <span className="font-bold">Department:</span> {user.department}
          </p>
        )}
        {user.year && (
          <p>
            <span className="font-bold">Year:</span> {user.year}
          </p>
        )}
      </div>
    </div>
  );
}
