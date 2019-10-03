import { Photo } from "./photo";

export interface Animal {
    id: string,
    organization_id: string,
    url: string,
    type: string,
    species: string,
    breeds: Breed,
    colors: Color,
    age: string,
    gender: string,
    size: string,
    coat: string,
    name: string,
    description: string,
    photos: Photo[],
    status: string,
    attributes: Attributes,
    tags: string[],
    published_at: string,
    status_changed_at: string,
}

export interface Breed {
    primary: string,
    secondary: string,
    mixed: boolean,
    unknown: boolean,
}

export interface Color {
    primary: string,
    secondary: string,
    tertiary: string,
}

export interface Attributes {
    spayed_neutered: boolean,
    house_trained: boolean,
    declawed: boolean,
    special_needs: boolean,    
    shots_current: boolean,
}