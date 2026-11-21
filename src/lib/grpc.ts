import path from "node:path";
import * as grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const protoPath = path.join(process.cwd(), "contracts/employee/v1/employee.proto");
const definition = protoLoader.loadSync(protoPath, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const loaded = grpc.loadPackageDefinition(definition) as any;
const EmployeeService = loaded.vira.employee.v1.EmployeeService;

const address = process.env.VIRATASK_GRPC_ADDRESS ?? "localhost:5000";
const client = new EmployeeService(address, grpc.credentials.createInsecure());

export function callGrpc<T>(method: string, request: Record<string, unknown> = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    client[method](request, new grpc.Metadata(), { deadline: Date.now() + 10_000 }, (error: grpc.ServiceError | null, response: T) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}

export function grpcHttpStatus(error: unknown): number {
  const code = (error as grpc.ServiceError)?.code;
  switch (code) {
    case grpc.status.INVALID_ARGUMENT: return 400;
    case grpc.status.NOT_FOUND: return 404;
    case grpc.status.ALREADY_EXISTS: return 409;
    case grpc.status.UNAVAILABLE: return 503;
    case grpc.status.DEADLINE_EXCEEDED: return 504;
    case grpc.status.CANCELLED: return 499;
    default: return 500;
  }
}

export function errorMessage(error: unknown): string {
  const code = (error as grpc.ServiceError)?.code;
  switch (code) {
    case grpc.status.INVALID_ARGUMENT: return "اطلاعات واردشده معتبر نیست.";
    case grpc.status.NOT_FOUND: return "کارمند موردنظر پیدا نشد.";
    case grpc.status.ALREADY_EXISTS: return "این کد ملی قبلاً ثبت شده است.";
    case grpc.status.UNAVAILABLE: return "ارتباط با سرور برقرار نیست. وضعیت بک‌اند را بررسی کنید.";
    case grpc.status.DEADLINE_EXCEEDED: return "زمان پاسخ‌گویی سرور به پایان رسید.";
    case grpc.status.CANCELLED: return "درخواست لغو شد.";
    default: return "خطای غیرمنتظره‌ای در سرور رخ داد.";
  }
}