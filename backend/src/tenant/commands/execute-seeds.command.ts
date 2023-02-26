import { InjectRepository } from "@nestjs/typeorm"
import { CommandRunner, Command, Option } from "nest-commander"
import { Connection, Repository } from "typeorm"
import { Tenant } from "../tenant.entity"
import { getTenantConnection } from "../tenant.utils"

interface TenantSeedsCommandOptions {
    tenant: string;
}

@Command({ name: 'tenant-seeds', description: 'Execute seeds to the tenant' })
export class ExecuteSeedCommand implements CommandRunner {

    constructor(
        @InjectRepository(Tenant) private repository: Repository<Tenant>,
    ) {
    }

    async run(
        passedParam: string[],
        options: TenantSeedsCommandOptions
    ): Promise<void> {
        const tenant: Tenant = await this.repository.findOne({
            where: {
                name: options.tenant
            }
        })

        console.log(`>>>> Executing seeds to the tenant ${options.tenant}`)
        const connection: Connection = await getTenantConnection(tenant, true)
        await connection.runMigrations()
        console.log(">>>> Executed seeds success")
    }

    @Option({
        flags: '--tenant [string]',
        description: 'The tenant name to execute migrations'
    })
    parseName(val: string): string {
        return val;
    }

}