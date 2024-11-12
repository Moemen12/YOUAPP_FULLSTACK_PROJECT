import { Catch, RpcExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { RpcException } from "@nestjs/microservices";

@Catch()
export class MicroserviceExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    console.log("Log execption in ", exception);

    if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    }
    return throwError(() => ({
      message: exception.message,
      status: exception.status || 500,
      error: exception.error || "Internal server error",
    }));
  }
}
