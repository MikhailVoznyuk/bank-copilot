export type Role = 'client' | 'operator';
export type Status = 'basic' | 'privilege' | 'premier' | 'private';

export type User = {
    id: string;
    login: string;
    role: Role;
    actorId: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    status: Status | null;
}