import { Organization } from "../dataobjects/organization";
import { Pagination } from "../dataobjects/pagination";

export interface OrganizationListResponse {
    organizations: Organization[],
    pagination: Pagination,
}