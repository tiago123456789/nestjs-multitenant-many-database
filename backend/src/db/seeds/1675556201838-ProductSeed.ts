import { Product } from 'src/product/product.entity';
import { Tenant } from 'src/tenant/tenant.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductSeed1675556201838 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tenant = new Tenant();
    tenant.setDomain('test2.app.br');
    await queryRunner.manager.insert(Tenant, tenant);

    const product = new Product();
    product.setName('Smart phone');
    product.setPrice(1000);
    product.setImage(
      'https://brmotorolanew.vtexassets.com/arquivos/ids/163515-1600-auto?v=638084402112630000&width=1600&height=auto&aspect=true',
    );
    product.setTenant(tenant);
    await queryRunner.manager.insert(Product, [product]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(Product, {});
    await queryRunner.manager.delete(Tenant, {});
  }
}
