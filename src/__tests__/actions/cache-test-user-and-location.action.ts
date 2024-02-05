import { TestEntityDbAction } from "../models/test-entity-db-action.model";
import { testUser } from "../constants/test-user.constant";
import { testLocation } from "../constants/test-location.constant";

export function cacheTestUserAndLocation(): TestEntityDbAction {
    return {
        add: {
            user: {
                [testUser.userId]: testUser
            },
            location: {
                [testLocation.locationId]: testLocation
            }
        }
    };
}