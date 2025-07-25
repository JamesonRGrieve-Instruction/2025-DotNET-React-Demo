import { PrismaClient } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET() {
  const books = await prisma.book.findMany();
  return NextResponse.json(books);
}
export async function POST(request: NextRequest) {
  const { isbn, title, author } = await request.json();
  return NextResponse.json(
    await prisma.book.create({
      data: { isbn, title, author },
    }),
    {
      status: 201,
    }
  );
}

// export async function GET(request: NextRequest, { params }) {
//   return NextResponse.json(
//     await prisma.book.get({
//       where: { id: parseInt(params.id) },
//     }),
//     { status: 200 }
//   );
// }
