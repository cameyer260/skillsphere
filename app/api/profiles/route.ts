import { createServiceRoleClient } from "@/utils/supabase/service_role";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServiceRoleClient();
    const body = await req.json();
    console.log(`body: ${JSON.stringify(body)}`);
    const { error } = await supabase.from("profiles").insert({ id: body.id });
    if (error && error.code !== "23505") {
      console.error(error);
      throw error;
    }
    return NextResponse.json(
      { message: "Successfully created new profile for the user." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unexpected error: ", error);
    return NextResponse.json(
      { error: "Unexpected server error. Failed to create profile" },
      { status: 500 },
    );
  }
}
