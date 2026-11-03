import { useEffect, useState, useId } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, GraduationCap, BookOpen, AlertCircle } from "lucide-react";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Link } from "react-router-dom";
import BackButton from "@/CustomComponent/BackButton";

export default function GradingScales() {
  const [gpaScale, setGpaScale] = useState([]);
  const [sblScale, setSblScale] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState({
    gpa: false,
    sbl: false,
    grades: false,
  });
  const [errors, setErrors] = useState({
    gpa: null,
    sbl: null,
    grades: null,
  });

  const mainHeadingId = useId();
  const gpaHeadingId = useId();
  const sblHeadingId = useId();
  const gradesHeadingId = useId();

  useEffect(() => {
    const fetchGpaScale = async () => {
      setLoading((prev) => ({ ...prev, gpa: true }));
      setErrors((prev) => ({ ...prev, gpa: null }));
      try {
        const res = await axiosInstance.get("/gpa/get");
        setGpaScale(res.data?.grade || []);
      } catch (err) {
        console.error("Error fetching GPA scale:", err);
        setErrors((prev) => ({
          ...prev,
          gpa: "Failed to load GPA scale. Please try again.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, gpa: false }));
      }
    };
    fetchGpaScale();
  }, []);

  useEffect(() => {
    const fetchSBLScale = async () => {
      setLoading((prev) => ({ ...prev, sbl: true }));
      setErrors((prev) => ({ ...prev, sbl: null }));
      try {
        const res = await axiosInstance.get("/standardGrading/get");
        setSblScale(res.data?.scale || []);
      } catch (err) {
        console.error("Error fetching SBL scale:", err);
        setErrors((prev) => ({
          ...prev,
          sbl: "Failed to load SBL scale. Please try again.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, sbl: false }));
      }
    };
    fetchSBLScale();
  }, []);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading((prev) => ({ ...prev, grades: true }));
      setErrors((prev) => ({ ...prev, grades: null }));
      try {
        const res = await axiosInstance.get("/gradebook/getGradingScale");
        setGrades(res.data?.scale || []);
      } catch (err) {
        console.error("Error fetching grades:", err);
        setErrors((prev) => ({
          ...prev,
          grades: "Failed to load grade scale. Please try again.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, grades: false }));
      }
    };
    fetchGrades();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <h1 id={mainHeadingId} className="sr-only">
          Grading Scales Management
        </h1>

        <BackButton className="mb-10" aria-label="Go back to previous page" />

        {/* GPA Scale Section */}
        <GpaScaleSection
          headingId={gpaHeadingId}
          gpaScale={gpaScale}
          loading={loading.gpa}
          error={errors.gpa}
        />

        {/* Standard-Based Learning Scale Section */}
        <SblScaleSection
          headingId={sblHeadingId}
          sblScale={sblScale}
          loading={loading.sbl}
          error={errors.sbl}
        />

        {/* Grade Scale Section */}
        <GradeScaleSection
          headingId={gradesHeadingId}
          grades={grades}
          loading={loading.grades}
          error={errors.grades}
        />
      </div>
    </main>
  );
}

// ==================== GPA Scale Section ====================
function GpaScaleSection({ headingId, gpaScale, loading, error }) {
  const errorId = useId();

  return (
    <div className="mb-8">
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <GraduationCap
              className="w-5 h-5 text-green-600 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <CardTitle id={headingId} className="text-lg font-bold">
                GPA Scale
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Grade Point Average conversion scale
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <LoadingState message="Loading GPA scale..." />
          ) : error ? (
            <ErrorState
              id={errorId}
              message={error}
              icon={<AlertCircle className="w-5 h-5" />}
            />
          ) : gpaScale.length > 0 ? (
            <div className="overflow-x-auto">
              <div
                className="space-y-3"
                role="region"
                aria-labelledby={headingId}
              >
                {/* Header Row */}
                <div
                  className="grid grid-cols-3 gap-2 font-medium text-sm text-gray-600 px-2 py-2 bg-gray-50 rounded border-b-2 border-gray-200"
                  role="row"
                  aria-label="Table headers"
                >
                  <div role="columnheader">GPA Score</div>
                  <div role="columnheader">Percentage Range</div>
                  <div role="columnheader">Visual Progress</div>
                </div>

                {/* Data Rows */}
                {gpaScale.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 items-center px-2 py-3 border-b border-gray-100 hover:bg-gray-50 rounded transition-colors focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
                    role="row"
                  >
                    <div role="cell">
                      <Badge
                        className="font-bold text-sm px-3 py-1 bg-green-600 text-white"
                        aria-label={`GPA Score: ${item.gpa.toFixed(2)}`}
                      >
                        {item.gpa.toFixed(2)}
                      </Badge>
                    </div>
                    <div role="cell" className="text-sm text-gray-700">
                      {item.minPercentage}% – {item.maxPercentage}%
                    </div>
                    <div role="cell">
                      <ProgressBar
                        percentage={item.maxPercentage}
                        label={`${
                          item.maxPercentage
                        }% progress for GPA ${item.gpa.toFixed(2)}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState message="No GPA scale available. Please add a scale to get started." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== SBL Scale Section ====================
function SblScaleSection({ headingId, sblScale, loading, error }) {
  const errorId = useId();

  return (
    <div className="mb-8">
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <BookOpen
              className="w-5 h-5 text-green-600 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <CardTitle id={headingId} className="text-lg font-bold">
                Standard-Based Learning Scale
              </CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Point-based grading system with performance levels
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <LoadingState message="Loading SBL scale..." />
          ) : error ? (
            <ErrorState
              id={errorId}
              message={error}
              icon={<AlertCircle className="w-5 h-5" />}
            />
          ) : sblScale.length > 0 ? (
            <div className="overflow-x-auto">
              <div
                className="space-y-3"
                role="region"
                aria-labelledby={headingId}
              >
                {/* Header Row */}
                <div
                  className="grid grid-cols-4 gap-2 font-medium text-sm text-gray-600 px-2 py-2 bg-gray-50 rounded border-b-2 border-gray-200"
                  role="row"
                  aria-label="Table headers"
                >
                  <div role="columnheader">Points</div>
                  <div role="columnheader">Percentage Range</div>
                  <div role="columnheader">Performance Level</div>
                  <div role="columnheader">Visual Progress</div>
                </div>

                {/* Data Rows */}
                {sblScale.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-2 items-center px-2 py-3 border-b border-gray-100 hover:bg-gray-50 rounded transition-colors focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
                    role="row"
                  >
                    <div role="cell">
                      <Badge
                        className="font-bold text-sm px-3 py-1 bg-green-600 text-white"
                        aria-label={`Points: ${item.points}`}
                      >
                        {item.points}
                      </Badge>
                    </div>
                    <div role="cell" className="text-sm text-gray-700">
                      {item.minPercentage}% – {item.maxPercentage}%
                    </div>
                    <div role="cell">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {item.remarks}
                      </span>
                    </div>
                    <div role="cell">
                      <ProgressBar
                        percentage={item.maxPercentage}
                        label={`${item.maxPercentage}% progress for ${item.points} points`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState message="No Standard-Based Learning scale available. Please add a scale to get started." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== Grade Scale Section ====================
function GradeScaleSection({ headingId, grades, loading, error }) {
  const errorId = useId();

  return (
    <div className="mb-8">
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500">
        <CardHeader className="pb-3">
          <div>
            <CardTitle id={headingId} className="text-lg font-bold">
              Grade Scale
            </CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              Letter grade to percentage mapping
            </p>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <LoadingState message="Loading grade scale..." />
          ) : error ? (
            <ErrorState
              id={errorId}
              message={error}
              icon={<AlertCircle className="w-5 h-5" />}
            />
          ) : grades?.length > 0 ? (
            <div className="overflow-x-auto">
              <div
                className="space-y-3"
                role="region"
                aria-labelledby={headingId}
              >
                {/* Header Row */}
                <div
                  className="grid grid-cols-3 gap-2 font-medium text-sm text-gray-600 px-2 py-2 bg-gray-50 rounded border-b-2 border-gray-200"
                  role="row"
                  aria-label="Table headers"
                >
                  <div role="columnheader">Letter Grade</div>
                  <div role="columnheader">Percentage Range</div>
                  <div role="columnheader">Visual Progress</div>
                </div>

                {/* Data Rows */}
                {grades.map((grade, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 items-center px-2 py-3 border-b border-gray-100 hover:bg-gray-50 rounded transition-colors focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
                    role="row"
                  >
                    <div role="cell">
                      <Badge
                        className="font-bold text-sm px-3 py-1 bg-green-600 text-white"
                        aria-label={`Grade: ${grade.grade}`}
                      >
                        {grade.grade}
                      </Badge>
                    </div>
                    <div role="cell" className="text-sm text-gray-700">
                      {grade.min}% - {grade.max}%
                    </div>
                    <div role="cell">
                      <ProgressBar
                        percentage={grade.max - grade.min + 1}
                        label={`${grade.max - grade.min + 1}% range for grade ${
                          grade.grade
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState message="No grades added yet. Create grades to get started." />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ==================== Reusable Components ====================

function LoadingState({ message }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-40 text-gray-500"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Loader2 className="animate-spin w-6 h-6 mb-2" aria-hidden="true" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

function ErrorState({ id, message, icon }) {
  return (
    <div
      id={id}
      className="flex flex-col items-center justify-center h-40 text-red-600 bg-red-50 rounded-lg border border-red-200 p-4 gap-2"
      role="alert"
    >
      {icon}
      <p className="font-medium text-center text-sm">{message}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-500 bg-gray-50 rounded-lg border border-gray-200 p-4">
      <p className="text-center font-medium text-sm">{message}</p>
    </div>
  );
}

function ProgressBar({ percentage, label }) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden"
        role="progressbar"
        aria-valuenow={safePercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${safePercentage}%` }}
          aria-hidden="true"
        ></div>
      </div>
      <span className="text-xs font-medium text-gray-600 min-w-fit w-10 text-right">
        {safePercentage.toFixed(0)}%
      </span>
    </div>
  );
}
