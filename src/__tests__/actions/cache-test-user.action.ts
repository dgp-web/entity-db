import { TestEntityDbAction } from "../models/test-entity-db-action.model";
import { testUser } from "../constants/test-user.constant";

export function cacheTestUser(): TestEntityDbAction {
    return {
        add: {
            user: {
                [testUser.userId]: testUser
            }
        }
    };
}