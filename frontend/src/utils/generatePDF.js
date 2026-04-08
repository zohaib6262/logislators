import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getTotalPoints } from "./getTotalScores";

const loadImageAsBase64 = async (imageUrl) => {
  try {
    // Create a canvas to handle CORS issues
    const img = new Image();
    img.crossOrigin = "anonymous";

    return new Promise((resolve) => {
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve(null);
            return;
          }

          // Set canvas size to match image
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image on canvas
          ctx.drawImage(img, 0, 0);

          // Convert to base64
          const base64 = canvas.toDataURL("image/jpeg", 0.8);
          resolve(base64);
        } catch (error) {
          console.warn("Canvas conversion failed:", error);
          resolve(null);
        }
      };

      img.onerror = () => {
        console.warn("Image failed to load:", imageUrl);
        resolve(null);
      };

      // Set a timeout to avoid hanging
      setTimeout(() => {
        resolve(null);
      }, 10000);

      img.src = imageUrl;
    });
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
};

export const generatePDF = async (representative, primaryColor) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  function checkStateOrFederal(value) {
    if (value === "") {
      return "State Level";
    } else if (value !== "state") {
      return "Federal Level";
    } else {
      return "State Level";
    }
  }

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };
  const primaryRGB = hexToRgb(primaryColor);

  const addWrappedText = (text, x, y, maxWidth, fontSize = 10) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + lines.length * (fontSize * 0.35);
  };

  const checkNewPage = (requiredHeight) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      return margin;
    }
    return yPosition;
  };

  try {
    let imageDataUrl = null;
    const imageElement = document.getElementById(representative.name);

    if (imageElement?.src) {
      try {
        const response = await fetch(imageElement.src);
        const blob = await response.blob();

        const imageLoaded = new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const size = 100; // Canvas size
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");

            // ✅ Create a radial or linear gradient background
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, primaryColor);
            gradient.addColorStop(1, primaryColor);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);

            // ✅ Draw circular clip for image
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // ✅ Draw image on top of gradient within the circle
            ctx.drawImage(img, 0, 0, size, size);

            imageDataUrl = canvas.toDataURL("image/jpeg");
            resolve();
          };
          img.src = URL.createObjectURL(blob);
        });

        await imageLoaded;
      } catch (imgErr) {
        imageDataUrl = null;
      }
    }

    const headerHeight = imageDataUrl ? 60 : 60;
    pdf.setFillColor(...primaryRGB);
    pdf.rect(0, 0, pageWidth, headerHeight, "F");

    if (imageDataUrl) {
      const imgSize = 35;
      const imgX = margin;
      const imgY = 15;
      const centerX = imgX + imgSize / 2;
      const centerY = imgY + imgSize / 2;
      const radius = imgSize / 2;

      pdf.setFillColor(255, 255, 255);
      pdf.circle(centerX, centerY, radius, "F");

      pdf.addImage(imageDataUrl, "JPEG", imgX, imgY, imgSize, imgSize);
    }

    const textStartX = imageDataUrl ? margin + 35 : margin;
    const textStartY = 25;

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text(representative.name.toUpperCase(), textStartX + 6, textStartY);

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `${representative.current_role.title} (${checkStateOrFederal(
        representative.jurisdiction?.classification || ""
      )})`,
      textStartX + 6,
      textStartY + 8
    );

    pdf.text(
      `${representative.party} Party - District ${representative.current_role.district}`,
      textStartX + 6,
      textStartY + 15
    );

    // if (representative.county) {
    //   pdf.text(`County: ${representative.county}`, textStartX, textStartY + 30);
    // }

    if (representative.extras?.highlights?.session) {
      pdf.setFontSize(14);
      pdf.text(
        `Nevada’s ${representative.extras.highlights.session} Legislative Report Card`,
        textStartX + 5,
        textStartY + 22
      );
    }

    if (representative.extras?.grade !== undefined) {
      const grade = representative.extras.grade;
      const gradeX = pageWidth - margin - 20;
      const gradeY = textStartY - 1;

      pdf.setFontSize(12);
      pdf.text("Grade:", gradeX, gradeY);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${grade}%`, gradeX, gradeY + 10);

      pdf.setDrawColor(255, 255, 255);
      pdf.setFillColor(255, 255, 255);
      pdf.rect(gradeX, gradeY + 15, 30, 4, "S");

      let convertInt = parseFloat(grade);
      const gradeColor =
        convertInt >= 80
          ? [34, 197, 94]
          : convertInt >= 50
          ? [234, 179, 8]
          : [239, 68, 68];
      pdf.setFillColor(...gradeColor);
      pdf.rect(gradeX, gradeY + 15, (30 * convertInt) / 100, 4, "F");
    }

    yPosition = headerHeight + 15;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Contact Information", margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    if (representative.phone) {
      pdf.text(`Phone: ${representative.phone}`, margin, yPosition);
      yPosition += 6;
    }
    if (representative.email) {
      pdf.text(`Email: ${representative.email}`, margin, yPosition);
      yPosition += 6;
    }
    if (representative.openstates_url) {
      pdf.text(
        `Official Website: ${representative.openstates_url}`,
        margin,
        yPosition
      );
      yPosition += 6;
    }
    if (representative.address) {
      yPosition = addWrappedText(
        `Address: ${representative.address}`,
        margin,
        yPosition,
        contentWidth
      );
    } else {
      pdf.text(
        `District: ${representative.current_role.district}, Nevada, USA`,
        margin,
        yPosition
      );
      yPosition += 6;
    }

    yPosition += 10;

    if (representative.extras?.biography) {
      yPosition = checkNewPage(10);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Biography", margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      yPosition = addWrappedText(
        representative.extras.biography,
        margin,
        yPosition,
        contentWidth,
        10
      );
      yPosition += 10;
    }

    const votingRecords = representative.extras?.votingRecord || [];
    if (votingRecords.length > 0) {
      yPosition = checkNewPage(10);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Voting Record", margin, yPosition);
      yPosition += 6;

      // Calculate total score
      let totalNumerator = 0;
      let totalDenominator = 0;

      votingRecords.forEach((record) => {
        if (record.score) {
          const [numerator, denominator] = record.score.split("/").map(Number);
          if (!isNaN(numerator) && !isNaN(denominator)) {
            totalNumerator += numerator;
            totalDenominator += denominator;
          }
        }
      });

      const totalScore = `${totalNumerator.toFixed(
        2
      )}/${totalDenominator.toFixed(2)}`;

      autoTable(pdf, {
        startY: yPosition,
        head: [["Area", "Notable Bills", "Score"]],
        body: votingRecords.map((record) => [
          record.area || "N/A",
          record.notableBills || "N/A",
          record.score || "N/A",
        ]),
        foot: [["Total", "", totalScore]],
        styles: { fontSize: 10 },
        theme: "grid",
        headStyles: {
          fillColor: [0, 48, 73],
          textColor: [255, 255, 255],
          halign: "center",
          fontStyle: "bold",
        },
        bodyStyles: {
          halign: "center",
        },
        footStyles: {
          fillColor: [245, 245, 245],
          textColor: [0, 0, 0],
          halign: "center",
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 100 },
          2: { cellWidth: 30 },
        },
        margin: { left: margin, right: margin },
      });

      yPosition = pdf.lastAutoTable.finalY + 10;
    }

    if (
      Array.isArray(representative?.extras?.extraPoints) &&
      representative.extras.extraPoints.length > 0
    ) {
      // Section header once
      yPosition = checkNewPage(20);
      pdf.setFillColor(75, 46, 46);
      pdf.rect(margin, yPosition - 5, contentWidth, 20, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      const headerText = "EXTRA POINTS ADDED/DEDUCTED";
      const textWidth = pdf.getTextWidth(headerText);
      const centerX = margin + contentWidth / 2 - textWidth / 2;

      pdf.text(headerText, centerX, yPosition + 6);

      yPosition += 10;

      // Loop through each point
      representative.extras.extraPoints.forEach((point) => {
        // --- Add top margin before each point ---
        yPosition += 8;

        // Ensure space before drawing this block
        yPosition = checkNewPage(30);

        pdf.setFillColor(75, 46, 46);
        pdf.rect(margin, yPosition - 5, contentWidth, 20, "F");

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(point.bills, margin + 10, yPosition);

        const rightX = margin + 100;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);

        let lines = [];
        if (point?.description && point.description.trim() !== "") {
          lines = pdf.splitTextToSize(point.description, contentWidth - 120);

          // Description print karo (multi-line)
          pdf.setFont("helvetica", "normal");
          pdf.text(lines, rightX, yPosition);

          // Ab last line ka content aur width nikal lo
          const lastLine = lines[lines.length - 1];
          const lastLineWidth = pdf.getTextWidth(lastLine);

          // Line height calculate karo (approx: fontSize * 0.35)
          const lineHeight = pdf.getFontSize() * 0.35;
          const lastLineY = yPosition + (lines.length - 1) * lineHeight;

          // Ab points ko usi last line ke end par bold likho
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          pdf.text(
            String(getTotalPoints(point.points)),
            rightX + lastLineWidth + 5, // thoda gap
            lastLineY
          );

          // Reset
          pdf.setFont("helvetica", "normal");
        } else {
          // Agar description hi nahi hai → sirf points likho
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          pdf.text(String(getTotalPoints(point.points)), rightX, yPosition);
          pdf.setFont("helvetica", "normal");
        }

        // --- Add bottom margin after each point ---
        yPosition += Math.max(lines.length * 1, 4) + 4;
      });
    }

    if (representative?.extras?.highlights) {
      const sectionHeight = 50; // approx total block height
      yPosition = checkNewPage(sectionHeight + 20); // ✅ check available space
      const keyTakeaways =
        representative?.extras?.highlights?.keyTakeaways || "";
      const highlightText = `${keyTakeaways}`.trim();
      if (highlightText) {
        // Background block
        pdf.setFillColor(55, 59, 84);
        pdf.rect(margin, yPosition - 5, contentWidth, sectionHeight, "F");

        // Title
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Highlights & Key Takeaways", margin + 10, yPosition + 10);

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
      }

      // ✅ KeyTakeaways + session safe string

      const session = representative?.extras?.highlights?.session || "";

      if (highlightText) {
        const highlightLines = pdf.splitTextToSize(
          highlightText,
          contentWidth - 40 // Reduced width to create space for the circle
        );
        pdf.text(highlightLines, margin + 10, yPosition + 20);
      }

      // ✅ BadgeNum safe
      const badgeNum = representative?.extras?.highlights?.badgeNum;
      if (badgeNum && badgeNum > 0) {
        pdf.setFillColor(234, 179, 8);
        pdf.circle(pageWidth - margin - 25, yPosition + 15, 8, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(String(badgeNum), pageWidth - margin - 27, yPosition + 17);
      }

      yPosition += sectionHeight + 20;
      pdf.setTextColor(0, 0, 0);
    }

    yPosition = checkNewPage(20);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      margin,
      pageHeight - 10
    );
    pdf.text(
      `Representative Report - ${representative.name}`,
      pageWidth - margin - 80,
      pageHeight - 10
    );

    const fileName = `${representative.name.replace(/\s+/g, "_")}_Report.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
};
function checkNewPage(requiredSpace = 20) {
  const pageHeight = pdf.internal.pageSize.height;
  if (yPosition + requiredSpace > pageHeight - margin) {
    pdf.addPage();
    yPosition = margin + 20; // reset top margin
  }
  return yPosition;
}
