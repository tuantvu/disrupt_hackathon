import { Photo } from "./photo";

export interface Animal {
    id: string, //db
    organization_id: string, //db
    url: string,
    type: string, //db
    species: string, //db
    breeds: Breed,
    colors: Color,
    age: string, //db
    gender: string,
    size: string,
    coat: string,
    name: string, //db
    description: string,
    photos: Photo[],
    status: string, //db
    attributes: Attributes, //db
    tags: string[],
    published_at: string, //db
    status_changed_at: string, //db
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

