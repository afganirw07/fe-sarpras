import { api } from "./api";

export async function userLogin ( email: string, password: string) {
    const oneDay = 86400

    const res = await api("/api/users",
        {
            method: "POST",
            body: JSON.stringify({email, password})
        }
    )

    return res
} 

export default async function editUsers(user_id: string, name: string, email: string) {
    return api(`/api/users/${user_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            full_name: name,
            email: email
        })
        ,
    });
}


export async function deleteUser(user_id: string) {
    return api(`/api/users/${user_id}`, {
        method: "DELETE",
    });
}

export async function editUserByAdmin(data: {
    user_id: string;
    full_name: string;
    email: string;
    role_user: string;
}) {
    return api(`/api/users/${data.user_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            full_name: data.full_name,
            email: data.email,
            role_user: data.role_user,
        }),
    });
}