import { CommandRunner, Command } from "nest-commander"
import { Repository } from "typeorm"
import { InjectRepository } from '@nestjs/typeorm';
import { getTenantConnection } from "../tenant.utils";
import { Tenant } from "../tenant.entity";

@Command({ name: 'tenant-all-migrations', description: 'Execute migrations to all tenants' })
export class ExecuteMigrationsAllTenantsCommand implements CommandRunner {

    constructor(
        @InjectRepository(Tenant) private repository: Repository<Tenant>,
    ) {
    }

    async run(
        passedParam: string[],
    ): Promise<void> {
        try {
            let tenants = await this.repository.find({ where: {} })
            tenants = tenants.filter(item => item.getHost() != null)
            for (let index = 0; index < tenants.length; index += 1) {
                const connectionCreated = await getTenantConnection(tenants[index])
                await connectionCreated.runMigrations()
                await connectionCreated.close()
                console.log(`>>>> Executed migrations success to the tenant ${connectionCreated.name}`)
            }
        } catch (error) {
            console.log(error);
        }
    }

}