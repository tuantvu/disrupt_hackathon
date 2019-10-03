import { AnimalProperties } from './animal_properties';

export class Links {
    static LABEL_LINKS = "LINKS";

    constructor(
        public label: string,
        public source: AnimalProperties,
        public target: AnimalProperties,
        public weight: number
    ) {}
}