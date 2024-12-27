import { databases, ID } from "@/sdk/appwrite";
import { Contact } from "@/types/Contact";
import { validateAuth } from "@/utils/validateAuth";
import { validateContact } from "@/utils/validateContact";
import { NextRequest } from "next/server";

const databaseId = "676e6b1500115397e9e7";
const collectionId = "emergency_contacts";

// input
// {
//     id: String,
//     contacts: [Contact]
// }

interface SOSPostBody {
  contacts: Contact[];
}

// GET
export async function GET(req: NextRequest) {
  let session: string;

  try {
    session = await validateAuth(req);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 401 });
  }

  const id = session;

  try {
    const document = await databases.getDocument(
      databaseId,
      collectionId,
      id as string
    );
    return Response.json(
      {
        id: document.id,
        contacts: document.contacts.map((c: string) => JSON.parse(c)),
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      { error: (err as Error).message },
      { status: (err as Error).message.includes("not be found") ? 404 : 500 }
    );
  }
}

// CREATE OR ADD
export async function POST(req: NextRequest) {
  let session: string;

  try {
    session = await validateAuth(req);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 401 });
  }

  const id = session;
  const { contacts }: SOSPostBody = await req.json();

  for (const contact of contacts) {
    const validationError = validateContact(contact);
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 });
    }
  }

  try {
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
      const updatedContacts = [
        ...document.contacts.map((c: string) => JSON.parse(c)),
        ...contacts.map((contact) => ({ id: ID.unique(), ...contact })),
      ];
      const updatedDocument = await databases.updateDocument(
        databaseId,
        collectionId,
        id as string,
        { contacts: updatedContacts.map((contact) => JSON.stringify(contact)) }
      );
      return Response.json(
        {
          id: updatedDocument.id,
          contacts: updatedContacts,
        },
        { status: 200 }
      );
    } else {
      const newContacts = contacts.map((contact) => ({
        id: ID.unique(),
        ...contact,
      }));
      const newDocument = await databases.createDocument(
        databaseId,
        collectionId,
        id as string,
        { id, contacts: newContacts.map((contact) => JSON.stringify(contact)) }
      );
      return Response.json(
        {
          id: newDocument.id,
          contacts: newContacts,
        },
        { status: 201 }
      );
    }
  } catch (err) {
    return Response.json(
      { error: "Failed to create or add contact: " + err },
      { status: 500 }
    );
  }
}

// REMOVE
export async function DELETE(req: NextRequest) {
  let session: string;

  try {
    session = await validateAuth(req);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 401 });
  }

  const id = session;
  const { contactId } = await req.json();

  try {
    const document = await databases.getDocument(
      databaseId,
      collectionId,
      id as string
    );
    const parsed = document.contacts.map((c: string) => JSON.parse(c));
    const updatedContacts = parsed.filter((c: Contact) => c.id !== contactId);

    const updatedDocument = await databases.updateDocument(
      databaseId,
      collectionId,
      id as string,
      {
        contacts: updatedContacts.map((contact: Contact) =>
          JSON.stringify(contact)
        ),
      }
    );
    return Response.json(
      {
        id: updatedDocument.id,
        contacts: updatedContacts,
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { error: "Failed to delete contact" },
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
  const body = await req.json();
  const contactId = body.contactId;

  try {
    const document = await databases.getDocument(
      databaseId,
      collectionId,
      id as string
    );
    let updatedContacts = document.contacts;

    const parsed = document.contacts.map((c: string) => JSON.parse(c));

    updatedContacts = parsed.map((c: Contact) =>
      c.id === contactId
        ? {
            id: c.id,
            name: body.name ?? c.name,
            phone: body.phone ?? c.phone,
            relationship: body.relationship ?? c.relationship,
          }
        : c
    );

    const updatedDocument = await databases.updateDocument(
      databaseId,
      collectionId,
      id as string,
      {
        contacts: updatedContacts.map((contact: Contact) =>
          JSON.stringify(contact)
        ),
      }
    );
    return Response.json(
      {
        id: updatedDocument.id,
        contacts: updatedContacts,
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}
