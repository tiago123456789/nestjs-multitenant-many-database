import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { Repository } from 'typeorm';
import { TenantDto } from './dtos/tenant.dto';
import { CredentialDto } from './dtos/credential.dto';
import { JwtService } from '@nestjs/jwt';
import { getTenantName } from './tenant.utils';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant) private repository: Repository<Tenant>,
    private readonly jwtService: JwtService,
  ) {}

  getAll(): Promise<Tenant[]> {
    return this.repository.find({ where: {} });
  }

  async authenticate(credentialDto: CredentialDto): Promise<string> {
    const tenantName: string = credentialDto.name

    const tenant: Tenant = await this.getByName(tenantName);
    if (!tenant) {
      throw new HttpException('Credential invalids!', 401);
    }

    return this.jwtService.sign({
      tenantId: tenant.getName(),
    }, { secret: process.env.JWT_SECRET });
  }

  async getByName(name): Promise<Tenant> {
    name = getTenantName(name)
    const tenant = await this.repository.find({ where: { name } });
    return tenant[0];
  }

  getById(id): Promise<Tenant> {
    return this.repository.findOne(id);
  }

  async create(tenantDto: TenantDto): Promise<Tenant> {
    const tenant = new Tenant();
    tenant.setName(getTenantName(tenantDto.name));
    tenant.setHost(tenantDto.host);
    await this.repository.insert(tenant);
    return tenant;
  }
}
