const response = (statusCode, payload) => ({
  statusCode,
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

const allowedInquiryTypes = new Set(["admissions", "fees", "tahfidh", "other"]);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return response(405, { success: false, errors: [], message: "Method not allowed." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return response(400, { success: false, errors: [], message: "Invalid JSON request." });
  }

  const errors = [];
  const fields = [
    ["full_name", 2, 40, "Your name must contain 2–40 characters."],
    ["phone", 7, 20, "Your phone number must contain 7–20 characters."],
    ["message", 10, 500, "Your message must contain 10–500 characters."],
  ];

  for (const [field, min, max, message] of fields) {
    if (typeof body[field] !== "string" || body[field].trim().length < min || body[field].trim().length > max) {
      errors.push({ path: [field], message });
    }
  }
  if (!allowedInquiryTypes.has(body.inquiry_type)) {
    errors.push({ path: ["inquiry_type"], message: "Please select a valid inquiry type." });
  }
  if (errors.length) {
    return response(400, { success: false, errors });
  }

  const endpoint = process.env.FORMSPREE_ENDPOINT2;
  if (!endpoint) {
    return response(503, {
      success: false,
      errors: [],
      message: "Inquiry delivery is not configured. Please contact the school by phone or email.",
    });
  }

  let endpointUrl;
  try {
    endpointUrl = new URL(endpoint);
  } catch {
    return response(503, { success: false, errors: [], message: "Inquiry delivery is misconfigured." });
  }
  if (endpointUrl.protocol !== "https:" || endpointUrl.hostname !== "formspree.io" || !endpointUrl.pathname.startsWith("/f/")) {
    return response(503, { success: false, errors: [], message: "Inquiry delivery is misconfigured." });
  }

  try {
    const upstream = await fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        full_name: body.full_name.trim(),
        phone: body.phone.trim(),
        inquiry_type: body.inquiry_type,
        message: body.message.trim(),
      }),
    });

    if (!upstream.ok) {
      console.error("Formspree rejected inquiry with status", upstream.status);
      return response(502, { success: false, errors: [], message: "Unable to deliver your inquiry. Please try again." });
    }

    return response(202, { success: true, message: "Your inquiry has been successfully submitted." });
  } catch (error) {
    console.error("Inquiry delivery failed:", error.message);
    return response(502, { success: false, errors: [], message: "Our submission service is temporarily unavailable." });
  }
};
