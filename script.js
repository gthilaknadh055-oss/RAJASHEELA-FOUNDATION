// RAJASHEELA FOUNDATION (Reg No 552/26) - Interactive Scripts (script.js)

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyxby15IsLw-OKbHcDmwQv4QsOB7y7b9T3THirGxjBayiyfKd_jZW5D_fHkxYbJ2n3O/exec';

// Helper: Convert File object to Base64 string (without data:... prefix)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function downloadApplicationPDF(refId, formData) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("RAJASHEELA FOUNDATION", 105, y, { align: "center" });
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Reg No: 552/26 | Registration Application Receipt", 105, y, { align: "center" });
  y += 10;
  doc.line(15, y, 195, y);
  y += 10;

  // Application ID & Date
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Application ID: ${refId}`, 15, y);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 195, y, { align: "right" });
  y += 12;

  // Submitted Fields
  const fields = [
    ["Full Name", formData.get("fullName")],
    ["Father's Name", formData.get("fatherName")],
    ["Phone Number", formData.get("phone")],
    ["Email", formData.get("email")],
    ["Age", formData.get("age")],
    ["Occupation", formData.get("occupation")],
    ["Social Service Activities", formData.get("service")],
    ["Previous Achievements", formData.get("achievements") || "N/A"],
    ["Full Address", formData.get("address")],
    ["Registration Fee", "Rs. 2,999 (One-time)"]
  ];

  fields.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`${label}:`, 15, y);

    doc.setFont("helvetica", "normal");
    const wrappedText = doc.splitTextToSize(String(value || "-"), 125);
    doc.text(wrappedText, 68, y);
    y += wrappedText.length * 6 + 3;

    if (y > 255) {
      doc.addPage();
      y = 20;
    }
  });

  // Payment & Contact Footer Box
  y += 6;
  doc.line(15, y, 195, y);
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Contact for Complete Your Payment of Rs. 2999", 15, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Phone: 9959711525, 9010661852", 15, y);
  y += 6;
  doc.text("Gmail: rajasheelafoundation@gmail.com", 15, y);

  // Download file named with their Application ID
  doc.save(`${refId}_Rajasheela_Application.pdf`);
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. One-Time Scroll Reveal Animation (.reveal -> .visible, permanently stays sharp)
  const revealElements = document.querySelectorAll('.reveal');
  let revealedOnce = false;

  const unlockAllSections = () => {
    if (revealedOnce) return;
    revealedOnce = true;
    revealElements.forEach((el) => {
      el.classList.add('visible');
      el.style.filter = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  };

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
            // Clear filter property after transition completes so scrolling never re-blurs
            setTimeout(() => {
              entry.target.style.filter = 'none';
            }, 700);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -10px 0px',
        threshold: 0.01
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
    // Permanently unlock all sections after initial reveal window so scroll never triggers blur again
    setTimeout(unlockAllSections, 1400);
  } else {
    unlockAllSections();
  }

  // 3. NPCI-Safe UPI Intent Deep-Linking
  const UPI_ID = 'gthilaknadh077-7@okicici';
  const PAYEE_NAME = 'RAJASHEELA FOUNDATION';
  const isAndroid = /Android/i.test(navigator.userAgent);

  const baseParams = `pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR`;
  const standardUpiUrl = `upi://pay?${baseParams}`;

  const upiHelper = document.getElementById('upiHelper');
  document.querySelectorAll('.upi-pay-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const app = btn.getAttribute('data-app');
      let targetUrl = standardUpiUrl;

      if (isAndroid && app === 'phonepe') {
        targetUrl = `intent://pay?${baseParams}#Intent;scheme=upi;package=com.phonepe.app;end`;
      } else if (isAndroid && app === 'gpay') {
        targetUrl = `intent://pay?${baseParams}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
      }

      if (upiHelper) {
        upiHelper.innerHTML = `Opening UPI app... Please enter <strong>₹2,999</strong> to <strong>${UPI_ID}</strong>, then enter your 12-digit UTR below.`;
      }

      window.location.href = targetUrl;
    });
  });

  // Copy UPI ID button
  const copyUpiBtn = document.getElementById('copyUpiBtn');
  if (copyUpiBtn) {
    copyUpiBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(UPI_ID);
        copyUpiBtn.textContent = 'Copied!';
        setTimeout(() => { copyUpiBtn.textContent = 'Copy UPI ID'; }, 2000);
      } catch (err) {
        if (upiHelper) {
          upiHelper.innerHTML = `UPI ID: <strong>${UPI_ID}</strong> (long-press to copy)`;
        }
      }
    });
  }

  // 4. Candidate Registration Form -> Google Sheets + Drive PDF Upload
  const candidateForm = document.getElementById('candidateForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');

  if (candidateForm) {
    candidateForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const file1 = candidateForm.querySelector('input[name="attachment1"]')?.files[0];
      const file2 = candidateForm.querySelector('input[name="attachment2"]')?.files[0];
      const file3 = candidateForm.querySelector('input[name="attachment3"]')?.files[0];

      if ((file1 && file1.size > 4.5 * 1024 * 1024) || (file2 && file2.size > 4.5 * 1024 * 1024) || (file3 && file3.size > 4.5 * 1024 * 1024)) {
        if (formMessage) {
          formMessage.innerHTML = '<strong>File Too Large:</strong> Each PDF must be under 4 MB.';
          formMessage.style.color = '#b91c1c';
        }
        return;
      }

      const data = new FormData(candidateForm);
      const refId = 'RF2027-' + Math.floor(100000 + Math.random() * 900000);
      const phoneVal = String(data.get('phone') || '');

      const submissionOverlay = document.getElementById('submissionOverlay');
      if (submissionOverlay) {
        submissionOverlay.classList.add('active');
        submissionOverlay.setAttribute('aria-hidden', 'false');
      }
      document.body.style.overflow = 'hidden';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Uploading & Submitting...';
      }
      if (formMessage) {
        formMessage.textContent = 'Uploading your details & PDFs to Google Sheets, please wait...';
        formMessage.style.color = '#0B1F3A';
      }

      try {
        const [pdf1Data, pdf2Data, pdf3Data] = await Promise.all([
          fileToBase64(file1),
          fileToBase64(file2),
          fileToBase64(file3)
        ]);

        const payload = new URLSearchParams();
        payload.append('action', 'register');
        payload.append('applicationId', refId);
        payload.append('fullName', data.get('fullName') || '');
        payload.append('fatherName', data.get('fatherName') || '');
        payload.append('phone', phoneVal);
        payload.append('email', data.get('email') || '');
        payload.append('age', data.get('age') || '');
        payload.append('occupation', data.get('occupation') || '');
        payload.append('service', data.get('service') || '');
        payload.append('achievements', data.get('achievements') || '');
        payload.append('address', data.get('address') || '');
        payload.append('pdf1Name', file1 ? file1.name : '');
        payload.append('pdf1Data', pdf1Data);
        payload.append('pdf2Name', file2 ? file2.name : '');
        payload.append('pdf2Data', pdf2Data);
        payload.append('pdf3Name', file3 ? file3.name : '');
        payload.append('pdf3Data', pdf3Data);

        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: payload.toString()
        });

        // Pre-fill Application ID & Phone in the Payment Confirmation form
        const confirmAppId = document.getElementById('confirmAppId');
        const confirmPhone = document.getElementById('confirmPhone');
        if (confirmAppId) confirmAppId.value = refId;
        if (confirmPhone) confirmPhone.value = phoneVal;

        if (formMessage) {
          formMessage.innerHTML = `<strong>Submitted Successfully!</strong> Your Application ID is <strong>${refId}</strong><br><br>Contact for Complete Your Payment of ₹2999<br><br>Phone. 9959711525,9010661852<br>Gmail . rajasheelafoundation@gmail.com`;
          formMessage.style.color = '#15803d';
        }

        // Download PDF with all submitted registration details
        downloadApplicationPDF(refId, data);

        candidateForm.reset();
        document.getElementById('payment')?.scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        if (formMessage) {
          formMessage.innerHTML = '<strong>Submission Error:</strong> Please check your internet connection and try again.';
          formMessage.style.color = '#b91c1c';
        }
      } finally {
        const submissionOverlay = document.getElementById('submissionOverlay');
        if (submissionOverlay) {
          submissionOverlay.classList.remove('active');
          submissionOverlay.setAttribute('aria-hidden', 'true');
        }
        document.body.style.overflow = '';

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Submit Application <span>→</span>';
        }
      }
    });
  }

  // 5. Payment Confirmation Form -> Updates Candidate Row with UTR & Screenshot Link
  const paymentConfirmForm = document.getElementById('paymentConfirmForm');
  const confirmMessage = document.getElementById('confirmMessage');
  const confirmBtn = document.getElementById('confirmBtn');

  if (paymentConfirmForm) {
    paymentConfirmForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const screenshotFile = paymentConfirmForm.querySelector('input[name="paymentScreenshot"]')?.files[0];
      if (screenshotFile && screenshotFile.size > 4.5 * 1024 * 1024) {
        if (confirmMessage) {
          confirmMessage.innerHTML = '<strong>File Too Large:</strong> Payment screenshot must be under 4 MB.';
          confirmMessage.style.color = '#b91c1c';
        }
        return;
      }

      const data = new FormData(paymentConfirmForm);
      const appId = String(data.get('applicationId') || '').trim().toUpperCase();
      const phone = String(data.get('phone') || '').trim();
      const utrNumber = String(data.get('utrNumber') || '').trim();

      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = 'Confirming Payment...';
      }
      if (confirmMessage) {
        confirmMessage.textContent = 'Recording your UTR & payment screenshot in Google Sheets...';
        confirmMessage.style.color = '#0B1F3A';
      }

      try {
        const screenshotData = await fileToBase64(screenshotFile);

        const payload = new URLSearchParams();
        payload.append('action', 'confirmPayment');
        payload.append('applicationId', appId);
        payload.append('phone', phone);
        payload.append('utrNumber', utrNumber);
        payload.append('screenshotName', screenshotFile ? screenshotFile.name : '');
        payload.append('screenshotType', screenshotFile ? screenshotFile.type : 'image/png');
        payload.append('screenshotData', screenshotData);

        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: payload.toString()
        });

        if (confirmMessage) {
          confirmMessage.innerHTML = `<strong>Payment Confirmation Submitted!</strong> UTR <strong>${utrNumber}</strong> has been recorded for Application ID <strong>${appId}</strong>.`;
          confirmMessage.style.color = '#15803d';
        }
        paymentConfirmForm.reset();
      } catch (err) {
        if (confirmMessage) {
          confirmMessage.innerHTML = '<strong>Error:</strong> Unable to submit payment confirmation. Please try again.';
          confirmMessage.style.color = '#b91c1c';
        }
      } finally {
        if (confirmBtn) {
          confirmBtn.disabled = false;
          confirmBtn.innerHTML = 'Confirm ₹2,999 Payment <span>✓</span>';
        }
      }
    });
  }
});
