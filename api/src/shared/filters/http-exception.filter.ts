import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common';
import {Response} from 'express';
import {isNil, isUndefined} from '@nestjs/common/utils/shared.utils';

@Catch(HttpException)
export class HttpExceptionFilters implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        console.log(
            JSON.stringify({
                status: status,
                timestamp: new Date().toISOString(),
                reason: this.isEmpty(exception.response.reason) ? exception.response.message : exception.response.reason,
                message: exception.response.message,
            }),
        );

        response
            .status(status)
            .json({
                type: this.isEmpty(exception.response.reason) ? 'https://etv.co.za/errors/general-exception' : exception.response.reason.type,
                title: this.isEmpty(exception.response.reason) ? 'Etv App General Exception' : exception.response.reason.title,
                status: status,
                timestamp: new Date().toISOString(),
                detail: this.isEmpty(exception.response.reason) ? JSON.stringify(exception.response.message) : exception.response.reason.detail,
            });
    }


    isEmpty(errorMessage: any): boolean {
        return isNil(errorMessage) || isUndefined(errorMessage);
    }
}
