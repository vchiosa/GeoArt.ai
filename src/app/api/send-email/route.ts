// api/send-email/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, preferredContact, message } =
      await request.json();

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email app password
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`, // Sets the sender's name and email
      to: process.env.RECEIVING_EMAIL, // The email where messages are received
      subject: `📩 New GeoArt Contact Form Submission: ${subject}`,
      text: `
      === CONTACT FORM SUBMISSION ===
    
      🏷 Name: ${name}
      📧 Email: ${email}
      📞 Phone: ${phone || "N/A"}
      🛠 Preferred Contact Method: ${preferredContact}
      ✉️ Subject: ${subject}
    
      📝 Message:
      ---------------------------------
      ${message}
      ---------------------------------
      `,

      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
          <h2 style="color: #007BFF; text-align: center;">📩 New Contact Form Submission</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="font-weight: bold; padding: 8px; background-color: #f8f9fa;">🏷 Name:</td>
              <td style="padding: 8px;">${name}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; background-color: #f8f9fa;">📧 Email:</td>
              <td style="padding: 8px;">${email}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; background-color: #f8f9fa;">📞 Phone:</td>
              <td style="padding: 8px;">${phone || "N/A"}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; background-color: #f8f9fa;">🛠 Preferred Contact:</td>
              <td style="padding: 8px;">${preferredContact}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 8px; background-color: #f8f9fa;">✉️ Subject:</td>
              <td style="padding: 8px;">${subject}</td>
            </tr>
          </table>
    
          <div style="margin-top: 20px; padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
            <h3 style="color: #333; margin-bottom: 10px;">📝 Message:</h3>
            <p style="white-space: pre-line; color: #555;">${message}</p>
          </div>
    
          <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">
            <em>This message was sent via the contact form.</em>
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
