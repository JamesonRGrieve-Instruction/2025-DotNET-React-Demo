import { PrismaClient } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }) {
  const { completed } = await request.json();
  return NextResponse.json(
    await prisma.todo.update({
      where: { id: parseInt((await params).id) },
      data: { completed },
    }),
    { status: 200 }
  );
}

export async function DELETE(request: NextRequest, { params }) {
  await prisma.todo.delete({
    where: { id: parseInt((await params).id) },
  });
  return NextResponse.next({ status: 204 });
}
