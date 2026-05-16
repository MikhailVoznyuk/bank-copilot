export type Role = 'user' | 'operator';
export type Status = 'basic' | 'privilege' | 'premier' | 'private';

export type User = {
    id: string;
    login: string;
    role: Role;
    actorId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    status: Status;
}