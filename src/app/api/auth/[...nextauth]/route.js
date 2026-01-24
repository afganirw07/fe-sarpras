import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOption = {
    provider: [
        CredentialsProvider({
            name: "Credential",
            credentials: {
                userName: {label: "Username", type: "username", placeholder: "username"},
                password: {label: "Password", type: "password"}
            },

            async authorize(credentials){

                

            }
        })
    ]
}
