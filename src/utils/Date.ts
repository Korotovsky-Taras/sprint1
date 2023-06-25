export const isDate = (value: any): boolean => {
    switch (typeof value) {
        case 'number':
            return true;
        case 'string':
            return !isNaN(Date.parse(value));
        case 'object':
            return value instanceof Date && !isNaN(value.getTime());
        default:
            return false;
    }
}