import { createTransport } from 'nodemailer';

interface SendInviteEmailArgs {
    readonly to: string;
    readonly variant: 'students' | 'teachers';
    readonly inviteLink: string;
}

/**
 * Sends an invite email to a user (student or teacher).
 *
 * @param to - The recipient's email address
 * @param role - The role of the invitee ("student" or "teacher")
 * @param inviteLink - The invitation link for registration or joining
 * @param options - Optional: transporter options override for testing/mocking
 */
export async function sendInviteEmail(args: SendInviteEmailArgs) {
    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const subject =
        args.variant === 'teachers'
            ? "You're invited to teach on HackCode"
            : "You're invited to join HackCode as a student";
    const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto">
      <h2>Welcome to HackCode!</h2>
      <p>
        Hi, you've been invited to join <b>HackCode</b> as a <b>${args.variant.slice(0, args.variant.length - 1)}</b>.
      </p>
      <p>
        Click the button below to accept your invitation and get started.
      </p>
      <p>
        <a href="${args.inviteLink}" style="display:inline-block;padding:12px 24px;background:#27ae60;color:white;text-decoration:none;border-radius:5px;font-weight:bold;">Accept Invitation</a>
      </p>
      <p>
        Or copy and paste this link into your browser:<br />
        <a href="${args.inviteLink}">${args.inviteLink}</a>
      </p>
      <hr />
      <p style="color:#888;font-size:12px">
        If you did not expect this invitation, you can ignore this email.
      </p>
    </div>
  `;

    await transporter.sendMail({
        from: process.env.SMTP_FROM || '"HackCode" <no-reply@hackcode.app>',
        to: args.to,
        subject,
        html
    });
}
