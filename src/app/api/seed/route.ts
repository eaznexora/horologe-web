import { NextResponse } from 'next/server';
import { POST as seedCategories } from '../admin/categories/seed/route';

export async function POST(req: Request) {
  return seedCategories();
}

export async function GET(req: Request) {
  return seedCategories();
}
