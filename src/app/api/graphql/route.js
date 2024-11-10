import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/graphql/schema";
import prisma from "@/lib/prisma";

const resolvers = {
  Query: {
    users: async () => {
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return users;
    },
    user: async (_, { id }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      return user;
    },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      try {
        const user = await prisma.user.create({
          data: {
            name,
            email,
          },
        });
        return user;
      } catch (error) {
        if (error.code === "P2002") {
          throw new Error("A user with this email already exists");
        }
        throw error;
      }
    },
    updateUser: async (_, { id, name, email }) => {
      try {
        const user = await prisma.user.update({
          where: {
            id: parseInt(id),
          },
          data: {
            name,
            email,
          },
        });
        return user;
      } catch (error) {
        if (error.code === "P2002") {
          throw new Error("A user with this email already exists");
        }
        throw error;
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        await prisma.user.delete({
          where: {
            id: parseInt(id),
          },
        });
        return true;
      } catch (error) {
        return false;
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);
export { handler as GET, handler as POST };