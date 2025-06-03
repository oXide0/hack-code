import { createTransport } from 'nodemailer';
import { getOrigin } from './utils';

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

    const role = args.variant === 'teachers' ? 'Teacher' : 'Student';
    const origin = await getOrigin();
    const html = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; background: #181F2A; border-radius: 14px; box-shadow: 0 2px 12px #0002; padding: 36px 28px 28px 28px; color: #fff;">
    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 28px;">
       <img src="${origin}/logo.svg" alt="HackCode Logo" style="height: 48px; width: auto; margin-right: 12px;" />
      <span style="font-size: 1.85rem; font-weight: 700; letter-spacing: -1.5px; color: #2ECC71;">HackCode</span>
    </div>

    <h2 style="font-size: 1.45rem; font-weight: 600; margin-bottom: 16px; margin-top: 0; color: #2ECC71;">
      Welcome to HackCode!
    </h2>

    <p style="font-size: 1.08rem; margin-bottom: 20px;">
      Hi there,<br/>
      You've been invited to join <b>HackCode</b> as a <span style="color: #2ECC71;"><b>${role}</b></span>.
    </p>

    <p style="margin-bottom: 30px;">
      Click the button below to accept your invitation and get started:
    </p>

    <div style="margin-bottom: 28px; text-align: center;">
      <a href="${args.inviteLink}"
        style="display: inline-block; padding: 13px 38px; background: linear-gradient(90deg, #27ae60 0%, #219150 100%); color: #fff; text-decoration: none; border-radius: 7px; font-size: 1.1rem; font-weight: bold; letter-spacing: 0.5px;box-shadow:0 2px 5px #27ae6033;">
        Accept Invitation
      </a>
    </div>

    <p style="font-size: 0.97rem; color: #aad1bb !important; margin-bottom: 28px;">
      Or copy and paste this link into your browser:<br />
      <a href="${args.inviteLink}" style="color: #2ECC71; word-break: break-all;">${args.inviteLink}</a>
    </p>

    <hr style="border: none; border-top: 1px solid #223146; margin: 30px 0;" />

    <p style="color:#8992A8;font-size:0.97rem; margin: 0;">
      If you did not expect this invitation, you can safely ignore this email.<br/>
      Need help? Contact <a href="mailto:support@hackcode.com" style="color:#2ECC71;">support@hackcode.com</a>
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
