import { StudySessionLog } from "../types";

/**
 * Cleanly escapes a value for CSV format according to RFC 4180:
 * - Wraps fields with quotes if they contain commas, newlines, or double quotes
 * - Escapes double quotes by doubling them (" -> "")
 */
function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) {
    return '""';
  }
  const str = String(val);
  if (
    str.includes(",") ||
    str.includes("\n") ||
    str.includes("\r") ||
    str.includes('"')
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates and triggers download of a CSV file containing study session logs.
 */
export function exportStudyLogsToCsv(
  logs: StudySessionLog[],
  filenamePrefix = "ras_study_sessions"
): boolean {
  try {
    if (!logs || logs.length === 0) {
      alert("No study logs available to export yet. Log a session first!");
      return false;
    }

    const headers = [
      "Session ID",
      "Date",
      "Subject",
      "Paper",
      "Duration (Minutes)",
      "Duration (Hours)",
      "Topic / Chapter Covered",
      "Quality Rating (1-5)",
      "Notes & Key Takeaways",
    ];

    const rows = logs.map((log) => {
      const hours = (log.durationMinutes / 60).toFixed(2);
      return [
        escapeCsvValue(log.id),
        escapeCsvValue(log.date),
        escapeCsvValue(log.subject),
        escapeCsvValue(log.paper || "General"),
        escapeCsvValue(log.durationMinutes),
        escapeCsvValue(hours),
        escapeCsvValue(log.topicCovered),
        escapeCsvValue(log.qualityRating ? `${log.qualityRating}/5` : "N/A"),
        escapeCsvValue(log.notes || ""),
      ].join(",");
    });

    // Add summary row at bottom
    const totalMinutes = logs.reduce(
      (acc, l) => acc + (l.durationMinutes || 0),
      0
    );
    const totalHours = (totalMinutes / 60).toFixed(2);
    const avgRating = (
      logs
        .filter((l) => l.qualityRating)
        .reduce((acc, l) => acc + (l.qualityRating || 0), 0) /
      (logs.filter((l) => l.qualityRating).length || 1)
    ).toFixed(1);

    const summaryRow = [
      escapeCsvValue("TOTAL SUMMARY"),
      escapeCsvValue(`${logs.length} sessions`),
      escapeCsvValue("ALL SUBJECTS"),
      escapeCsvValue("-"),
      escapeCsvValue(totalMinutes),
      escapeCsvValue(totalHours),
      escapeCsvValue(`Avg Rating: ${avgRating}/5`),
      escapeCsvValue(`${avgRating}/5`),
      escapeCsvValue(
        `Exported from RAS Rank 1 AI Studio on ${new Date().toLocaleDateString()}`
      ),
    ].join(",");

    // Prefix with UTF-8 BOM so Microsoft Excel correctly displays Hindi/Unicode characters
    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows, "", summaryRow].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];

    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `${filenamePrefix}_${today}.csv`);
    downloadAnchor.style.visibility = "hidden";
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Failed to export study logs to CSV:", error);
    alert(
      "An error occurred while generating CSV export. Please check console."
    );
    return false;
  }
}
