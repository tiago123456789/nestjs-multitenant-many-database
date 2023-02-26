import { CommandRunner, Command, Option } from "nest-commander"
import { Connection, Repository } from "typeorm"
import {  InjectRepository } from '@nestjs/typeorm';
import { getTenantConnection } from "../tenant.utils";
import { TenantAllMigrationsCommandOptions } from "./types/tenant-all-migrations-command-options.interface"
import { actionsByMigrationAction, isValidMigrationAction, messagesByMigratonAction } from "./migration-command.utils";
import { Tenant } from "../tenant.entity";

@Command({ name: 'tenant-all-migrations', description: 'Execute migrations to all tenants' })
export class ExecuteMigrationsAllTenantsCommand implements CommandRunner {

    constructor(
        @InjectRepository(Tenant) private repository: Repository<Tenant>,
    ) {
    }

    async run(
        passedParam: string[],
        options: TenantAllMigrationsCommandOptions
    ): Promise<void> {
        isValidMigrationAction(options.type)
        let tenants: Array<Tenant> = await this.repository.find({ where: {} })

        for (let index = 0; index < tenants.length; index++) {
            const message = messagesByMigratonAction[options.type](tenants[index].getName())
            console.log(message.START_MESSAGE)
            const connection: Connection = await getTenantConnection(tenants[index])
            await actionsByMigrationAction[options.type](connection)
            await connection.close()
            console.log(message.END_MESSAGE)
        }
    }

    @Option({
        flags: '-t, --type [string]',
        description: 'The action to execute. You can set RUN to run migrations and DOWN undo the last migration'
    })
    parseType(val: string): string {
        return val
    }

}