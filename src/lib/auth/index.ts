import { NAVIGARIONS_ROUTINGS } from "@constant/navigations";
import { addPlatoformUser, getUserByEmail } from "@database/users";
import { firebaseAuth, signOutFirebaseAuth } from "@lib/firebase/firebaseClient";
import { UserDataType } from "@type/platform/user";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signOut } from "next-auth/react";

// const FirestoreInstance = initFirestore({
//     credential: cert({
//         projectId: process.env.FIREBASE_PROJECT_ID,
//         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//         privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
//     }),
// })

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: UserDataType & DefaultSession["user"]

        // user: {
        //     id: string;
        //     credits: number;
        //     accessToken: any;
        // } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        credits: number;
    }
}


//refer https://www.youtube.com/watch?v=bkUmN9TH_hQ
export const authOptions: NextAuthOptions = {
    session: {

        // Choose how you want to save the user session.
        // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
        // If you use an `adapter` however, we default it to `"database"` instead.
        // You can still force a JWT session by explicitly defining `"jwt"`.
        // When using `"database"`, the session cookie will only contain a `sessionToken` value,
        // which is used to look up the session in the database.
        strategy: "jwt",

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // This line sets the maximum age of a session to 30 days in seconds.
        // Here's the breakdown:
        // 30 (days) * 24 (hours in a day) * 60 (minutes in an hour) * 60 (seconds in a minute)
        // = 2,592,000 seconds
        // After this time period, if the user hasn't interacted with the session,
        // it will expire and the user will need to log in again.

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        //
        // This option controls how often the session is updated in the database.
        // It's measured in seconds and is set to 24 hours (86,400 seconds) by default.
        // 
        // Purpose:
        // 1. Performance: Reduces database writes by only updating after the specified time.
        // 2. Resource Management: Helps manage server load and database connections.
        //
        // Usage:
        // - Set to 0 to update the database on every request (not recommended for high traffic).
        // - Increase the value to reduce database writes, but may slightly delay session updates.
        // 
        // Note: This setting has no effect when using JWT (JSON Web Tokens) for sessions,
        // as JWTs are stateless and don't require database updates.

        // updateAge: 24 * 60 * 60, // 24 hours

        // The session token is usually either a random UUID or string, however if you
        // need a more customized session token string, you can define your own generate function.
        // generateSessionToken: () => {
        //     const timestamp = new Date().toISOString();
        //     return randomUUID?.() ?? randomBytes(32).toString("hex")
        // }

    },
    secret: process.env.NEXTAUTH_SECRET as string,
    callbacks: {
        signIn: async ({ user, profile, account }: any) => {
            const timestamp = new Date().toISOString();

            if (user && !('isVerified' in user)) {
                let dbUser: any = await getUserByEmail(user.email);
                if (!dbUser) {
                    //if user trying to access site for the first time and
                    //using google login then add this user into database
                    dbUser = await addPlatoformUser({ ...user, ...account, isVerified: false, active: false });
                }
                user = { ...user, ...dbUser }
            }
            if (Boolean(user?.isVerified) && Boolean(user?.active)) {
                return user;
            } else {
                return '/unauthorized'
            }
        },
        jwt: async ({ token, user, trigger, session }: any) => {

            const email = token?.email || user?.email;
            if (!email) return null;
            if (email && !Boolean(token?.dbUser) || (token.dbUser && !('isVerified' in token.dbUser))) {


                let dbUser: any = await getUserByEmail(email);
                token.dbUser = { ...user, ...getDatabaseUserForSession(dbUser) }
            }

            //when update profile triggers then refetch database user
            // https://next-auth.js.org/getting-started/client#updating-the-session
            if (trigger === "update") {
                const updatedUser: any = await getUserByEmail(user.email);
                token.dbUser = getDatabaseUserForSession(updatedUser)
            }

            const timestamp = new Date().toISOString();
            return token;
        },
        session: async ({ session, token }: any) => {
            const timestamp = new Date().toISOString();
            if (Boolean(token?.email) && Boolean(token?.dbUser)) {
                const dbUser: UserDataType = token?.dbUser;
                session.user = { ...session.user, ...dbUser };
                session.platformRole = dbUser.platformRole
                session.tId = dbUser.tenantId;
                session.sId = dbUser.storeId;
                session.uId = dbUser.id;
                session.role = dbUser.stores ? dbUser.stores?.find((store: any) => store.storeId === session.sId)?.roles[0] : '';
            }
            console.log("session inside session", session)
            return session;
        }
    },
    pages: {
        signIn: '/signin'
    },
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        //https://medium.com/ascentic-technology/authentication-with-next-js-13-and-next-auth-9c69d55d6bfd

        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials): Promise<any> {
                const timestamp = new Date().toISOString();
                const dbUser: any = await getUserByEmail((credentials as any).email);
                if (Boolean(dbUser?.isVerified) && Boolean(dbUser?.active)) {
                    return await signInWithEmailAndPassword(firebaseAuth, (credentials as any).email || '', (credentials as any).password || '')
                        .then(userCredential => {
                            if (userCredential.user) {
                                return { ...dbUser, loginSource: "signInWithEmailAndPassword" };
                                // return { ...userCredential.user, ...dbUser, credits: "addedd" };
                            }
                            return null;
                        })
                        .catch((error) => {
                            throw new Error(error)
                        });
                } else {
                    throw new Error("email-not-registred")
                }
            }
        })
    ],
    // adapter: FirestoreAdapter(FirestoreInstance),
    // adapter: FirestoreAdapter({
    //     credential: cert({
    //         projectId: process.env.FIREBASE_PROJECT_ID,
    //         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    //         privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    //     }),
    // }) as Adapter
}

export const signOutSession = () => {
    return new Promise((res, rej) => {
        signOutFirebaseAuth()
            .then(() => {
                signOut({ redirect: true, callbackUrl: `/${NAVIGARIONS_ROUTINGS.SIGNIN}` })
                res(true)
            }).catch(() => {
                const timestamp = new Date().toISOString();
                rej()
            })
    })
}

const getDatabaseUserForSession = (dbUser) => {
    delete dbUser.scope;
    delete dbUser.providerAccountId;
    delete dbUser.type;
    delete dbUser.provider;
    delete dbUser.token_type;
    delete dbUser.id_token;
    delete dbUser.access_token;
    return dbUser;
}