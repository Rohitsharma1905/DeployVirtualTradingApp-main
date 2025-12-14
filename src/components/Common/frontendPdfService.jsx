// src/services/frontendPdfService.js
import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream'; // For browser usage
import moment from 'moment-timezone';
import { Buffer } from 'buffer';
// Buffer might be polyfilled automatically by your bundler (like Vite/CRA)
// If not, you might need: import { Buffer } from 'buffer';
// window.Buffer = Buffer; // Make it global if needed by dependencies

// Helper function to format currency
const formatCurrency = (amount) => {
    const numAmount = Number(amount);
    if (isNaN(numAmount)) return '₹ N/A';
    return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Helper function to safely get user ID string
const getUserIdString = (user) => {
    return user?._id?.toString() || 'N/A';
};

// --- LOGO HANDLING ---
// Replace this with your actual Base64 encoded logo Data URI
// Example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...'
// You can generate this using an online converter or build tool
const LOGO_BASE64 = 'data:image/jpeg;base64,...YOUR_ACTUAL_BASE64_STRING...'; // <-- PASTE YOUR BASE64 LOGO HERE

// If you choose *not* to use a logo, set LOGO_BASE64 = null;

// Function to generate PDF, returns a Promise resolving with a Blob
const generateTransactionPDFFrontend = async (
    transactions,
    user,
    reportDate,
    timezone,
    companyDetails, // Includes { name, email, phone }
    eventDetails = null
) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                margin: 50,
                size: 'A4',
                bufferPages: true
            });

            // Use blobStream for browser environment
            const stream = doc.pipe(blobStream());

            // --- PDF Static Details ---
            const reportDateFormatted = moment(reportDate).tz(timezone).format('MMMM Do YYYY');
            const marketHours = `9:30 AM - 3:30 PM (${timezone})`; // Assuming fixed, adjust if needed
            const userName = user?.name || 'N/A';
            const userId = getUserIdString(user);

            // --- Header Function ---
            const drawHeader = (docInstance) => {
                const headerYStart = docInstance.page.margins.top;
                const headerXStart = docInstance.page.margins.left;
                const contentWidth = docInstance.page.width - docInstance.page.margins.left - docInstance.page.margins.right;
                const centerX = headerXStart + contentWidth / 2;
                const companyName = companyDetails?.name || 'PGR Trading';
                let currentY = headerYStart;
                const logoSize = 50;

                // 1. Logo and Company Name (Centered)
                if (LOGO_BASE64) {
                    try {
                        // For Base64, directly use the string. Ensure it includes the mime type prefix.
                        const logoX = centerX - logoSize / 2;
                        docInstance.image(LOGO_BASE64, logoX, currentY, {
                            fit: [logoSize, logoSize],
                        });
                        currentY += logoSize + 5;

                        docInstance.fontSize(14).font('Helvetica-Bold').text(companyName, headerXStart, currentY, {
                            align: 'center', width: contentWidth
                        });
                        currentY += 20;
                    } catch (imgErr) {
                        console.warn("Could not process Base64 logo:", imgErr);
                        // Fallback if logo fails
                        docInstance.fontSize(14).font('Helvetica-Bold').text(companyName, headerXStart, currentY, { align: 'center', width: contentWidth });
                        currentY += 25;
                    }
                } else {
                    // No logo provided, just draw company name
                    docInstance.fontSize(14).font('Helvetica-Bold').text(companyName, headerXStart, currentY, { align: 'center', width: contentWidth });
                    currentY += 25;
                }

                // 2. Report Title (Centered)
                docInstance.fontSize(18).font('Helvetica-Bold').text('Daily Transaction Report', headerXStart, currentY, { align: 'center', width: contentWidth });
                currentY += 30;

                // 3. User, Date, Event Info (Left Aligned)
                docInstance.fontSize(11).font('Helvetica');
                docInstance.text(`User: ${userName} (ID: ${userId})`, headerXStart, currentY);
                currentY += 15;

                if (eventDetails && eventDetails.name) {
                    docInstance.text(`Event: ${eventDetails.name}`, headerXStart, currentY);
                    currentY += 15;
                }

                docInstance.text(`Report Date: ${reportDateFormatted}`, headerXStart, currentY);
                currentY += 15;
                docInstance.text(`Market Hours: ${marketHours}`, headerXStart, currentY);
                currentY += 25;

                return currentY; // Return Y position for table start
            };

            // --- Footer Function (Simplified) ---
             const drawPageBottomElements = (docInstance) => {
                // Only page numbers handled in the final loop now
             };

            // --- Draw Header on First Page ---
            let tableTopY = drawHeader(doc);

            // --- Table Header ---
            const colWidths = { time: 70, symbol: 90, type: 50, qty: 60, price: 100, total: 110 };
            const tableHeaderY = tableTopY;
            let currentX = doc.page.margins.left;

            doc.fontSize(10).font('Helvetica-Bold');
            doc.text('Time', currentX, tableHeaderY); currentX += colWidths.time;
            doc.text('Symbol', currentX, tableHeaderY); currentX += colWidths.symbol;
            doc.text('Type', currentX, tableHeaderY); currentX += colWidths.type;
            doc.text('Quantity', currentX, tableHeaderY, { width: colWidths.qty, align: 'right' }); currentX += colWidths.qty;
            doc.text('Price', currentX, tableHeaderY, { width: colWidths.price, align: 'right' }); currentX += colWidths.price;
            doc.text('Total', currentX, tableHeaderY, { width: colWidths.total, align: 'right' });

            doc.moveTo(doc.page.margins.left, doc.y + 5)
               .lineTo(doc.page.width - doc.page.margins.right, doc.y + 5)
               .strokeColor('#cccccc').stroke();
            doc.font('Helvetica').moveDown(0.8);

            // --- Table Rows ---
            let yPos = doc.y;
            const rowHeight = 18;

            (transactions || []).forEach((tx) => { // Ensure transactions is an array
                if (!tx) return; // Skip if transaction data is invalid

                if (yPos > doc.page.height - doc.page.margins.bottom - rowHeight - 40) {
                    doc.addPage();
                    yPos = drawHeader(doc);

                    // Redraw table header
                    let headerX = doc.page.margins.left;
                    doc.fontSize(10).font('Helvetica-Bold');
                    doc.text('Time', headerX, yPos); headerX += colWidths.time;
                    doc.text('Symbol', headerX, yPos); headerX += colWidths.symbol;
                    // ... (redraw rest of table header columns) ...
                     doc.text('Type', headerX, yPos); headerX += colWidths.type;
                     doc.text('Quantity', headerX, yPos, { width: colWidths.qty, align: 'right' }); headerX += colWidths.qty;
                     doc.text('Price', headerX, yPos, { width: colWidths.price, align: 'right' }); headerX += colWidths.price;
                     doc.text('Total', headerX, yPos, { width: colWidths.total, align: 'right' });

                    doc.moveTo(doc.page.margins.left, doc.y + 5).lineTo(doc.page.width - doc.page.margins.right, doc.y + 5).strokeColor('#cccccc').stroke();
                    doc.font('Helvetica').moveDown(0.8);
                    yPos = doc.y;
                }

                const transactionTime = moment(tx.createdAt).tz(timezone).format('HH:mm:ss');
                const priceFormatted = formatCurrency(tx.price);
                const totalFormatted = formatCurrency(tx.total || (tx.price * tx.numberOfShares)); // Calculate total if missing

                let cellX = doc.page.margins.left;
                doc.fontSize(9).font('Helvetica');
                doc.text(transactionTime, cellX, yPos, { width: colWidths.time, lineBreak: false }); cellX += colWidths.time;
                doc.text(tx.companySymbol || 'N/A', cellX, yPos, { width: colWidths.symbol, ellipsis: true, lineBreak: false }); cellX += colWidths.symbol;
                doc.text(tx.type?.toUpperCase() || 'N/A', cellX, yPos, { width: colWidths.type, lineBreak: false }); cellX += colWidths.type;
                doc.text(tx.numberOfShares?.toString() || '0', cellX, yPos, { width: colWidths.qty, align: 'right', lineBreak: false }); cellX += colWidths.qty;
                doc.text(priceFormatted, cellX, yPos, { width: colWidths.price, align: 'right', lineBreak: false }); cellX += colWidths.price;
                doc.text(totalFormatted, cellX, yPos, { width: colWidths.total, align: 'right', lineBreak: false });

                yPos += rowHeight;
                doc.y = yPos;
            });
            // --- END Table Rows ---

            // --- Add Company Contact Info AFTER table ---
            let finalContentY = doc.y;
            const contactInfoHeightEst = 20;
            const pageContentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
            const companyEmail = companyDetails?.email || 'N/A';
            const companyPhone = companyDetails?.phone || 'N/A';

            if (finalContentY > doc.page.height - doc.page.margins.bottom - contactInfoHeightEst - 20) {
                doc.addPage();
                drawHeader(doc); // Redraw header on new page
                finalContentY = doc.y + 15; // Position after header
            } else {
                finalContentY += 20; // Padding below table
            }

            doc.fontSize(9).font('Helvetica-Oblique');
            doc.text(
                `Contact: ${companyEmail} | ${companyPhone}`,
                doc.page.margins.left, finalContentY,
                { align: 'center', width: pageContentWidth }
            );
            // --- END Contact Info ---

            // --- Add Page Numbers ---
            const range = doc.bufferedPageRange();
            for (let i = range.start; i < range.start + range.count; i++) {
                doc.switchToPage(i);
                 drawPageBottomElements(doc); // Draw footer elements if any
                const pageNumY = doc.page.height - doc.page.margins.bottom + 10;
                doc.fontSize(8).font('Helvetica').text(
                    `Page ${i + 1} of ${range.count}`,
                    doc.page.margins.left, pageNumY,
                    { align: 'right', width: pageContentWidth }
                );
            }

            // Finalize the PDF
            doc.end();

            // Resolve the Promise when the stream finishes
            stream.on('finish', () => {
                const blob = stream.toBlob('application/pdf');
                resolve(blob);
            });

            stream.on('error', (err) => {
                console.error("PDF generation stream error:", err);
                reject(err);
            });

        } catch (error) {
            console.error("Error generating PDF on frontend:", error);
            reject(error);
        }
    });
};

export default generateTransactionPDFFrontend;