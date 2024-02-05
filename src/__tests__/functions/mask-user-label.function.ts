import { User } from "../scenarios/migrations.function.spec";

export const maskUserLabel = (user: User): User => {
    return {
        ...user,
        label: "<Secret>"
    }
};