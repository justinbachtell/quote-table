import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { Webhook } from "svix";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { env } from "@/env";

const webhookSecret = env.CLERK_USER_WEBHOOK_SECRET;

type EventType =
  | "user.created"
  | "user.updated"
  | "user.deleted"
  | "session.created"
  | "session.ended"
  | "session.removed"
  | "session.revoked"
  | "email.created"
  | "sms.created"
  | "organization.created"
  | "organization.updated"
  | "organization.deleted"
  | "organizationInvitation.accepted"
  | "organizationInvitation.created"
  | "organizationInvitation.updated"
  | "organizationInvitation.deleted"
  | "organizationInvitation.revoked"
  | "organizationMembership.created"
  | "organizationMembership.updated"
  | "organizationMembership.deleted";
type Event = {
  data: Record<string, string | number>;
  object: "event";
  type: EventType;
};
type NewUser = typeof users.$inferInsert;

async function handleUserWebhook(req: NextRequest) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: no svix headers found.", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  // get userId from payload
  const userId = payload.data.id as string;

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType: EventType = evt.type;
  if (
    eventType === "user.created" ||
    eventType === "user.updated" ||
    eventType === "user.deleted"
  ) {
    if (eventType === "user.created") {
      try {
        await db
          .insert(users)
          .values({
            clerkId: evt.data.id as string,
            email: payload.data.email_addresses[0].email_address as string,
            name: ((payload.data.first_name as string) +
              " " +
              payload.data.last_name) as string,
            image: payload.data.image_url as string,
          } as NewUser)
          .returning({ id: users.id });
      } catch (e) {
        console.error("Error inserting user", e);
        return new Response("Error occured", {
          status: 400,
        });
      }
    }

    if (eventType === "user.updated") {
      try {
        await db
          .update(users)
          .set({
            email: payload.data.email_addresses[0].email_address as string,
            name: ((payload.data.first_name as string) +
              " " +
              payload.data.last_name) as string,
            image: payload.data.image_url as string,
          })
          .where(eq(users.clerkId, evt.data.id as string))
          .returning({ updatedId: users.id });
      } catch (e) {
        console.error("Error updating user", e);
        return new Response("Error occured", {
          status: 400,
        });
      }
    }

    if (eventType === "user.deleted") {
      try {
        await db
          .delete(users)
          .where(eq(users.clerkId, evt.data.id as string))
          .returning({ deletedId: users.id });
      } catch (e) {
        console.error("Error deleting user", e);
        return new Response("Error occured", {
          status: 400,
        });
      }
    }

    try {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          supabaseUserId: users.id,
        },
      });
    } catch (e) {
      console.error("Error updating user metadata", e);
      return new Response("Error occured", {
        status: 400,
      });
    }
  }
}
