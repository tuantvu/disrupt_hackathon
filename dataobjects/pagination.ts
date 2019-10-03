import { Link } from "./link";

export class Pagination {
    constructor(obj:Object) {
        for (var prop in obj) this[prop] = obj[prop];
    }

    public count_per_page: number;
    public total_count: number;
    public current_page: number;
    public total_pages: number;
    public _links: Link
}