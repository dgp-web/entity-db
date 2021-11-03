import {DateFactory} from "../models";

export const defaultDateFactory: DateFactory = {
    createDate(): Date {
        return new Date();
    }
}
