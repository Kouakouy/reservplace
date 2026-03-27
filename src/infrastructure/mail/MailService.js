import nodemailer from 'nodemailer';

// Transporteur singleton réutilisé entre les appels
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || pass === 'VOTRE_APP_PASSWORD_GMAIL_ICI') {
    throw new Error(
      "Configuration email manquante. Renseignez SMTP_USER et SMTP_PASS (App Password Gmail) dans votre .env"
    );
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  console.log(`[MailService] ✅ Transporteur Gmail configuré pour : ${user}`);
  return transporter;
}

export class MailService {
  async sendLoginCode(to, code) {
    const transport = getTransporter();

    const mailOptions = {
      from: `"ReservPlace" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Votre code de vérification ReservPlace',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #222; margin-bottom: 8px;">Vérification de votre compte Administrateur</h2>
          <p style="color: #555;">Utilisez ce code à 6 chiffres pour finaliser votre inscription :</p>
          <div style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #4A90E2;
                      text-align: center; padding: 24px; background: #f0f6ff;
                      border-radius: 8px; margin: 24px 0;">
            ${code}
          </div>
          <p style="color: #888; font-size: 14px;"> Ce code expire dans <strong>15 minutes</strong>.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #aaa; font-size: 12px;">
            Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.<br/>
            — L'équipe ReservPlace
          </p>
        </div>
      `,
    };

    try {
      await transport.sendMail(mailOptions);
      console.log(`[MailService] Code OTP envoyé à ${to}`);
    } catch (error) {
      console.error('[MailService]  Échec envoi email :', error.message);
      throw new Error("Impossible d'envoyer l'email de vérification. Vérifiez votre App Password Gmail.");
    }
  }
}
