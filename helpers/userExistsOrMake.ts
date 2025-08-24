import { prisma } from "../server";

export default async function userExistsOrMake() {
  const user = await prisma.user.findFirst();
  if (!user) {
    await prisma.user.create({
      data: {
        username: "admin",
        password: "admin",
      },
    });
  }
}
