"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Link as LinkIcon, Paperclip, Calendar, 
  User, ExternalLink, Loader2, ChevronDown, ChevronUp, 
  Image as ImageIcon, Megaphone
} from "lucide-react";
import BackButton from "@/CustomComponent/BackButton";

// --- Sub-Component for Long Messages ---
const ExpandableText = ({ text, limit = 200 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowButton = text.length > limit;

  return (
    <div className="text-gray-700 leading-relaxed text-md">
      <p>
        {isExpanded ? text : `${text.substring(0, limit)}${shouldShowButton ? "..." : ""}`}
      </p>
      {shouldShowButton && (
        <button
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="text-green-600 font-semibold mt-2 hover:underline text-sm"
        >
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

const ParentCourseAnnouncements = () => {
  // studentId comes from the Parent Portal URL structure: /parent/:studentId/announcements/:courseId
  const { studentId, courseId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!studentId || !courseId) return;
      try {
        setLoading(true);
        // We fetch by the studentId (the child) to see exactly what they see
        const res = await axiosInstance.get(`/Parent/get-child-announcements/${studentId}`);
        
        console.log(res);
        
        // Filter the child's announcement feed for this specific course
        const filtered = res.data.announcements.filter(ann => 
           (ann.course?._id === courseId || ann.course === courseId)
        );
        setAnnouncements(filtered);
      } catch (err) {
        console.error("Error fetching child announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [courseId, studentId]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const isImage = (url) => /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="animate-spin text-green-600" size={48} />
        <p className="text-gray-400 font-medium">Syncing class updates...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <BackButton className="mb-4"/>

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 text-green-600 mb-2">
             <Megaphone size={20} />
             <span className="text-sm font-bold uppercase tracking-wider">Teacher Updates</span>
           </div>
           <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
             {state?.courseTitle || "Class Announcements"}
           </h1>
          
        </div>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100 shadow-sm">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
             <ImageIcon className="text-gray-300" size={32} />
          </div>
          <p className="text-gray-500 font-medium">No updates have been posted for this course yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((ann) => {
            const isOpen = expandedId === ann._id;
            const images = ann.attachments?.filter(f => isImage(f.url)) || [];
            const files = ann.attachments?.filter(f => !isImage(f.url)) || [];

            return (
              <Card 
                key={ann._id} 
                className={`transition-all duration-300 border-none shadow-sm hover:shadow-md cursor-pointer overflow-hidden rounded-2xl ring-1 ${isOpen ? 'ring-green-500 shadow-green-50' : 'ring-gray-100'}`}
                onClick={() => toggleExpand(ann._id)}
              >
                <div className="p-5 md:p-6">
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1 pr-4">
                      <h3 className={`text-xl font-bold leading-tight transition-colors ${isOpen ? 'text-green-700' : 'text-gray-900'}`}>
                        {ann.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {new Date(ann.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded">
                          <User size={14} /> {ann.teacher?.firstName || "Instructor"} {ann.teacher?.lastName || ""}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {isOpen ? <ChevronUp size={20} className="text-green-500" /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {/* Body Content */}
                  <ExpandableText text={ann.message} />

                  {/* Dropdown Content */}
                  <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-[2000px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <hr className="border-gray-100 mb-6" />

                    {/* Image Gallery */}
                    {images.length > 0 && (
                      <div className="mb-6">
                         <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                           <ImageIcon size={16} className="text-green-500" /> Attached Photos
                         </h4>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {images.map((img, i) => (
                              <a key={i} href={img.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                                <img 
                                  src={img.url} 
                                  alt="attachment" 
                                  className="w-full h-32 object-cover rounded-xl hover:opacity-90 transition-opacity border border-gray-100" 
                                />
                              </a>
                            ))}
                         </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Links Section */}
                      {ann.links?.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <LinkIcon size={16} className="text-blue-500" /> Reference Links
                          </h4>
                          <div className="flex flex-col gap-2">
                            {ann.links.map((link, i) => (
                              <a 
                                key={i} href={link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm text-blue-600 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100"
                              >
                                <span className="truncate max-w-[200px]">{link}</span>
                                <ExternalLink size={14} />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Files Section */}
                      {files.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Paperclip size={16} className="text-orange-500" /> Documents
                          </h4>
                          <div className="flex flex-col gap-2">
                            {files.map((file, i) => (
                              <a 
                                key={i} href={file.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                                className="flex items-center p-3 bg-gray-50 rounded-xl text-sm text-gray-700 hover:bg-orange-50 transition-colors group border border-transparent hover:border-orange-100"
                              >
                                <Paperclip className="mr-2 h-4 w-4 text-gray-400 group-hover:text-orange-500" />
                                <span className="truncate flex-1">{file.filename || "Download Attachment"}</span>
                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ParentCourseAnnouncements;