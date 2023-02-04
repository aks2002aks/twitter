import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.SECRET,

  callbacks: {
    async session({ session, token }) {
      session.user.uid = token.sub;

      session.user.username = session.user.email.substring(
        0,
        session.user.email.indexOf("@")
      );

      return session;
    },
  },
};

export default NextAuth(authOptions);
