import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Inquiry } from '@/models/Inquiry';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get('type')?.trim();
    const statusFilter = searchParams.get('status')?.trim();
    const search = searchParams.get('search')?.trim();

    const query: Record<string, unknown> = {};

    if (typeFilter && typeFilter !== 'all') {
      query.type = typeFilter;
    }

    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { 'timepiece.title': { $regex: search, $options: 'i' } },
        { 'timepiece.brand': { $regex: search, $options: 'i' } },
        { 'timepiece.reference': { $regex: search, $options: 'i' } },
      ];
    }

    const [inquiries, totalCount, watchCount, generalCount, newCount] = await Promise.all([
      Inquiry.find(query).sort({ createdAt: -1 }).lean(),
      Inquiry.countDocuments({}),
      Inquiry.countDocuments({ type: 'watch' }),
      Inquiry.countDocuments({ type: 'general' }),
      Inquiry.countDocuments({ status: 'new' }),
    ]);

    return NextResponse.json(
      {
        success: true,
        inquiries,
        counts: {
          totalCount,
          watchCount,
          generalCount,
          newCount,
        },
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to retrieve inquiries';
    console.error('[API_ADMIN_INQUIRIES_GET_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { inquiryId, status, adminNotes } = body;

    if (!inquiryId) {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID is required' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const updateFields: Record<string, unknown> = {};

    if (status && ['new', 'in_review', 'resolved'].includes(status)) {
      updateFields.status = status;
    }

    if (adminNotes !== undefined && typeof adminNotes === 'string') {
      updateFields.adminNotes = adminNotes.trim();
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      inquiryId,
      { $set: updateFields },
      { new: true, strict: false }
    ).lean();

    if (!updatedInquiry) {
      return NextResponse.json(
        { success: false, error: 'Inquiry record not found in database' },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        inquiry: updatedInquiry,
        message: 'Inquiry status updated successfully',
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to update inquiry';
    console.error('[API_ADMIN_INQUIRIES_PATCH_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    let inquiryId = searchParams.get('id');

    if (!inquiryId) {
      try {
        const body = await req.json();
        inquiryId = body.id || body.inquiryId;
      } catch {
        // Query param is primary
      }
    }

    if (!inquiryId) {
      return NextResponse.json(
        { success: false, error: 'Inquiry ID is required for deletion' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const deleted = await Inquiry.findByIdAndDelete(inquiryId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Inquiry record not found in database' },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry deleted successfully from salon vault',
        deletedId: inquiryId,
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to delete inquiry';
    console.error('[API_ADMIN_INQUIRIES_DELETE_ERROR]:', error);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

