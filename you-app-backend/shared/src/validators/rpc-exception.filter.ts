import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Response } from "express";

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log("Log execption in ", exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = 500;
    let message: string | string[] = "Internal server error";
    let error: string | null = null;

    // Handle RPC Exceptions
    if (exception instanceof RpcException) {
      const rpcError = exception.getError() as any;
      status = rpcError.status || rpcError.statusCode || 500;
      message = rpcError.message || "Internal server error";
      error = rpcError.error;
    }
    // Handle validation errors
    else if (
      exception?.response?.message &&
      Array.isArray(exception.response.message)
    ) {
      status = exception.status || 400;
      message = exception.response.message[0];
      error = exception.response.error || "Validation Error";
    }
    // Handle direct HTTP exceptions
    else if (exception?.status && exception?.message) {
      status = exception.status;
      message = exception.message;
      error = exception.error;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }
}
