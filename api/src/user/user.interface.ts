export interface UserData {
    username: string;
    email: string;
    token: string;
    bio: string;
    image?: string;
}

export interface User {
    user: UserData;
}
