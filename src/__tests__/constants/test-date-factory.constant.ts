import {DateFactory} from "../../models";
import {testDate} from "./test-date.constant";

export const testDateFactory: DateFactory = {
    createDate(): Date {
        return testDate;
    }
}