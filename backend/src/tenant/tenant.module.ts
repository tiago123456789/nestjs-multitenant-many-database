import { CacheModule, MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { Tenant } from './tenant.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CONNECTION } from 'src/common/types/tenant';
import RequestWithTenantId from 'src/common/contracts/request-with-tenantId.contract';
import { REQUEST } from '@nestjs/core';
import { ExecuteMigrationsCommand } from './commands/execute-migrations.command';
import { ExecuteSeedCommand } from './commands/execute-seeds.command';
import { ExecuteMigrationsAllTenantsCommand } from './commands/execute-migrations-all-tenants.command';
import { TenantMiddleware } from "./tenant.middleware"
import { getConnection } from 'typeorm'

const cacheConfig = {
  store: 'memory',
}

const tenantConfigProvider = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  inject: [REQUEST],
  useFactory: (request: RequestWithTenantId) => {
    if (request.tenantId) {
      return getConnection(request.tenantId);
    }

    return null;
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    CacheModule.register(cacheConfig),
    JwtModule.registerAsync({
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get("JWT_SECRET")
        }
      },
      inject: [ConfigService]
    }),
  ],
  controllers: [TenantController],
  providers: [
    TenantService,
    tenantConfigProvider,
    ExecuteMigrationsCommand,
    ExecuteSeedCommand,
    ExecuteMigrationsAllTenantsCommand
  ],
  exports: [
    TenantService,
    CacheModule.register(cacheConfig),
    tenantConfigProvider
  ],
})
export class TenantModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(TenantMiddleware)
        .forRoutes("/products", "/admin/products");
    }
}
