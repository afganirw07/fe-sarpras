import { error, log } from "console";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

console.log("====== ENV CHECK ======");
console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("API_KEY:", process.env.NEXT_PUBLIC_API_KEY ? " EXISTS" : " MISSING");
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? " EXISTS" : " MISSING");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("=======================");

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        console.log("\n========================================");
        console.log("  AUTHORIZE CALLED");
        console.log("========================================");
        console.log("Received credentials:", {
          userName: credentials?.userName,
          password: credentials?.password ? "***PROVIDED***" : "***EMPTY***"
        });

        if (!credentials?.userName || !credentials?.password) {
          console.error(" Credentials missing!");
          return null;
        }

        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL;
          const token = process.env.NEXT_PUBLIC_API_KEY;

          console.log(" API Config:", {
            baseUrl,
            hasToken: !!token,
          });

          if (!baseUrl || !token) {
            console.error(" Missing API config!");
            return null;
          }

          const payload = {
            version: "v1",
            apps_name: "SARPRAS SMK",
            username: credentials.userName,
            password: credentials.password,
          };

          const url = `${baseUrl}/api/users`;
          console.log(" Fetching:", url);
          console.log(" Payload:", {
            ...payload,
            password: "***HIDDEN***"
          });

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          console.log(" Response status:", response.status);
          console.log(" Response ok:", response.ok);

          const responseText = await response.text();
          console.log("Response text:", responseText);

          if (!response.ok) {
            console.error(" HTTP error:", response.status);
            return null;
          }

          let data;
          try {
            data = JSON.parse(responseText);
            console.log(" Parsed data:", JSON.stringify(data, null, 2));
          } catch (e) {
            console.error(" JSON parse error:", e);
            return null;
          }

          console.log(" Validating response...");
          console.log("   data.success:", data.success);
          console.log("   data.data:", data.data);

          if (!data.success) {
            console.error(" API returned success=false");
            console.error(" Message:", data.message);
            return null;
          }

          if (!data.data) {
            console.error(" No data object");
            return null;
          }

          const userId = data.data.id;
          const userDetailResponse = await fetch(`${baseUrl}/api/users/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization" : `Bearer ${token}`,
            },
          });

            if (!userDetailResponse.ok) {
            console.error(" Failed to fetch user details");
            return {
              id: data.data.id,
              username: data.data.username,
              email: data.data.email || null,
              accessToken: null,
            }; 
          }

          const userDetailText = await userDetailResponse.text();

          if (!userDetailText || userDetailText.trim() === '') {
            console.error(" Empty user detail response");
            return {
              id: data.data.id,
              username: data.data.username,
              email: data.data.email || null,
              accessToken: null,
            };
          }

          let userDetailData
          try {
            userDetailData = JSON.parse(userDetailText);
            console.log("user detail data", JSON.stringify(userDetailData, null, 2));
            
          }
          catch (err) {
            console.error("JSON parse error on user detail", err);
              return {
              id: data.data.id,
              username: data.data.username,
              email: data.data.email || null,
              accessToken: null,
              };
          }

          const userToken = userDetailData.data[0]?.token || null;


          const user = {
            id: data.data.id,
            username: data.data.username,
            email: data.data.email || null,
            accessToken: userToken,
          };


          console.log(" Returning user:", user);
          return user;

        } catch (error) {
          console.error("   Name:", error.name);
          console.error("   Message:", error.message);
          console.error("   Stack:", error.stack);
          return null;
        }

      }
    })
  ],

  callbacks : {
    async jwt({user, token}){
      if(user){
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({session, token}){
       if (token) {
      session.user = {
        ...session.user,           
        id: token.id,    
        username: token.username,
        email: token.email, 
        accessToken: token.accessToken,
      };
      
      console.log("SESSION - Final session.user:", {
        id: session.user.id,
        username: session.user.username,
        email: session.user.email,
        hasAccessToken: !!session.user.accessToken
      });
    }
    
    return session;
  }
  },

  session : {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };