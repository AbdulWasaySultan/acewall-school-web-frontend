import { useState, useMemo } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Link as LinkIcon, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import AnnouncementCard from "./AnnouncementCard";

export default function AnnouncementList({ title, announcements = [], onDelete }) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const isImageFile = (filename) =>
    /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(filename);

  const handleRowClick = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  // Filtered announcements based on search term
  const filteredAnnouncements = useMemo(() => {
    if (!searchTerm) return announcements;
    const lowerTerm = searchTerm.toLowerCase();
    return announcements.filter(
      (a) =>
        a.title.toLowerCase().includes(lowerTerm) ||
        a.message.toLowerCase().includes(lowerTerm)
    );
  }, [announcements, searchTerm]);

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="border-b">
          <CollapsibleTrigger
            className="flex items-center w-full p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors"
            aria-expanded={isOpen}
            aria-controls="announcements-content"
          >
            <ChevronDown
              className={`h-5 w-5 mr-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
            <h2 className="text-md font-semibold">
              {title} ({filteredAnnouncements.length})
            </h2>
            <span className="sr-only">
              {isOpen ? "Collapse" : "Expand"} announcements section
            </span>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent id="announcements-content">
          <div className="p-3">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-3 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search announcements"
            />

            <div className="overflow-x-auto">
              {filteredAnnouncements.length === 0 ? (
                <div className="p-8 text-center text-gray-500" role="status">
                  <p>No announcements found.</p>
                </div>
              ) : (
                <table className="w-full min-w-[900px] border-collapse" role="table">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3 text-left font-medium text-gray-700 w-1/6">Date</th>
                      <th className="p-3 text-left font-medium text-gray-700 w-1/4">Title</th>
                      <th className="p-3 text-left font-medium text-gray-700 w-1/4">Message</th>
                      <th className="p-3 text-left font-medium text-gray-700 w-1/6">Course</th>
                      <th className="p-3 text-left font-medium text-gray-700 w-1/6">Links</th>
                      <th className="p-3 text-left font-medium text-gray-700 w-1/6">Attachments</th>
                      <th className="p-3 w-24">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {[...filteredAnnouncements].reverse().map((announcement) => {
                      const links = Array.isArray(announcement.links) ? announcement.links : [];
                      const attachments = Array.isArray(announcement.attachments)
                        ? announcement.attachments
                        : [];

                      return (
                        <tr
                          key={announcement._id}
                          className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleRowClick(announcement)}
                        >
                          <td className="p-3 text-gray-700 whitespace-nowrap">{announcement.date}</td>
                          <td className="p-3 text-indigo-600 truncate max-w-[150px]">{announcement.title}</td>
                          <td className="p-3 truncate max-w-[250px]">{announcement.message}</td>
                          <td className="p-3 text-gray-700">{announcement.courseTitle || "-"}</td>
                          <td className="p-3 text-blue-600 space-y-1">
                            {links.length > 0 ? (
                              links.map((link, i) => (
                                <a
                                  key={i}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 hover:underline truncate max-w-[140px]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <LinkIcon className="h-4 w-4" />
                                  <span>{link}</span>
                                </a>
                              ))
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="p-3 text-gray-700 space-y-1">
                            {attachments.length > 0 ? (
                              attachments.map((file, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {isImageFile(file.filename) ? (
                                    <img
                                      src={file.url}
                                      alt={file.filename}
                                      className="h-16 w-16 object-cover rounded-md"
                                    />
                                  ) : (
                                    <Paperclip className="h-4 w-4" />
                                  )}
                                  <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline truncate max-w-[150px]"
                                  >
                                    {file.filename}
                                  </a>
                                </div>
                              ))
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete?.(announcement._id);
                                }}
                                aria-label={`Delete announcement: ${announcement.title}`}
                              >
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Announcement Dialog */}
      {selectedAnnouncement && (
        <AnnouncementCard
          announcement={selectedAnnouncement}
          onDelete={onDelete}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}
    </div>
  );
}
