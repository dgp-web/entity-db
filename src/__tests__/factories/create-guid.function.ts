
const { v4: uuidv4 } = require('uuid');

export function createGuid() {
    return uuidv4();
}
