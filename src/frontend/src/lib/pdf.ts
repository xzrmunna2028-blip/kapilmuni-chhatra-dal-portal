import type { Member } from "@/backend";
import { jsPDF } from "jspdf";

const ORG_NAME = "২নং কপিলমুনি ইউনিয়ন ছাত্রদল";
const ORG_NAME_EN = "2 No. Kapilmuni Union Chhatra Dal";
const PARENT_ORG = "Bangladesh Jatiotabadi Chhatra Dal (BJCD)";
const SIGNATURE_LABEL = "কমিটির স্বাক্ষর";

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMembershipPDF(member: Member): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
  const W = 148;
  const pageH = 210;

  // --- Header band: top half red ---
  doc.setFillColor(220, 20, 60);
  doc.rect(0, 0, W, 35, "F");

  // --- Sub-header band: dark green ---
  doc.setFillColor(0, 106, 78);
  doc.rect(0, 35, W, 18, "F");

  // --- Logo circle (placeholder) ---
  doc.setFillColor(255, 255, 255);
  doc.circle(W / 2, 24, 14, "F");
  doc.setFillColor(220, 20, 60);
  doc.circle(W / 2, 19, 10, "F");
  doc.setFillColor(0, 106, 78);
  doc.circle(W / 2, 29, 10, "F");
  doc.setFontSize(5);
  doc.setTextColor(255, 255, 255);
  doc.text("\u09A6\u09B2", W / 2, 24, { align: "center" });

  // --- Org name in header ---
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(ORG_NAME_EN, W / 2, 41, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(PARENT_ORG, W / 2, 48, { align: "center" });

  // --- Card title ---
  doc.setFillColor(245, 245, 240);
  doc.rect(0, 53, W, pageH - 53, "F");
  doc.setTextColor(0, 106, 78);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("MEMBERSHIP CARD", W / 2, 63, { align: "center" });
  doc.setDrawColor(220, 20, 60);
  doc.setLineWidth(0.8);
  doc.line(20, 66, W - 20, 66);

  // --- Photo area ---
  const photoX = 10;
  const photoY = 72;
  const photoW = 32;
  const photoH = 38;
  doc.setDrawColor(0, 106, 78);
  doc.setLineWidth(1);
  doc.rect(photoX, photoY, photoW, photoH);

  try {
    const photoUrl = member.photoBlob.getDirectURL();
    if (photoUrl) {
      const img = await loadImageAsDataURL(photoUrl);
      doc.addImage(
        img,
        "JPEG",
        photoX + 0.5,
        photoY + 0.5,
        photoW - 1,
        photoH - 1,
      );
    }
  } catch {
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("Photo", photoX + photoW / 2, photoY + photoH / 2, {
      align: "center",
    });
  }

  // --- Member details ---
  const detailX = photoX + photoW + 5;
  const detailW = W - detailX - 8;
  const lineH = 7;
  let y = 76;

  const fields: Array<[string, string]> = [
    ["Name", member.fullName],
    ["Designation", member.designation],
    ["Phone", member.phone],
    ["Email", member.email],
    ["Member Since", formatDate(member.registeredAt)],
  ];

  for (const [label, value] of fields) {
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 106, 78);
    doc.text(`${label}:`, detailX, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(value, detailW - 18);
    doc.text(lines, detailX + 20, y);
    y += lineH;
  }

  // --- Address ---
  y = photoY + photoH + 8;
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 106, 78);
  doc.text("Address:", 10, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 30, 30);
  const addrLines = doc.splitTextToSize(member.fullAddress, W - 30);
  doc.text(addrLines, 30, y);
  y += addrLines.length * 5 + 4;

  // --- Status badge ---
  const statusColor =
    member.status === "approved" ? [0, 130, 80] : [220, 20, 60];
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(10, y, 35, 8, 2, 2, "F");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(member.status.toUpperCase(), 27.5, y + 5.5, { align: "center" });

  // --- Member ID ---
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text(`ID: ${member.id.toString()}`, W - 10, y + 5.5, { align: "right" });

  // --- Org name in Bengali ---
  y += 16;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(10, y, W - 10, y);
  y += 6;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 106, 78);
  doc.text(ORG_NAME, W / 2, y, { align: "center" });

  // --- Signature line ---
  const sigY = pageH - 20;
  doc.setDrawColor(0, 106, 78);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - 25, sigY, W / 2 + 25, sigY);
  doc.setFontSize(8);
  doc.setTextColor(0, 106, 78);
  doc.setFont("helvetica", "normal");
  doc.text(SIGNATURE_LABEL, W / 2, sigY + 5, { align: "center" });

  // --- Footer band ---
  doc.setFillColor(0, 106, 78);
  doc.rect(0, pageH - 8, W, 8, "F");
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.text(`${ORG_NAME} - সর্বস্বত্ব সংরক্ষিত`, W / 2, pageH - 3, {
    align: "center",
  });

  doc.save(`membership-${member.id.toString()}.pdf`);
}

async function loadImageAsDataURL(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
