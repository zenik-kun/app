import { Client, Account, ID, Avatars, Databases  } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.zenik.aora',
    projectId: '66745cb6000fbe869f71',
    databaseId: '66751eec00206b6a51fe',
    userCollectionId: '66751f5c000c47eeb077',
    videoCollectionId: '66751fb7000f4f5d341c',
    storageId: '66752202003af51555db',

}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username 
        )

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;
        
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function signIn(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password)

      return session;
    } catch (error) {
        throw new Error(error)
    }
}

