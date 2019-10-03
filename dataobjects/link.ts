export interface Link {

    
    self: InnerLink,
    next: InnerLink,
    animals: InnerLink,
    breeds: InnerLink,
    organization: InnerLink
}

export interface InnerLink {
    href: string,
}