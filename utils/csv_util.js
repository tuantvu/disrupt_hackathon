"use strict";
exports.__esModule = true;
function cleanString(text) {
    return text.replace(/[^A-Z0-9]+/ig, "_");
}
function toBoolean(field) {
    return field ? "TRUE" : "FALSE";
}
function animalToString(animal) {
    return animal.id + "," +
        cleanString(animal.name) + "," +
        animal.organization_id + "," +
        cleanString(animal.type) + "," +
        cleanString(animal.species) + "," +
        cleanString(animal.age) + "," +
        cleanString(animal.status) + "," +
        animal.published_at + "," +
        animal.status_changed_at + "," +
        toBoolean(animal.attributes.shots_current);
}
exports.animalToString = animalToString;
function organizationToString(organization) {
    return organization.id + "," +
        cleanString(organization.name);
}
exports.organizationToString = organizationToString;
function animalAndOrganizationToString(animal, organization) {
    return animalToString(animal) + "," +
        cleanString(organization.name);
}
exports.animalAndOrganizationToString = animalAndOrganizationToString;
