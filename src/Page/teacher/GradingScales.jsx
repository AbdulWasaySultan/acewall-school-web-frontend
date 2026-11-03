import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, GraduationCap, BookOpen, Loader } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import BackButton from "@/CustomComponent/BackButton";

export default function GradingScales() {
  const [gpaScale, setGpaScale] = useState([]);
  const [sblScale, setSblScale] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGpaScale = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("gpa/get");
        setGpaScale(res.data.grade || []);
      } catch (err) {
        console.error("Error fetching GPA scale:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGpaScale();
  }, []);

  useEffect(() => {
    const fetchSBLScale = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("standardGrading/get");
        setSblScale(res.data.scale || []);
      } catch (err) {
        console.error("Error fetching SBL scale:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSBLScale();
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("gradebook/getGradingScale");
        setGrades(res.data.scale || []);
      } catch (err) {
        console.error("Error fetching grades:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <BackButton className="mb-10" />
      {/* Page heading */}
      <h1 className="text-3xl font-bold mb-6">Grading Scales</h1>

      {/* GPA Scale */}
      <Card className="mb-6">
        <CardHeader>
          <section className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-green-700" />
            <h2 className="text-xl font-bold">GPA Scale</h2>
          </section>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div role="status" aria-live="polite" className="flex flex-col items-center justify-center h-40 text-gray-500">
              <Loader2 className="animate-spin w-6 h-6 mb-2" />
              <p>Loading GPA scale...</p>
            </div>
          ) : gpaScale.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left px-2 py-1">GPA</th>
                  <th className="text-left px-2 py-1">Percentage Range</th>
                  <th className="text-left px-2 py-1">Bar</th>
                </tr>
              </thead>
              <tbody>
                {gpaScale.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="px-2 py-1">
                      <Badge
                        className="font-bold text-sm px-3 py-1 bg-green-600 text-white"
                        aria-label={`GPA ${item.gpa.toFixed(2)}`}
                      >
                        {item.gpa.toFixed(2)}
                      </Badge>
                    </td>
                    <td className="px-2 py-1">{item.minPercentage}% – {item.maxPercentage}%</td>
                    <td className="px-2 py-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-700 h-2.5 rounded-full"
                          style={{ width: `${item.maxPercentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <p>No GPA scale added yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SBL Scale */}
      <Card className="mb-6">
        <CardHeader>
          <section className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-700" />
            <h2 className="text-xl font-bold">Standard-Based Learning Scale</h2>
          </section>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div role="status" aria-live="polite" className="flex flex-col items-center justify-center h-40 text-gray-500">
              <Loader2 className="animate-spin w-6 h-6 mb-2" />
              <p>Loading SBL scale...</p>
            </div>
          ) : sblScale.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left px-2 py-1">Points</th>
                  <th className="text-left px-2 py-1">Percentage Range</th>
                  <th className="text-left px-2 py-1">Remarks</th>
                  <th className="text-left px-2 py-1">Bar</th>
                </tr>
              </thead>
              <tbody>
                {sblScale.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="px-2 py-1">
                      <Badge className="font-bold text-sm px-3 py-1 bg-green-600 text-white" aria-label={`Points ${item.points}`}>
                        {item.points}
                      </Badge>
                    </td>
                    <td className="px-2 py-1">{item.minPercentage}% – {item.maxPercentage}%</td>
                    <td className="px-2 py-1">{item.remarks}</td>
                    <td className="px-2 py-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-700 h-2.5 rounded-full"
                          style={{ width: `${item.maxPercentage}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <p>No Standard-Based Learning scale found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grade Scale */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Grade Scale</h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div role="status" aria-live="polite" className="flex flex-col items-center justify-center h-40 text-gray-500">
              <Loader className="animate-spin" />
            </div>
          ) : grades.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left px-2 py-1">Grade</th>
                  <th className="text-left px-2 py-1">Range</th>
                  <th className="text-left px-2 py-1">Percentage Bar</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="px-2 py-1">
                      <Badge className="font-bold text-sm px-3 py-1 bg-green-600 text-white" aria-label={`Grade ${grade.grade}`}>
                        {grade.grade}
                      </Badge>
                    </td>
                    <td className="px-2 py-1">{grade.min}% – {grade.max}%</td>
                    <td className="px-2 py-1">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-700 h-2.5 rounded-full"
                          style={{ width: `${grade.max - grade.min + 1}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <p>No grades added yet. Please create.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
