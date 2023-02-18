import { BadRequestException, HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Response } from "express";
import RequestWithTenantId from "src/common/contracts/request-with-tenantId.contract";
import { TenantService } from "./tenant.service";
import { getTenantConnection, getTenantName } from "./tenant.utils"


@Injectable()
export class TenantMiddleware implements NestMiddleware {

    constructor(
        private readonly tenantService: TenantService,
        private readonly jwtService: JwtService,
    ) {
    }

    private async createConnectionByTenantId(tenantId: string) {
        const tenant = await this.tenantService.getByName(tenantId);
        if (!tenant) {
            throw new HttpException("Tenant is invalid!", 400)
        }

        const connectionCreated = await getTenantConnection(tenant)
        if (!connectionCreated) {
            throw new BadRequestException(
                'Database Connection Error',
                'There is a Error with the Database!',
            );
        }

    }

    async use(req: RequestWithTenantId, res: Response, next: NextFunction) {
        const host = req.headers["origin"] || req.headers["host"];
        let accessToken = req.get('Authorization');
        let tenantId = host 
                        .replace("https://", "")
                        .replace("http://", "")
                        .split(".")[0];

        if (accessToken) {
            try {
                accessToken = accessToken.replace('Bearer ', '');
                const payload = this.jwtService.verify(accessToken);
                tenantId = payload.tenantId;
            } catch (error) {
                return res.status(403).json({ message: 'You need informed accessToken valid' });
            }
        }

        req.tenantId = getTenantName(tenantId);
        await this.createConnectionByTenantId(tenantId)
        next();
    }
}