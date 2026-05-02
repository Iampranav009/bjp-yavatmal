"use client";

// ─── Marathi Birthday Letter ────────────────────────────────────────────────
// Plain, simple letter — exactly matching the वाढदिवस पत्र.docx format.
// White background, black text, no decorations, no colors.
// ─────────────────────────────────────────────────────────────────────────────

function generateMarathiLetterHTML(
    memberName: string,
    position: string,
    signatureUrl?: string,
    bannerUrl?: string
): string {
    const today = new Date();
    const marathiDate = today.toLocaleDateString("mr-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>वाढदिवस पत्र — ${memberName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Marathi:ital@0;1&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: A4;
      margin: 25mm 20mm 25mm 25mm;
    }

    body {
      font-family: 'Tiro Devanagari Marathi', serif;
      font-size: 14pt;
      color: #000;
      background: #fff;
      padding: 40px 60px 60px 60px;
      max-width: 210mm;
      margin: 0 auto;
      line-height: 1.8;
    }

    /* ── Verse / heading lines ── */
    .verse {
      text-align: center;
      margin-bottom: 4px;
    }

    /* ── Recipient block ── */
    .recipient {
      margin-top: 18px;
      margin-bottom: 4px;
    }

    /* ── Salutation ── */
    .salutation {
      margin-bottom: 14px;
    }

    /* ── Body ── */
    .body-para {
      text-align: justify;
      margin-bottom: 10px;
    }

    /* ── Signature block ── */
    .signature-block {
      margin-top: 30px;
      text-align: right;
    }
    .sig-image {
      width: 150px;
      height: auto;
      display: block;
      margin-left: auto;
      margin-bottom: 2px;
    }

    /* ── Banner ── */
    .banner-image {
      width: 100%;
      height: auto;
      display: block;
      margin-bottom: 30px;
    }

    /* ── Print / download button (hidden on print) ── */
    .action-bar {
      text-align: right;
      margin-bottom: 20px;
    }
    .btn-print {
      padding: 8px 20px;
      font-family: 'Tiro Devanagari Marathi', serif;
      font-size: 13pt;
      cursor: pointer;
      border: 1px solid #333;
      background: #fff;
      color: #000;
    }

    @media print {
      .action-bar { display: none !important; }
      body { padding: 0; }
    }
  </style>
</head>
<body>

  <div class="action-bar">
    <button class="btn-print" onclick="window.print()">डाउनलोड / प्रिंट करा</button>
  </div>

  ${bannerUrl ? `<img src="${bannerUrl}" alt="Banner" class="banner-image" />` : ""}

  <div class="verse">' जीवेत् शरदः शतम ' !</div>
  <div class="verse">सुदिनं सुदिनं जन्मदिनं तव ,</div>
  <div class="verse">" भवतु मंगलं जन्मदिनं तव , भवतु मंगलं जन्मदिनं " |</div>

  <div class="recipient">
    माननीय श्री/श्रीमती ${memberName}${position ? ` — ${position}` : ""}
  </div>

  <div class="salutation">स.न.वि.वि.</div>

  <div class="body-para">
    असं म्हणतात ; जीवनावर विचाराचे अधिराज्य चालते. पण याच विचाराला विवेकाची जोड देऊन पक्षाचे ध्येय , धोरण , मूल्ये समाजात ..., जनमाणसात रुजविण्याचे कार्य आपण समर्पित भावनेने ... , सातत्याने करीत आहात. हे महनीय कार्य अभिनंदनीय आहे...! वंदनीय आहे...!!!
  </div>

  <div class="body-para">
    आपल्या देशाचे पंतप्रधान आदरणीय नरेन्द्रजी मोदी म्हणतात... , " समाजकी सेवा करने का मौका , हमे समाज ऋण चुकानेका मौका देता है" ।
  </div>

  <div class="body-para">
    आपल्या स्वभावातच असणारी ' समाजसेवेची वृत्ती ' वृद्धिंगत होवो...! त्या करिता परमेश्वर आपणास ' दीर्घ आरोग्य ' प्रदान करो....! सौख्य , समृद्धी , यश , कीर्ती लाभो....!
  </div>

  <div class="body-para">
    या प्रार्थनेसह आपणास वाढदिवसाच्या अनंत... , उदंड , मनस्वी हार्दिक शुभेच्छा !
  </div>

  <div class="signature-block">
    ${signatureUrl ? `<img src="${signatureUrl}" alt="signature" class="sig-image" />` : ""}
    <div>ॲड. प्रफुल्ल चौहान</div>
    <div>जिल्हाध्यक्ष, भाजपा, यवतमाळ</div>
  </div>

</body>
</html>`;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function openBirthdayLetter(
    memberName: string,
    position: string,
    _birthDate?: string
): void {
    const signatureUrl = `${window.location.origin}/images/letter/sign.png`;
    const bannerUrl = `${window.location.origin}/images/letter/banner-nav.png`;
    const html = generateMarathiLetterHTML(memberName, position, signatureUrl, bannerUrl);
    const newWin = window.open("", "_blank");
    if (!newWin) {
        alert(
            "कृपया पॉप-अप ब्लॉकर बंद करा आणि पुन्हा प्रयत्न करा.\nPlease allow pop-ups and try again."
        );
        return;
    }
    newWin.document.open();
    newWin.document.write(html);
    newWin.document.close();
}

export function downloadBirthdayHTML(
    memberName: string,
    position: string,
    _birthDate?: string
): void {
    const signatureUrl = `${window.location.origin}/images/letter/sign.png`;
    const bannerUrl = `${window.location.origin}/images/letter/banner-nav.png`;
    const html = generateMarathiLetterHTML(memberName, position, signatureUrl, bannerUrl);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `वाढदिवस_पत्र_${memberName.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export async function downloadBirthdayPDF(
    memberName: string,
    position: string,
    birthDate: string,
    _memberAddress?: string
): Promise<void> {
    openBirthdayLetter(memberName, position, birthDate);
}

export async function generateBirthdayPDF(
    memberName: string,
    position: string,
    _birthDate: string,
    _memberAddress?: string
): Promise<Blob> {
    const signatureUrl = `${window.location.origin}/images/letter/sign.png`;
    const bannerUrl = `${window.location.origin}/images/letter/banner-nav.png`;
    const html = generateMarathiLetterHTML(memberName, position, signatureUrl, bannerUrl);
    return new Blob([html], { type: "text/html;charset=utf-8" });
}

export async function shareLetterViaWhatsApp(
    memberName: string,
    position: string,
    birthDate: string,
    phone: string,
    customMessage?: string,
    _memberAddress?: string
): Promise<void> {
    downloadBirthdayHTML(memberName, position, birthDate);

    const message =
        customMessage ||
        `वाढदिवसाच्या हार्दिक शुभेच्छा, ${memberName}!\n\nभाजपा यवतमाळ जिल्हा तर्फे आपणास वाढदिवसाच्या मनःपूर्वक शुभेच्छा!\n\n— ॲड. प्रफुल्ल चौहान\nजिल्हाध्यक्ष, भाजपा, यवतमाळ`;

    let cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    if (!cleanPhone.startsWith("+") && !cleanPhone.startsWith("91")) {
        cleanPhone = "91" + cleanPhone;
    }
    if (cleanPhone.startsWith("+")) {
        cleanPhone = cleanPhone.substring(1);
    }
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, "_blank");
}

export default function BirthdayLetterDocument() {
    return null;
}
