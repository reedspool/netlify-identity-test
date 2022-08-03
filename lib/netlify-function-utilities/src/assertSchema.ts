export const assertSchema: (data: any, schema: {}) => void = (data, schema) => {
    const errors: string[] = [];

    Object.entries(schema).forEach(([key, type]: [any, any]) => {
        if (typeof data[key] !== type) errors.push(`'${key}' required (${type})`);
    })

    if (errors.length > 0) throw {
        name: "Malformed request",
        message: errors.join(", "),
        description: "Check the message and fix the request."
    }
}
