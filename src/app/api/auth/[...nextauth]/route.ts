import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "../../../../services/authService";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email / Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
        isRegister: { label: "Is Register", type: "text" },
        fullName: { label: "Full Name", type: "text" },
        mobileNumber: { label: "Mobile Number", type: "text" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.otp) return null;

        try {
          const res = credentials.isRegister === 'true'
            ? await authService.verifyRegistrationOtp({
                email: credentials.email,
                otp: credentials.otp,
              })
            : await authService.verifyLoginOtp({
                email: credentials.email,
                otp: credentials.otp,
              });

          if (res.success && res.data) {
            const rawData = res.data as any;
            const data = rawData.user || rawData.vendor || rawData.profile || rawData.data || rawData;

            // Resolve vendor_id and user ID comprehensively from backend response
            const resolvedVendorId = (
              rawData.vendor_id ||
              data.vendor_id ||
              rawData.vendorId ||
              data.vendorId ||
              rawData.raw_vendor_id ||
              data.raw_vendor_id ||
              rawData.vendor?.vendor_id ||
              rawData.vendor?.id ||
              rawData.user?.vendor_id ||
              rawData.user?.id ||
              data.id ||
              rawData.id
            );

            const firstName = data.first_name || data.firstName || '';
            const lastName = data.last_name || data.lastName || '';
            let fullName = data.full_name || data.fullName || data.name || (firstName || lastName ? `${firstName} ${lastName}`.trim() : "");
            let mobileNum = data.mobile_number || data.mobileNumber || data.mobile || data.phone || data.phone_number || data.phoneNumber || '';

            // Fallback to credentials passed from frontend during registration
            if (!fullName && credentials.fullName) fullName = credentials.fullName;
            if (!mobileNum && credentials.mobileNumber) mobileNum = credentials.mobileNumber;

            const loc = data.business_location || data.businessLocation || data.location || data.business_address || data.address || '';
            const comp = data.company_name || data.companyName || data.business_name || data.company || '';
            const trn = data.tax_registration_number || data.taxRegistrationNumber || data.trn_number || data.trn || data.tax_id || data.taxId || '';

            const rawAccountEntity = (
              data.account_entity_type ||
              data.accountEntityType ||
              data.account_type ||
              data.entity_type ||
              data.account_entity ||
              data.entity ||
              ''
            ).toString().toUpperCase();

            let accountEntityType = '';
            if (rawAccountEntity.includes('INDIVIDUAL')) {
              accountEntityType = 'INDIVIDUAL';
            } else if (rawAccountEntity.includes('COMPANY') || rawAccountEntity.includes('BUSINESS')) {
              accountEntityType = 'COMPANY';
            } else {
              accountEntityType = rawAccountEntity;
            }

            const rawUserType = (
              data.user_type ||
              data.userType ||
              data.role ||
              data.account_role ||
              data.type ||
              ''
            ).toString().toUpperCase();

            const categoryInterested = data.category_interested || data.categoryInterested || data.categories_interested || data.categories || '';
            const businessType = data.business_type || data.businessType || '';

            return {
              id: resolvedVendorId ? String(resolvedVendorId) : credentials.email,
              email: data.email || rawData.email || credentials.email,
              name: fullName,
              full_name: fullName,
              first_name: firstName,
              last_name: lastName,
              vendor_id: resolvedVendorId ? String(resolvedVendorId) : undefined,
              user_type: rawUserType || 'BUYER',
              mobile: mobileNum,
              phone: mobileNum,
              location: loc,
              business_location: loc,
              company_name: comp,
              tax_id: trn,
              business_type: businessType,
              address: data.address || data.business_address || loc,
              account_entity_type: accountEntityType,
              category_interested: categoryInterested
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
    async jwt({ token, user, trigger, session }) {
      // Handle session update
      if (trigger === "update" && session) {
        if (session.vendor_id !== undefined) token.vendor_id = session.vendor_id;
        if (session.id !== undefined) token.id = session.id;
        if (session.full_name !== undefined) token.full_name = session.full_name;
        if (session.name !== undefined) token.name = session.name;
        if (session.mobile !== undefined) token.mobile = session.mobile;
        if (session.phone !== undefined) token.phone = session.phone;
        if (session.company_name !== undefined) token.company_name = session.company_name;
        if (session.business_location !== undefined) token.business_location = session.business_location;
        if (session.business_type !== undefined) token.business_type = session.business_type;
        if (session.tax_id !== undefined) token.tax_id = session.tax_id;
        if (session.address !== undefined) token.address = session.address;
        if (session.account_entity_type !== undefined) token.account_entity_type = session.account_entity_type;
        if (session.user_type !== undefined) token.user_type = session.user_type;
        if (session.category_interested !== undefined) token.category_interested = session.category_interested;
      }

      if (user) {
        const u = user as any;
        token.id = u.id || u.vendor_id;
        token.vendor_id = u.vendor_id || u.id;
        token.user_type = u.user_type;
        token.mobile = u.mobile;
        token.phone = u.phone;
        token.location = u.location;
        token.business_location = u.business_location;
        token.company_name = u.company_name;
        token.tax_id = u.tax_id;
        token.business_type = u.business_type;
        token.address = u.address;
        token.full_name = u.full_name;
        token.first_name = u.first_name;
        token.last_name = u.last_name;
        token.account_entity_type = u.account_entity_type;
        token.category_interested = u.category_interested;
        if (u.name) token.name = u.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as any;
        u.id = token.id || token.vendor_id || token.sub;
        u.vendor_id = token.vendor_id || token.id;
        u.user_type = token.user_type;
        u.mobile = token.mobile;
        u.phone = token.phone || token.mobile;
        u.location = token.location;
        u.business_location = token.business_location || token.location;
        u.company_name = token.company_name;
        u.tax_id = token.tax_id;
        u.business_type = token.business_type;
        u.address = token.address;
        u.full_name = token.full_name;
        u.first_name = token.first_name;
        u.last_name = token.last_name;
        u.account_entity_type = token.account_entity_type;
        u.category_interested = token.category_interested;
        if (token.name) u.name = token.name;
        if (!u.name && token.full_name) u.name = token.full_name;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "dummy-secret-for-development-12345",
});

export { handler as GET, handler as POST };
