// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    error: boolean;
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        res.status(403).send({ error: true, message: 'Unauthorized' });
        return '';
    }

    const mail = require('@sendgrid/mail');

    mail.setApiKey(process.env.SENDGRID_API_KEY);

    const { name, email, message } = req.body;

    const emailMessage = `
        Name: ${name}\r\n
        Email: ${email}\r\n
        Message: ${message}
    `;

    try {
        await mail.send({
            to: process.env.EMAIL_TO,
            from: process.env.EMAIL_FROM,
            subject: 'Nuevo contacto!',
            text: emailMessage,
            html: emailMessage.replace(/\r\n/g, '<br>'),
        });

        res.status(200).json({ error: false, message: 'Ok' });
    } catch (error) {
        res.status(502).json({ error: true, message: `${error}` });
    }
}
