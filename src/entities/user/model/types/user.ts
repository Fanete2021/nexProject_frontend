export interface User {
    userId: string;
    username: string;
    name: string;
    description: string;
    birthday: Date;
    email: string;
    verify: boolean;
}

export interface UserSchema {
    data?: User;
    isLoading: boolean;
}
