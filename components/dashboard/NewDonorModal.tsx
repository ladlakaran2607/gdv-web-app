"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DonationRow {
  date: string;
  amount: string;
  campaign: string;
}

interface CauseEvent {
  name: string;
  invited: boolean;
  dateInvited: string;
  attended: boolean;
  dateAttended: string;
  donated: boolean;
  dateDonated: string;
  donationAmount: string;
}

interface NewDonorModalProps {
  onClose: () => void;
  onSubmit: (result: { recordId: string; donorName: string }) => void;
}

const FREQUENCY_OPTIONS = ["Weekly", "Monthly", "Quarterly", "Bi-annually", "Yearly", "One-off"];

const inputStyle = {
  border: "1.5px solid var(--color-grey-200)",
  color: "var(--color-navy)",
  background: "#fff",
  borderRadius: "var(--radius-sm)",
  outline: "none",
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  transition: "border-color 0.15s",
};

const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--color-navy)",
  marginBottom: 6,
};

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: "var(--color-coral)", marginLeft: 2 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
      />
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative flex-shrink-0"
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? "var(--color-gold)" : "var(--color-grey-200)",
        transition: "background 0.2s",
        border: "none",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

// Step indicator
function StepIndicator({ step }: { step: number }) {
  const steps = [
    { n: 1, label: "Basic Info" },
    { n: 2, label: "Donation History" },
    { n: 3, label: "Connection to Cause" },
  ];

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center" style={{ flex: i < steps.length - 1 ? 1 : "none" }}>
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: step >= s.n ? "var(--color-navy)" : "var(--color-grey-100)",
                color: step >= s.n ? "#fff" : "var(--color-grey-400)",
                transition: "all 0.2s",
              }}
            >
              {step > s.n ? "✓" : s.n}
            </div>
            <span
              className="text-[11px] font-medium whitespace-nowrap"
              style={{ color: step >= s.n ? "var(--color-navy)" : "var(--color-grey-400)" }}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                height: 2,
                flex: 1,
                background: step > s.n ? "var(--color-navy)" : "var(--color-grey-200)",
                margin: "0 8px",
                marginBottom: 20,
                transition: "background 0.2s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function NewDonorModal({ onClose, onSubmit }: NewDonorModalProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [donorName, setDonorName] = useState("");
  const [company, setCompany] = useState("");
  const [linkedIn, setLinkedIn] = useState("");

  // Step 2
  const [donationRows, setDonationRows] = useState<DonationRow[]>([{ date: "", amount: "", campaign: "" }]);
  const [donationFrequency, setDonationFrequency] = useState("");

  // Step 3
  const [causeEvents, setCauseEvents] = useState<CauseEvent[]>([
    { name: "", invited: false, dateInvited: "", attended: false, dateAttended: "", donated: false, dateDonated: "", donationAmount: "" },
  ]);

  const addDonationRow = () => {
    if (donationRows.length < 5) {
      setDonationRows([...donationRows, { date: "", amount: "", campaign: "" }]);
    }
  };

  const removeDonationRow = (i: number) => {
    setDonationRows(donationRows.filter((_, idx) => idx !== i));
  };

  const updateDonationRow = (i: number, field: keyof DonationRow, value: string) => {
    setDonationRows(donationRows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  };

  const addCauseEvent = () => {
    setCauseEvents([
      ...causeEvents,
      { name: "", invited: false, dateInvited: "", attended: false, dateAttended: "", donated: false, dateDonated: "", donationAmount: "" },
    ]);
  };

  const updateCauseEvent = useCallback(<K extends keyof CauseEvent>(i: number, field: K, value: CauseEvent[K]) => {
    setCauseEvents((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  }, []);

  const removeCauseEvent = (i: number) => {
    setCauseEvents(causeEvents.filter((_, idx) => idx !== i));
  };

  const handleNext = () => {
    if (step === 1 && !donorName.trim()) {
      setError("Donor name is required");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorName, company, linkedIn, donationHistory: donationRows, donationFrequency, connectionToCause: causeEvents }),
      });
      if (!res.ok) throw new Error("Failed to create donor");
      const data = await res.json();
      onSubmit({ recordId: data.recordId, donorName: data.donorName });
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,22,40,0.65)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="w-full bg-white relative"
        style={{
          maxWidth: 640,
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 pt-7 pb-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--color-grey-100)" }}
        >
          <div>
            <h2 className="text-xl font-semibold" style={{ color: "var(--color-navy)", fontFamily: "var(--font-display)" }}>
              Add New Donor
            </h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-grey-400)" }}>
              Research will begin automatically after submission
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ color: "var(--color-grey-400)", fontSize: 18 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 overflow-y-auto flex-1">
          <StepIndicator step={step} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-4"
              >
                <InputField label="Donor Name" value={donorName} onChange={setDonorName} placeholder="e.g. Jane Smith" required />
                <InputField label="Company / Employer" value={company} onChange={setCompany} placeholder="e.g. Acme Corp" />
                <InputField label="LinkedIn Profile URL" value={linkedIn} onChange={setLinkedIn} placeholder="https://linkedin.com/in/..." type="url" />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
              >
                <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-navy)" }}>
                  Last Donations <span style={{ color: "var(--color-grey-400)", fontWeight: 400 }}>(up to 5)</span>
                </p>
                <div className="flex flex-col gap-3 mb-4">
                  {donationRows.map((row, i) => (
                    <div key={i} className="flex gap-2 items-start p-3 rounded-xl" style={{ background: "var(--color-grey-50)" }}>
                      <div className="flex gap-2 flex-1">
                        <input
                          type="date"
                          value={row.date}
                          onChange={(e) => updateDonationRow(i, "date", e.target.value)}
                          style={{ ...inputStyle, flex: "0 0 150px" }}
                          onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                          onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
                        />
                        <input
                          type="number"
                          value={row.amount}
                          onChange={(e) => updateDonationRow(i, "amount", e.target.value)}
                          placeholder="Amount ($)"
                          style={{ ...inputStyle, flex: "0 0 120px" }}
                          onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                          onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
                        />
                        <input
                          type="text"
                          value={row.campaign}
                          onChange={(e) => updateDonationRow(i, "campaign", e.target.value)}
                          placeholder="Campaign / Purpose"
                          style={{ ...inputStyle, flex: 1 }}
                          onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                          onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
                        />
                      </div>
                      {donationRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDonationRow(i)}
                          className="flex-shrink-0 mt-1"
                          style={{ color: "var(--color-grey-400)", fontSize: 18, lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {donationRows.length < 5 && (
                  <button
                    type="button"
                    onClick={addDonationRow}
                    className="text-sm font-semibold mb-5"
                    style={{ color: "var(--color-gold)", background: "none", border: "none", cursor: "pointer" }}
                  >
                    + Add donation
                  </button>
                )}

                <div>
                  <label style={labelStyle}>
                    Donation Frequency <span style={{ color: "var(--color-coral)" }}>*</span>
                  </label>
                  <select
                    value={donationFrequency}
                    onChange={(e) => setDonationFrequency(e.target.value)}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
                  >
                    <option value="">Select...</option>
                    {FREQUENCY_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
              >
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{ background: "var(--color-grey-50)", border: "1px solid var(--color-grey-100)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--color-grey-400)" }}>
                    Event Engagement
                  </p>

                  {causeEvents.map((ev, i) => (
                    <div key={i} className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold" style={{ color: "var(--color-gold)" }}>
                          Event {i + 1}
                        </p>
                        {causeEvents.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCauseEvent(i)}
                            className="text-xs"
                            style={{ color: "var(--color-grey-400)", background: "none", border: "none", cursor: "pointer" }}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="mb-3">
                        <label style={labelStyle}>Event Name</label>
                        <input
                          type="text"
                          value={ev.name}
                          onChange={(e) => updateCauseEvent(i, "name", e.target.value)}
                          placeholder="e.g. Fundraising Dinner 2025"
                          style={{ ...inputStyle, background: "#fff" }}
                          onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                          onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
                        />
                      </div>

                      {/* Invited */}
                      <div className="flex items-center gap-3 mb-2">
                        <Toggle checked={ev.invited} onChange={(v) => updateCauseEvent(i, "invited", v)} />
                        <span className="text-sm font-medium" style={{ color: "var(--color-navy)" }}>Invited</span>
                      </div>
                      {ev.invited && (
                        <div className="ml-14 mb-2">
                          <label style={{ ...labelStyle, fontSize: 12 }}>Date Invited</label>
                          <input
                            type="date"
                            value={ev.dateInvited}
                            onChange={(e) => updateCauseEvent(i, "dateInvited", e.target.value)}
                            style={{ ...inputStyle, background: "#fff" }}
                            onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                            onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
                          />
                        </div>
                      )}

                      {/* Attended */}
                      <div className="flex items-center gap-3 mb-2">
                        <Toggle checked={ev.attended} onChange={(v) => updateCauseEvent(i, "attended", v)} />
                        <span className="text-sm font-medium" style={{ color: "var(--color-navy)" }}>Attended</span>
                      </div>
                      {ev.attended && (
                        <div className="ml-14 mb-2">
                          <label style={{ ...labelStyle, fontSize: 12 }}>Date Attended</label>
                          <input
                            type="date"
                            value={ev.dateAttended}
                            onChange={(e) => updateCauseEvent(i, "dateAttended", e.target.value)}
                            style={{ ...inputStyle, background: "#fff" }}
                            onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                            onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
                          />
                        </div>
                      )}

                      {/* Donated */}
                      <div className="flex items-center gap-3 mb-2">
                        <Toggle checked={ev.donated} onChange={(v) => updateCauseEvent(i, "donated", v)} />
                        <span className="text-sm font-medium" style={{ color: "var(--color-navy)" }}>Donated</span>
                      </div>
                      {ev.donated && (
                        <div className="ml-14 mb-2 flex gap-3">
                          <div className="flex-1">
                            <label style={{ ...labelStyle, fontSize: 12 }}>Date Donated</label>
                            <input
                              type="date"
                              value={ev.dateDonated}
                              onChange={(e) => updateCauseEvent(i, "dateDonated", e.target.value)}
                              style={{ ...inputStyle, background: "#fff" }}
                              onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                              onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
                            />
                          </div>
                          <div className="flex-1">
                            <label style={{ ...labelStyle, fontSize: 12 }}>Amount</label>
                            <input
                              type="number"
                              value={ev.donationAmount}
                              onChange={(e) => updateCauseEvent(i, "donationAmount", e.target.value)}
                              placeholder="$0.00"
                              style={{ ...inputStyle, background: "#fff" }}
                              onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
                              onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
                            />
                          </div>
                        </div>
                      )}

                      {i < causeEvents.length - 1 && (
                        <div style={{ height: 1, background: "var(--color-grey-200)", margin: "16px 0" }} />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addCauseEvent}
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-gold)", background: "none", border: "none", cursor: "pointer" }}
                >
                  + Add another event
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="text-sm mt-4" style={{ color: "var(--color-coral)" }}>
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-7 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid var(--color-grey-100)" }}
        >
          <button
            type="button"
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ color: "var(--color-grey-600)", background: "var(--color-grey-50)", border: "none", cursor: "pointer" }}
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-mid) 100%)",
                border: "none",
                cursor: "pointer",
                boxShadow: "var(--shadow-md)",
              }}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: submitting ? "var(--color-grey-200)" : "linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-light) 100%)",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: submitting ? "none" : "var(--shadow-md)",
              }}
            >
              {submitting ? "Submitting…" : "Submit & Start Research"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
