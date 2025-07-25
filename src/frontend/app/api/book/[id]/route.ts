import { PrismaClient } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }) {
  const { patronId } = await request.json();
  return NextResponse.json(
    await prisma.book.update({
      where: { id: parseInt((await params).id) },
      data: { patronId: parseInt(patronId) },
    }),
    { status: 200 }
  );
}

export async function DELETE(request: NextRequest, { params }) {
  await prisma.book.delete({
    where: { id: parseInt((await params).id) },
  });
  return NextResponse.next({ status: 204 });
}
