import { TabsContent } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import React from "react";

const FileTablist = ({ activeLesson }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <TabsContent
      value="files"
      className="p-6 bg-white rounded-lg shadow-lg"
      role="tabpanel"
      aria-labelledby="files-tab"
    >
      <div className="space-y-6">
        {/* PDF FILES */}
        {activeLesson?.pdfFiles?.length > 0 ? (
          <section aria-labelledby="pdf-files-title">
            <h3
              id="pdf-files-title"
              className="text-lg font-semibold text-gray-700 mb-4"
            >
              PDF Files
            </h3>

            {activeLesson.pdfFiles.map((pdf, index) => {
              const label = pdf.filename || `PDF file ${index + 1}`;

              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-md p-4 mb-3 hover:bg-gray-50 transition-colors"
                >
                  <a
                    href={pdf.url || pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${label}`}
                    className="flex items-center gap-3 text-blue-600 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
                  >
                    <FileText
                      className="h-5 w-5 text-blue-500"
                      aria-hidden="true"
                      focusable="false"
                    />
                    {label}
                  </a>

                  {pdf.uploadedAt && (
                    <span className="text-xs text-gray-500 mt-2 sm:mt-0">
                      Uploaded: {formatDate(pdf.uploadedAt)}
                    </span>
                  )}
                </div>
              );
            })}
          </section>
        ) : (
          <p className="text-sm text-gray-500">No PDF files available for this lesson</p>
        )}

        {/* LESSON ASSESSMENT */}
        {activeLesson?.lessonAssessment?.length > 0 && (
          <section
            className="mt-6 pt-6 border-t border-gray-200"
            aria-labelledby="assessment-title"
          >
            <h3
              id="assessment-title"
              className="text-lg font-semibold text-gray-700 mb-4"
            >
              Lesson Assessment Materials
            </h3>

            {activeLesson.lessonAssessment.map((assessment, i) => (
              <div key={i} className="space-y-4">
                <h4
                  id={`assessment-heading-${i}`}
                  className="font-medium text-sm text-gray-800"
                >
                  {assessment.title}
                </h4>

                <p className="text-sm text-gray-600">{assessment.description}</p>

                {assessment.pdfFiles?.length > 0 && (
                  <div className="space-y-3 pl-4">
                    {assessment.pdfFiles.map((pdf, pdfIndex) => {
                      const label =
                        pdf.filename ||
                        `Assessment PDF file ${pdfIndex + 1}`;

                      return (
                        <div
                          key={pdfIndex}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-gray-300 rounded-md p-3 hover:bg-gray-50 transition-colors"
                        >
                          <a
                            href={pdf.url || pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${label}`}
                            className="flex items-center gap-3 text-blue-600 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
                          >
                            <FileText
                              className="h-4 w-4 text-blue-500"
                              aria-hidden="true"
                              focusable="false"
                            />
                            {label}
                          </a>

                          {pdf.uploadedAt && (
                            <span className="text-xs text-gray-500 mt-2 sm:mt-0">
                              Uploaded: {formatDate(pdf.uploadedAt)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </TabsContent>
  );
};

export default FileTablist;
