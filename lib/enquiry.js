/* Shared submit helper for every enquiry form (contact, plan-my-trip, package
   booking) — one place that knows the endpoint and the request shape, so a
   form component only has to know its own field values. */
export async function submitEnquiry(formType, fields) {
  const response = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      formType,
      fields,
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.error || "Something went wrong. Please try again.");
  }

  return data;
}
