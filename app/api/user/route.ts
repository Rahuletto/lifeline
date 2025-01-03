import { databases } from "@/sdk/appwrite";
import { UserData } from "@/types/User";
import { validateAuth } from "@/utils/validateAuth";
import { NextRequest } from "next/server";


const databaseId = "676e6b1500115397e9e7";
const collectionId = "users";

// GET
export async function GET(req: NextRequest): Promise<Response> {
  let session: string;

  try {
    session = await validateAuth(req);
  } catch (err) {
    return Response.json(
      {
        error: (err as Error).message,
      },
      { status: 401 }
    );
  }

  try {
    const document = await databases.getDocument(
      databaseId,
      collectionId,
      session
    );

    const medico = await databases.getDocument(
      databaseId,
      "medications",
      session
    );

    const emergency = await databases.getDocument(
      databaseId,
      "emergency_contacts",
      session
    );

    return Response.json(
      {
        user: {
          ...JSON.parse(document.user),
          medications: medico.medications.map((c: string) => JSON.parse(c)),
          emergencyContact: emergency.contacts.map((c: string) =>
            JSON.parse(c)
          ),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    const error = err as Error;
    return Response.json(
      {
        error: error.message,
      },
      {
        status: error.message.includes("not be found") ? 404 : 500,
      }
    );
  }
}

// CREATE OR UPDATE
export async function POST(req: NextRequest) {
  try {
    let session: string;

    try {
      session = await validateAuth(req);
    } catch (err) {
      return Response.json({ error: (err as Error).message }, { status: 401 });
    }

    const id = session;

    const userData: UserData = await req.json();
    let document;
    try {
      document = await databases.getDocument(
        databaseId,
        collectionId,
        id as string
      );
    } catch {
      document = null;
    }

    if (document) {
      await databases.updateDocument(
        databaseId,
        collectionId,
        id as string,
        { 
            id: id,
            user: JSON.stringify(userData)
        }
      );
      return Response.json(userData, { status: 200 });
    } else {
      await databases.createDocument(
        databaseId,
        collectionId,
        id as string,
        {
          id: id,
          user: JSON.stringify(userData),
        }
      );
      return Response.json(userData, { status: 201 });
    }
  } catch (err) {
    return Response.json(
      { error: "Failed to create or update user data: " + err },
      { status: 500 }
    );
  }
}

// UPDATE
export async function PUT(req: NextRequest) {
  let session: string;

  try {
    session = await validateAuth(req);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 401 });
  }

  const id = session;
  const body: UserData = await req.json();

  try {
    const document = await databases.getDocument(
      databaseId,
      collectionId,
      id as string
    );

    const parsed: UserData = JSON.parse(document.user);

    const updated = {
      ...parsed,
      ...body,
    };

    await databases.updateDocument(
      databaseId,
      collectionId,
      id as string,
      {
        id: id,
        user: JSON.stringify(updated),
      }
    );

    return Response.json(updated, { status: 200 });
  } catch (err) {
    return Response.json(
      { error: "Failed to update user. " + (err as Error).message },
      { status: 500 }
    );
  }
}
