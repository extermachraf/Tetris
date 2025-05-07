"use client";
import React from "react";
import useUserStore from "@/store/useUserStore";

const page = () => {
  const { currentUser } = useUserStore();
  return (
    <div>
      <h1>Coming soon ...</h1>
      {currentUser ? (
        <div>
          <h2>User Details</h2>
          <p>ID: {currentUser.id}</p>
          <p>Username: {currentUser.username}</p>
          <p>Email: {currentUser.email}</p>
          <p>Created at: {currentUser.createdat}</p>
          <p>Updated at: {currentUser.updatedat}</p>
        </div>
      ) : (
        <p>No user logged in yet</p>
      )}
    </div>
  );
};

export default page;
