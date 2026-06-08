import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

import {
  getHairLossSituationLabel,
  HAIR_TRANSPLANT_ID,
  TREATMENT_LABELS,
  type TreatmentId,
} from '@/components/consultation-form/form-data';

export const dynamic = 'force-dynamic';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Serwer nie jest skonfigurowany do wysyłki.' },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const formData = await request.formData();

    const fax = ((formData.get('fax') as string) || '').trim();
    if (fax) {
      return NextResponse.json({ success: true, message: 'OK' });
    }

    const treatment = ((formData.get('treatment') as string) || '') as TreatmentId;
    const hairLossSituation = ((formData.get('hairLossSituation') as string) || '').trim();
    const description = ((formData.get('description') as string) || '').trim();
    const name = ((formData.get('name') as string) || '').trim();
    const phone = ((formData.get('phone') as string) || '').trim();
    const email = ((formData.get('email') as string) || '').trim();
    const photoFiles = formData.getAll('photos').filter((entry): entry is File => entry instanceof File);

    if (!treatment || !TREATMENT_LABELS[treatment]) {
      return NextResponse.json({ error: 'Nieprawidłowy wybór zabiegu.' }, { status: 400 });
    }

    if (treatment === HAIR_TRANSPLANT_ID) {
      const situationId = Number(hairLossSituation);
      if (!Number.isInteger(situationId) || situationId < 1 || situationId > 6) {
        return NextResponse.json(
          { error: 'Wybierz sytuację wypadania włosów.' },
          { status: 400 },
        );
      }
    } else if (description.length < 8) {
      return NextResponse.json(
        { error: 'Opis oczekiwanego efektu jest za krótki.' },
        { status: 400 },
      );
    }

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Podaj imię.' }, { status: 400 });
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15) {
      return NextResponse.json({ error: 'Podaj poprawny numer telefonu.' }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Niepoprawny format adresu e-mail.' }, { status: 400 });
    }

    for (const file of photoFiles) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Dozwolone są wyłącznie pliki graficzne.' }, { status: 400 });
      }
      if (file.size > 8 * 1024 * 1024) {
        return NextResponse.json({ error: 'Każde zdjęcie może mieć maksymalnie 8 MB.' }, { status: 400 });
      }
    }

    const adminEmail =
      process.env.CONSULTATION_EMAIL_TO ||
      process.env.CONTACT_EMAIL_TO ||
      'kontakt@hairclinicprive.pl';

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      'Hair Clinic PRIVÉ <onboarding@resend.dev>';

    const treatmentLabel = TREATMENT_LABELS[treatment];
    const hairLossLabel = getHairLossSituationLabel(Number(hairLossSituation));
    const analysisCell =
      treatment === HAIR_TRANSPLANT_ID
        ? escapeHtml(hairLossLabel ?? hairLossSituation)
        : escapeHtml(description);

    const safe = {
      treatmentLabel: escapeHtml(treatmentLabel),
      analysisCell,
      name: escapeHtml(name),
      phone: escapeHtml(phone),
      email: escapeHtml(email || 'Nie podano'),
      photoCount: String(photoFiles.length),
    };

    const attachments = await Promise.all(
      photoFiles.map(async (file, index) => ({
        filename: file.name || `zdjecie-${index + 1}.jpg`,
        content: Buffer.from(await file.arrayBuffer()),
      })),
    );

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; color: #1A1A1A; }
    .wrap { max-width: 600px; margin: 0 auto; padding: 20px; }
    .head {
      background: linear-gradient(135deg, #E5007E, #751F5E);
      color: #ffffff;
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .body {
      background: #F8F8F8;
      padding: 20px;
      border: 1px solid #EBEBEB;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #EBEBEB; }
    th { width: 34%; color: #6B6B6B; font-weight: 600; }
    .block { margin-top: 16px; padding: 14px; background: #fff; border-radius: 8px; border-left: 4px solid #E5007E; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <h1 style="margin:0;font-size:22px;">Nowe zgłoszenie — Hair Clinic PRIVÉ</h1>
    </div>
    <div class="body">
      <table>
        <tr><th>Zabieg</th><td>${safe.treatmentLabel}</td></tr>
        <tr><th>Analiza</th><td>${safe.analysisCell}</td></tr>
        <tr><th>Imię</th><td>${safe.name}</td></tr>
        <tr><th>Telefon</th><td>${safe.phone}</td></tr>
        <tr><th>E-mail</th><td>${safe.email}</td></tr>
        <tr><th>Zdjęcia</th><td>${safe.photoCount}</td></tr>
      </table>
      <div class="block">
        <strong>Formularz high-conversion</strong>
        <p style="margin:8px 0 0;">Wiadomość wysłana ze strony Hair Clinic PRIVÉ.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: `Konsultacja: ${treatmentLabel} — ${name}`,
      html: emailHtml,
      attachments: attachments.length ? attachments : undefined,
      ...(email && email !== adminEmail ? { replyTo: email } : {}),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message || 'Błąd wysyłki' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('send-consultation-request:', error);
    return NextResponse.json({ error: 'Nie udało się wysłać wiadomości.' }, { status: 500 });
  }
}
