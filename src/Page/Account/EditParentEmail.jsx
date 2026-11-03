import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const MAX_EMAILS = 4;

const EditParentEmail = ({ studentId, initialEmails = [], onUpdate }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialEmails.length > 0) {
      setEmails(initialEmails);
    } else {
      setEmails([""]);
    }
  }, [initialEmails]);

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const handleAddEmail = () => {
    if (emails.length >= MAX_EMAILS) {
      toast.error("You can only add up to 4 guardian emails");
      return;
    }
    setEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index) => {
    const updated = emails.filter((_, i) => i !== index);
    setEmails(updated);
  };

  /* ---------------------------------------------
   Submit
  --------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmails = emails
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    try {
      setLoading(true);

      const res = await axiosInstance.put(
        `/auth/updateParentEmail/${studentId}`,
        { guardianEmails: trimmedEmails }
      );

      toast.success(res?.data?.message || "Guardian emails updated successfully");

      if (onUpdate) onUpdate(trimmedEmails);
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error(
        err?.response?.data?.message || "Failed to update guardian emails"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------
   Render
  --------------------------------------------- */
  return (
    <div className="mt-6 max-w-lg mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold">Parent / Guardian Emails</h2>

      <p className="text-sm text-gray-500 mb-4">
        Add up to {MAX_EMAILS} guardian email addresses. Each new email receives
        a password-less login link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {emails.length === 0 ? (
          <p className="text-sm text-gray-500 my-4 text-center">
            No parent/guardian emails added.
          </p>
        ) : (
          emails.map((email, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-full">
                <label
                  htmlFor={`guardian-email-${index}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Guardian Email {index + 1}
                </label>

                <input
                  id={`guardian-email-${index}`}
                  type="email"
                  value={email}
                  placeholder="parent@email.com"
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="mt-6"
                onClick={() => handleRemoveEmail(index)}
                aria-label="Remove email"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}

        <Button
          type="button"
          variant="outline"
          onClick={handleAddEmail}
          disabled={emails.length >= MAX_EMAILS}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add another email
        </Button>

        {emails.length >= MAX_EMAILS && (
          <p className="text-xs text-red-500">
            Maximum {MAX_EMAILS} guardian emails allowed.
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
};

export default EditParentEmail;
