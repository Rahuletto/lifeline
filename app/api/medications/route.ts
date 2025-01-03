import { databases, ID } from "@/sdk/appwrite";
import { Medications } from "@/types/Medications";
import { validateAuth } from "@/utils/validateAuth";
import { NextRequest } from "next/server";

const databaseId = "676e6b1500115397e9e7";
const collectionId = "medications";

interface MedicationBody {
  medications: Medications[];
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
        medications: document.medications.map((c: string) => JSON.parse(c)),
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
  const { medications }: MedicationBody = await req.json();

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
      const updatedmedications = [
        ...document.medications.map((c: string) => JSON.parse(c)),
        ...medications.map((medication) => ({
          id: ID.unique(),
          ...medication,
        })),
      ];
      const updatedDocument = await databases.updateDocument(
        databaseId,
        collectionId,
        id as string,
        {
          medications: updatedmedications.map((medication) =>
            JSON.stringify(medication)
          ),
        }
      );
      return Response.json(
        {
          id: updatedDocument.id,
          medications: updatedmedications,
        },
        { status: 200 }
      );
    } else {
      const newmedications = medications.map((medication) => ({
        id: ID.unique(),
        ...medication,
      }));
      const newDocument = await databases.createDocument(
        databaseId,
        collectionId,
        id as string,
        {
          id,
          medications: newmedications.map((medication) =>
            JSON.stringify(medication)
          ),
        }
      );
      return Response.json(
        {
          id: newDocument.id,
          medications: newmedications,
        },
        { status: 201 }
      );
    }
  } catch (err) {
    return Response.json(
      { error: "Failed to create or add medication: " + err },
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
  const { medicationId } = await req.json();

  try {
    const document = await databases.getDocument(
      databaseId,
      collectionId,
      id as string
    );
    const parsed = document.medications.map((c: string) => JSON.parse(c));
    const updatedmedications = parsed.filter(
      (c: Medications) => c.id !== medicationId
    );

    const updatedDocument = await databases.updateDocument(
      databaseId,
      collectionId,
      id as string,
      {
        medications: updatedmedications.map((medication: Medications) =>
          JSON.stringify(medication)
        ),
      }
    );
    return Response.json(
      {
        id: updatedDocument.id,
        medications: updatedmedications,
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { error: "Failed to delete medication" },
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
  const medicationId = body.medicationId;

  try {
    const document = await databases.getDocument(
      databaseId,
      collectionId,
      id as string
    );

    const parsed = document.medications.map((c: string) => JSON.parse(c));

    const updatedmedications = parsed.map((c: Medications) =>
      c.id === medicationId
        ? {
            id: c.id,
            name: body.name ?? c.name,
            dosage: body.dosage ?? c.dosage,
            frequency: body.frequency ?? c.frequency,
            notes: body.notes ?? c.notes,
            reminders: body.reminders ?? c.reminders,
          }
        : c
    );

    const updatedDocument = await databases.updateDocument(
      databaseId,
      collectionId,
      id as string,
      {
        medications: updatedmedications.map((medication: Medications) =>
          JSON.stringify(medication)
        ),
      }
    );
    return Response.json(
      {
        id: updatedDocument.id,
        medications: updatedmedications,
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { error: "Failed to update medication" },
      { status: 500 }
    );
  }
}
