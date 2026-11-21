import { NextResponse } from "next/server";
import { callGrpc, errorMessage, grpcHttpStatus } from "@/lib/grpc";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await callGrpc<{ employees: unknown[] }>("listEmployees");
    return NextResponse.json(result.employees ?? []);
  } catch (error) {
    return NextResponse.json({ message: errorMessage(error) }, { status: grpcHttpStatus(error) });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const employee = await callGrpc("createEmployee", {
      firstName: body.firstName,
      lastName: body.lastName,
      nationalCode: body.nationalCode,
      birthDate: body.birthDate,
    });
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: errorMessage(error) }, { status: grpcHttpStatus(error) });
  }
}