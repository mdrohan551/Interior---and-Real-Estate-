import { NextResponse } from "next/server";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
}

export function apiSuccess<T>(data: T, message = "Operation successful", status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function apiError(
  message = "An error occurred",
  code = "INTERNAL_SERVER_ERROR",
  status = 500,
  details?: unknown
) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      message,
      error: {
        code,
        details,
      },
    },
    { status }
  );
}
