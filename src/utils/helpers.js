// Convert camelCase to snake_case
const toSnakeCase = (input) => input.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(); 

module.exports = { toSnakeCase };