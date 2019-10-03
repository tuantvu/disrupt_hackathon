import { Animal } from "../dataobjects/animal";
import { Pagination } from "../dataobjects/pagination";

export interface AnimalListResponse {
    animals: Animal[],
    pagination: Pagination,
}