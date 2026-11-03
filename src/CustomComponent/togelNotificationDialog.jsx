import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ManageGuardianEmailNotifications({ studentId }) {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    submission: true,
    grading: true,
    announcement: true,
    assessments: true,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && studentId) {
      fetchPreferences();
    }
  }, [open, studentId]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `emailnotification/get/${studentId}`
      );

      if (data?.preferences) {
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      toast.error("Failed to load preferences. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { data } = await axiosInstance.put(
        `emailnotification/update/${studentId}`,
        { guardianEmailPreferences: preferences }
      );

      toast.success(
        data?.message || "Guardian email notifications updated successfully."
      );

      setOpen(false);
    } catch (error) {
      console.error("Error updating preferences:", error);

      const msg =
        error.response?.data?.message ||
        "Could not save preferences. Please try again.";

      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          aria-label="Manage guardian email notifications"
        >
          Manage Guardian Email Notifications
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        aria-labelledby="guardian-dialog-title"
      >
        <DialogHeader>
          <DialogTitle id="guardian-dialog-title">
            Guardian Email Notifications
          </DialogTitle>

          <DialogDescription id="guardian-dialog-description">
            Select which types of emails should be sent to the parent or
            guardian of this student.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div
            className="flex justify-center py-10"
            role="status"
            aria-live="polite"
          >
            <Loader2
              className="h-6 w-6 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
            <span className="sr-only">Loading preferences…</span>
          </div>
        ) : (
          <div className="space-y-4 py-3">
            {[
              {
                key: "submission",
                title: "Submission Alerts",
                desc: "Notify guardian when the student submits an assignment.",
              },
              {
                key: "grading",
                title: "Grading Updates",
                desc: "Notify guardian when new grades or feedback are released.",
              },
              {
                key: "announcement",
                title: "Announcements",
                desc: "Notify guardian about class-wide announcements or updates.",
              },
              {
                key: "assessments",
                title: "Assessment Reminders",
                desc: "Notify guardian about upcoming or missed assessments.",
              },
            ].map((item) => {
              const switchId = `switch-${item.key}`;
              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-lg border p-3"
                  role="group"
                  aria-labelledby={`${switchId}-label`}
                >
                  <div>
                    <Label
                      id={`${switchId}-label`}
                      htmlFor={switchId}
                      className="text-sm font-medium"
                    >
                      {item.title}
                    </Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>

                  <Switch
                    id={switchId}
                    aria-label={`${item.title} toggle`}
                    checked={preferences[item.key]}
                    onCheckedChange={() => handleToggle(item.key)}
                  />
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
            aria-busy={saving ? "true" : "false"}
            aria-live="polite"
          >
            {saving ? (
              <>
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                Saving…
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
