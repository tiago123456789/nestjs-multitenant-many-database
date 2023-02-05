import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TenantModule } from 'src/tenant/tenant.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    TenantModule,
    JwtModule.register({ secret: 'hard!to-guess_secret' }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
