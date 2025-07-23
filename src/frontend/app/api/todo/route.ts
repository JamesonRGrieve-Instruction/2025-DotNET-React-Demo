import { PrismaClient } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}
export async function POST(request: NextRequest) {
  const { title } = await request.json();
  return NextResponse.json(
    await prisma.todo.create({
      data: { title },
    }),
    {
      status: 201,
    }
  );
}

// export async function GET(request: NextRequest, { params }) {
//   return NextResponse.json(
//     await prisma.todo.get({
//       where: { id: parseInt(params.id) },
//     }),
//     { status: 200 }
//   );
// }
