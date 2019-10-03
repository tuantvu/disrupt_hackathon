import { Address } from "./address";
import { Photo } from "./photo";

export class Organization {
    constructor(obj:Object) {
        for (var prop in obj) this[prop] = obj[prop];
    }
    public id: string;
    public name: string;
    public email: string;
    public phone: string;
    public url: string;
    public photos: Photo[];
    public address: Address;
}