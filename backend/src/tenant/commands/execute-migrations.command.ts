import { InjectRepository } from "@nestjs/typeorm"
import { CommandRunner, Command, Option } from "nest-commander"
import { Connection, Repository } from "typeorm"
import { Tenant } from "../tenant.entity"
import { getTenantConnection } from "../tenant.utils"
import { actionsByMigrationAction, isValidMigrationAction, messagesByMigratonAction } from "./migration-command.utils"
import { TenantMigrationsCommandOptions } from "./types/tenant-migrations-command-options"


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
        isValidMigrationAction(options.type)

        const tenant: Tenant = await this.repository.findOne({
            where: {
                name: options.tenant
            }
        })
        const message = messagesByMigratonAction[options.type](options.tenant)
        console.log(message.START_MESSAGE)
        const connection: Connection = await getTenantConnection(tenant)
        await actionsByMigrationAction[options.type](connection)
        await connection.close()
        console.log(message.END_MESSAGE)
    }

    @Option({
        flags: '--tenant [string]',
        description: 'The tenant name to execute migrations'
    })
    parseSchema(val: string): string {
        return val;
    }

    @Option({
        flags: '--type [string]',
        description: 'The type to run migrations or rollback migrations'
    })
    parseType(val: string): string {
        return val;
    }

}