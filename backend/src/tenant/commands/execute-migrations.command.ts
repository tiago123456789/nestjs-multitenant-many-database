import { InjectRepository } from "@nestjs/typeorm"
import { CommandRunner, Command, Option } from "nest-commander"
import { Connection, Repository } from "typeorm"
import { Tenant } from "../tenant.entity"
import { getTenantConnection, getTenantName } from "../tenant.utils"

interface TenantMigrationsCommandOptions {
    tenant: string;
}

@Command({ name: 'tenant-migrations', description: 'Execute migrations to the tenant' })
export class ExecuteMigrationsCommand implements CommandRunner {

    constructor(
        @InjectRepository(Tenant) private repository: Repository<Tenant>,
    ) {
    }

    async run(
        passedParam: string[],
        options: TenantMigrationsCommandOptions
    ): Promise<void> {
        const tenant = await this.repository.findOne({ 
            where: {
                name: getTenantName(options.tenant)
            }
        })

        if (!tenant) {
            throw new Error("Tenant not exist")
        }

        console.log(`>>>> Executing migrations to the tenant ${options.tenant}`)
        const connection: Connection = await getTenantConnection(tenant)
        await connection.runMigrations()
        console.log(`>>>> Executed migrations success`)
    }

    @Option({
        flags: '-t, --tenant [string]',
        description: 'The tenant name to execute migrations'
    })
    parseString(val: string): string {
        return val;
    }

}