import { PrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function GET() {
  const patrons = await prisma.patron.findMany();
  return NextResponse.json(patrons);
}
