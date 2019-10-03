import {Animal} from '../dataobjects/animal';
import { Organization } from '../dataobjects/organization';

function cleanString(text: string): string {
    return text.replace(/[^A-Z0-9]+/ig, "_");
}

function toBoolean(field: boolean): string {
    return field ? "TRUE" : "FALSE";
}

export function animalToString(animal: Animal): string {
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

export function organizationToString(organization: Organization): string {
    return organization.id + "," + 
        cleanString(organization.name);
}

export function animalAndOrganizationToString(animal: Animal, organization: Organization): string {
    return animalToString(animal) + "," + 
        cleanString(organization.name);
}
