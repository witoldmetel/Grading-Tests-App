import Hapi from "@hapi/hapi";
import { PrismaClient } from "@prisma/client";

import prisma from "../client";

// Define prisma in the Hapi server ---> Module Augmentation
declare module "@hapi/hapi" {
  interface ServerApplicationState {
    prisma: PrismaClient;
  }
}

// plugin to instantiate Prisma Client
const plugin: Hapi.Plugin<undefined> = {
  name: "app/prisma",
  register: async function (server: Hapi.Server) {
    server.app.prisma = prisma;

    server.ext({
      type: "onPostStop",
      method: async (server: Hapi.Server) => {
        server.app.prisma.$disconnect();
      },
    });
  },
};

export default plugin;
