import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "../../../../services/authService";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email / Phone", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.otp) return null;
        
        try {
          const res = await authService.verifyLoginOtp({
            email: credentials.email,
            otp: credentials.otp,
          });
          
          if (res.success && res.data) {
            const data = res.data;
            const firstName = data.first_name || '';
            const lastName = data.last_name || '';
            const fullName = data.full_name || data.name || (firstName || lastName ? `${firstName} ${lastName}`.trim() : "");
            const mobileNum = data.mobile_number || data.mobile || data.phone || data.phone_number || '';
            const loc = data.business_location || data.location || data.business_address || '';
            const comp = data.company_name || data.business_name || data.company || '';
            const trn = data.trn_number || data.trn || data.tax_id || '';

            return { 
              id: String(data.vendor_id || data.id || credentials.email),
              email: data.email || credentials.email,
              name: fullName,
              vendor_id: data.vendor_id,
              user_type: data.user_type,
              mobile: mobileNum,
              phone: mobileNum,
              location: loc,
              business_location: loc,
              company_name: comp,
              tax_id: trn,
              business_type: data.business_type || '',
              address: data.address || data.business_address || loc
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as any;
        token.vendor_id = u.vendor_id;
        token.user_type = u.user_type;
        token.mobile = u.mobile;
        token.phone = u.phone;
        token.location = u.location;
        token.business_location = u.business_location;
        token.company_name = u.company_name;
        token.tax_id = u.tax_id;
        token.business_type = u.business_type;
        token.address = u.address;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as any;
        u.vendor_id = token.vendor_id;
        u.user_type = token.user_type;
        u.mobile = token.mobile;
        u.phone = token.phone || token.mobile;
        u.location = token.location;
        u.business_location = token.business_location || token.location;
        u.company_name = token.company_name;
        u.tax_id = token.tax_id;
        u.business_type = token.business_type;
        u.address = token.address;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "dummy-secret-for-development-12345",
});

export { handler as GET, handler as POST };

