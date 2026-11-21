import { NextResponse } from "next/server";
import { callGrpc, errorMessage, grpcHttpStatus } from "@/lib/grpc";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const employee = await callGrpc("getEmployee", { id });
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ message: errorMessage(error) }, { status: grpcHttpStatus(error) });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const employee = await callGrpc("updateEmployee", {
      id,
      firstName: body.firstName,
      lastName: body.lastName,
      nationalCode: body.nationalCode,
      birthDate: body.birthDate,
    });
    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json({ message: errorMessage(error) }, { status: grpcHttpStatus(error) });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const result = await callGrpc("deleteEmployee", { id });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: errorMessage(error) }, { status: grpcHttpStatus(error) });
  }
}