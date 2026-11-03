import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageSquareText, Send } from "lucide-react";
import { toast } from "sonner";
// Assuming you have shadcn/ui dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const StudentMonthlyAttendance = () => {
  const { courseId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Note Modal States
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [noteText, setNoteText] = useState("");

  const fetchDetailed = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/attendance/my-attendance");
      if (res.data?.success) {
        const courseSpecific = res.data.attendance.filter(r => r.course?._id === courseId);
        setRecords(courseSpecific);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailed();
  }, [courseId]);

  const filteredByMonth = useMemo(() => {
    return records.filter(r => new Date(r.date).getMonth() === parseInt(selectedMonth));
  }, [records, selectedMonth]);

  const stats = useMemo(() => {
    const total = filteredByMonth.length;
    const present = filteredByMonth.filter(r => r.status === 'present').length;
    return { total, present, rate: total > 0 ? ((present / total) * 100).toFixed(1) : 0 };
  }, [filteredByMonth]);

  // Handle Note Submit
  const handleNoteSubmit = async () => {
    try {
      const res = await axiosInstance.put("/attendance/update-note", {
        attendanceId: currentRecord._id,
        note: noteText
      });
      if (res.data.success) {
        toast.success("Note sent to teacher");
        fetchDetailed(); // Refresh data
        setIsNoteModalOpen(false);
      }
    } catch (err) {
      toast.error("Failed to send note");
    }
  };

  const openNoteModal = (record) => {
    setCurrentRecord(record);
    setNoteText(record.note || "");
    setIsNoteModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Overview
      </Button>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold">{state?.courseTitle || "Course"} Details</h1>
          <p className="text-gray-500">View and provide notes for your attendance</p>
        </div>
        <select 
          className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm border-l-4 border-l-blue-500">
          <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Monthly Attendance Rate</p>
          <p className="text-3xl font-bold text-blue-600">{stats.rate}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Days Present</p>
          <p className="text-3xl font-bold text-green-600">{stats.present} / {stats.total}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Date</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">Your Note</th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredByMonth.map(r => (
              <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium">{new Date(r.date).toDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${r.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {r.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 italic max-w-xs truncate">
                  {r.note || <span className="text-gray-300">No note added</span>}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => openNoteModal(r)}
                  >
                    <MessageSquareText className="h-4 w-4" />
                    {r.note ? "Edit Note" : "Add Note"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note Modal */}
      <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Attendance Note</DialogTitle>
            <p className="text-sm text-gray-500">
              Reason for status on {currentRecord && new Date(currentRecord.date).toDateString()}
            </p>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Type your reason here (e.g., Medical leave, Technical issue)..." 
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsNoteModalOpen(false)}>Cancel</Button>
            <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={handleNoteSubmit}>
              <Send className="h-4 w-4" /> Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentMonthlyAttendance;