// ======================================
// 1. IMPORTS
// ======================================

import express from "express";
import { z } from "zod";
import { randomBytes } from "node:crypto";


// ======================================
// 2. APPLICATION CONFIGURATION
// ======================================

const site = express();

const PORT = Number(process.env.PORT) || 1750;

const secureCookie =
    process.env.NODE_ENV === "production" ? "; Secure" : "";


// ======================================
// 3. MIDDLEWARE
// ======================================

site.use(express.json({ limit: "10kb" }));

site.use(express.static("public"));


// ======================================
// 4. INQUIRY VALIDATION SCHEMA
// ======================================

const inquirySchema = z.object({

    full_name: z.string({
        error: "Please enter your full name."
    })
    .trim()
    .min(2, { error: "Your name must contain at least 2 characters." })
    .max(40, { error: "Your name cannot exceed 40 characters." }),

    phone: z.string({
        error: "Please enter your phone number."
    })
    .trim()
    .min(7, { error: "Your phone number is too short." })
    .max(20, { error: "Your phone number is too long." }),

    inquiry_type: z.enum([
        "admissions",
        "fees",
        "tahfidh",
        "other"
    ], {
        error: "Please select an inquiry type."
    }),

    message: z.string({
        error: "Please enter your inquiry."
    })
    .trim()
    .min(10, { error: "Your message must contain at least 10 characters." })
    .max(500, { error: "Your message cannot exceed 500 characters." })

});


// // ======================================
// // ADMISSIONS APPLICATION VALIDATION
// // ======================================

// const admissionsSchema = z.object({

//     pupil_name: z.string({
//         error: "Please enter the pupil's full name."
//     })
//     .trim()
//     .min(2, { error: "Pupil's name is too short." })
//     .max(80, { error: "Pupil's name is too long." }),

//     dob: z.iso.date({
//         error: "Please provide a valid date of birth."
//     }),

//     class_grade: z.enum([
//         "Nursery / Kindergarten",
//         "Primary One (P.1)",
//         "Primary Two (P.2)",
//         "Primary Three (P.3)",
//         "Primary Four (P.4)",
//         "Primary Five (P.5)",
//         "Primary Six (P.6)",
//         "Primary Seven (P.7)",
//         "Tahfidh Special Class"
//     ], {
//         error: "Please select a valid class."
//     }),

//     program_type: z.enum([
//         "Boarding",
//         "Day"
//     ], {
//         error: "Please select a section."
//     }),

//     parent_name: z.string({
//         error: "Please enter the parent's name."
//     })
//     .trim()
//     .min(2, { error: "Parent's name is too short." })
//     .max(80, { error: "Parent's name is too long." }),

//     phone: z.string({
//         error: "Please provide a phone number."
//     })
//     .trim()
//     .min(7, { error: "Phone number is too short." })
//     .max(20, { error: "Phone number is too long." }),

//     email: z.email({
//         error: "Please provide a valid email address."
//     }),

//     notes: z.string()
//         .trim()
//         .max(1000, {
//             error: "Additional notes cannot exceed 1,000 characters."
//         })
//         .optional()

// });


// ======================================
// 5. COOKIE CLEANUP FUNCTION
// ======================================

function clearOAuthStateCookie(response) {

    response.setHeader(
        "Set-Cookie",
        `google_oauth_state=; HttpOnly; SameSite=Lax; Path=/oauth2callback; Max-Age=0${secureCookie}`
    );

}


// ======================================
// 6. INQUIRY POST ENDPOINT
// ======================================
site.post("/api/inquiries", async (request, response) => {

    // 1. Validate incoming information

    const validation = inquirySchema.safeParse(request.body);

    if (!validation.success) {

        return response.status(400).json({
            success: false,
            errors: validation.error.issues
        });

    }

    const inquiry = validation.data;


    // 2. Forward validated information to Formspree

    try {

        const formspreeResponse = await fetch(
            process.env.FORMSPREE_ENDPOINT2,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify(inquiry)

            }
        );


        // 3. Check Formspree's response

        if (!formspreeResponse.ok) {

            console.error(
                "Formspree rejected submission:",
                formspreeResponse.status
            );

            return response.status(502).json({
                success: false,
                errors: [],
                message: "Unable to deliver your inquiry. Please try again."
            });

        }


        // 4. Confirm successful submission

        return response.status(202).json({

            success: true,

            message: "Your inquiry has been successfully submitted."

        });

    } catch (error) {

        console.error("Formspree connection error:", error.message);

        return response.status(502).json({

            success: false,

            errors: [],

            message: "Our submission service is temporarily unavailable."

        });

    }

});



// // ======================================
// // 9. START SERVER
// // ======================================

site.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});