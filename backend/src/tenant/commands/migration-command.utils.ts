import { MigrationActions } from "./types/migration-action";
import { Connection } from "typeorm"

export const actionsByMigrationAction = {
    [MigrationActions.DOWN]: (connection: Connection) => {
        return connection.undoLastMigration()
    },
    [MigrationActions.RUN]: (connection: Connection) => {
        return connection.runMigrations()
    }
};

export const messagesByMigratonAction = {
    [MigrationActions.DOWN]: (tenant: string) => {
        return {
            START_MESSAGE: `>>>> Executing rollback the migrations to the tenant ${tenant}`,
            END_MESSAGE: `>>>> Executed rollback the migrations success to the tenant ${tenant}`
        }
    },
    [MigrationActions.RUN]: (tenant: string) => {
        return {
            START_MESSAGE: `>>>> Executing the migrations to the tenant ${tenant}`,
            END_MESSAGE: `>>>> Executed the migrations success to the tenant ${tenant}`
        }
    }
}

export const isValidMigrationAction = (action: string) => {
    if (
        action != MigrationActions.RUN && 
        action != MigrationActions.DOWN
    ) {
        throw new Error("The action value is invalid.")
    }
}