import { InjectRepository } from "@nestjs/typeorm"
import { CommandRunner, Command, Option } from "nest-commander"
import { Connection, Repository } from "typeorm"
import { Tenant } from "../tenant.entity"
import { getTenantConnection, getTenantName } from "../tenant.utils"

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
        const tenant = await this.repository.findOne({ 
            where: {
                name: getTenantName(options.tenant)
            }
        })

        if (!tenant) {
            throw new Error("Tenant not exist")
        }

        console.log(`>>>> Executing migrations to the tenant ${options.tenant}`)
        const connection: Connection = await getTenantConnection(tenant, true)
        await connection.runMigrations()
        console.log(">>>> Executed seeds success")
    }

    @Option({
        flags: '-t, --tenant [string]',
        description: 'The tenant name to execute migrations'
    })
    parseString(val: string): string {
        return val;
    }

}