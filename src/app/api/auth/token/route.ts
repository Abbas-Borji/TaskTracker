import {getToken} from 'next-auth/jwt';
import {NextRequest, NextResponse} from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export async function GET (request: NextRequest) {
  const token = await getToken({req: request});
  const session = await getServerSession(authOptions);
  return NextResponse.json({token, session});
}