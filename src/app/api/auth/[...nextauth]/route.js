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

          const user = {
            id: data.data.id,
            username: data.data.username,
            email: data.data.email || null,
          };

          console.log(" Returning user:", user);
          console.log("========================================\n");
          
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

  

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };