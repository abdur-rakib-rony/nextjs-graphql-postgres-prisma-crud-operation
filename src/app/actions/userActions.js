"use server";

import { revalidatePath } from "next/cache";

async function fetchGraphQL(query, variables = {}) {
  try {
    const response = await fetch("http://localhost:3000/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
      next: { 
        tags: ["users"],
        revalidate: 0 
      }
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result;
  } catch (error) {
    throw new Error(error.message || "An error occurred");
  }
}

export async function getUsers() {
  try {
    const { data } = await fetchGraphQL(`
      query GetUsers {
        users {
          id
          name
          email
          createdAt
          updatedAt
        }
      }
    `);
    return { users: data.users };
  } catch (error) {
    return { error: error.message };
  }
}

export async function createUser(name, email) {
  try {
    const { data } = await fetchGraphQL(
      `
      mutation CreateUser($name: String!, $email: String!) {
        createUser(name: $name, email: $email) {
          id
          name
          email
        }
      }
    `,
      { name, email }
    );

    revalidatePath("/");
    return { success: true, user: data.createUser };
  } catch (error) {
    return { error: error.message };
  }
}

export async function updateUser(id, name, email) {
  try {
    const { data } = await fetchGraphQL(
      `
      mutation UpdateUser($id: ID!, $name: String!, $email: String!) {
        updateUser(id: $id, name: $name, email: $email) {
          id
          name
          email
        }
      }
    `,
      { id, name, email }
    );

    revalidatePath("/");
    return { success: true, user: data.updateUser };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteUser(id) {
  try {
    await fetchGraphQL(
      `
      mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
      }
    `,
      { id }
    );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}
