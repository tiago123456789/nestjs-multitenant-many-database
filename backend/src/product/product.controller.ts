import {
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import RequestWithTenantId from 'src/common/contracts/request-with-tenantId.contract';
import { ProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/products')
  getAllByTenantId(@Req() request: RequestWithTenantId): Promise<Product[]> {
    return this.productService.getAll();
  }

  @Post('/admin/products')
  create(@Req() request: RequestWithTenantId, @Body() productDto: ProductDto) {
    return this.productService.create(productDto);
  }

  @Get('/admin/products')
  getAllByTenantIdToShowAdmin(
    @Req() request: RequestWithTenantId,
  ): Promise<Product[]> {
    return this.productService.getAll();
  }
}
