import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader2, ArrowLeft, X, Image, FileText, Plus } from "lucide-react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import BackButton from "@/CustomComponent/BackButton";

const CreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const type = searchParams.get("type");
  const typeId = searchParams.get("typeId");

  const [isCreating, setIsCreating] = useState(false);
  const [showImageDrive, setShowImageDrive] = useState(false);
  const [showPdfDrive, setShowPdfDrive] = useState(false);

  const [pageData, setPageData] = useState({
    title: "",
    description: "",
    localImage: null,
    localPdf: null,
    googleDriveImage: null,
    googleDrivePdf: null,
  });

  const handleCreatePage = async (e) => {
    e.preventDefault();
    
    if (!pageData.title.trim() || !pageData.description.trim()) {
      toast.error("Title and description are required!");
      return;
    }

    setIsCreating(true);

    const formData = new FormData();
    formData.append("title", pageData.title);
    formData.append("description", pageData.description);
    
    // Append local files if present
    if (pageData.localImage) formData.append("image", pageData.localImage);
    if (pageData.localPdf) formData.append("files", pageData.localPdf);
    
    // Append Google Drive files as JSON if present
    if (pageData.googleDriveImage) {
      formData.append("googleDriveImage", JSON.stringify(pageData.googleDriveImage));
    }
    if (pageData.googleDrivePdf) {
      formData.append("googleDrivePdf", JSON.stringify(pageData.googleDrivePdf));
    }

    try {
      const url = courseId && type && typeId
        ? `/pages/createpage/${courseId}/${type}/${typeId}`
        : `/pages/createpage`;
      
      await axiosInstance.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("Page created successfully!");
      setPageData({
        title: "",
        description: "",
        localImage: null,
        localPdf: null,
        googleDriveImage: null,
        googleDrivePdf: null,
      });
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create page");
    } finally {
      setIsCreating(false);
    }
  };

  const handleGoogleDriveImageUpload = (fileData) => {
    setPageData((prev) => ({ ...prev, googleDriveImage: fileData, localImage: null }));
    setShowImageDrive(false);
    toast.success("Image selected from Google Drive");
  };

  const handleGoogleDrivePdfUpload = (fileData) => {
    setPageData((prev) => ({ ...prev, googleDrivePdf: fileData, localPdf: null }));
    setShowPdfDrive(false);
    toast.success("PDF selected from Google Drive");
  };

  const removeImage = () => {
    setPageData((prev) => ({ ...prev, localImage: null, googleDriveImage: null }));
    setShowImageDrive(false);
  };

  const removePdf = () => {
    setPageData((prev) => ({ ...prev, localPdf: null, googleDrivePdf: null }));
    setShowPdfDrive(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-800">Create New Page</h1>
        </div>

        <form onSubmit={handleCreatePage} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
          {/* Title */}
          <div>
            <Label htmlFor="page-title">Title *</Label>
            <Input
              id="page-title"
              type="text"
              required
              value={pageData.title}
              onChange={(e) =>
                setPageData({ ...pageData, title: e.target.value })
              }
              placeholder="Enter page title"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="page-description">Description *</Label>
            <Textarea
              id="page-description"
              required
              rows={6}
              value={pageData.description}
              onChange={(e) =>
                setPageData({ ...pageData, description: e.target.value })
              }
              placeholder="Enter page description"
              className="mt-1"
            />
          </div>

          {/* Image Field */}
          <div className="border-t pt-6">
            <Label className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-blue-500" />
              Cover Image
            </Label>
            
            {/* Local Image Upload */}
            <div className="mb-4">
              <Label htmlFor="page-image" className="text-sm text-gray-600">
                Upload Image from Computer (optional)
              </Label>
              <Input
                id="page-image"
                type="file"
                accept="image/*"
                className="mt-1"
                disabled={pageData.googleDriveImage !== null}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPageData((prev) => ({ ...prev, localImage: file || null, googleDriveImage: null }));
                }}
              />
            </div>

            {/* Image Preview */}
            {(pageData.localImage || pageData.googleDriveImage) && (
              <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {pageData.localImage ? (
                      <>
                        <img
                          src={URL.createObjectURL(pageData.localImage)}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{pageData.localImage.name}</p>
                          <p className="text-xs text-gray-500">Local File</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={pageData.googleDriveImage?.url}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-sm">{pageData.googleDriveImage?.filename}</p>
                          <p className="text-xs text-blue-600">Google Drive</p>
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* PDF Field */}
          <div className="border-t pt-6">
            <Label className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-500" />
              PDF Attachment
            </Label>
            
            {/* Local PDF Upload */}
            <div className="mb-4">
              <Label htmlFor="page-pdf" className="text-sm text-gray-600">
                Upload PDF from Computer (optional)
              </Label>
              <Input
                id="page-pdf"
                type="file"
                accept="application/pdf"
                className="mt-1"
                disabled={pageData.googleDrivePdf !== null}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPageData((prev) => ({ ...prev, localPdf: file || null, googleDrivePdf: null }));
                }}
              />
            </div>

            {/* Google Drive PDF Toggle */}
            <div className="mb-4">
              <Button
                type="button"
                onClick={() => setShowPdfDrive(!showPdfDrive)}
                disabled={pageData.localPdf !== null}
                className={`flex items-center gap-2 ${showPdfDrive ? 'bg-red-600' : 'bg-white border-2 border-red-300 text-red-700'} hover:opacity-90`}
                variant={showPdfDrive ? "default" : "outline"}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {showPdfDrive ? "Hide Google Drive" : "Select PDF from Google Drive"}
              </Button>
            </div>

            {/* Google Drive PDF Upload */}
            {showPdfDrive && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
                <p className="text-sm text-red-700 mb-2">Only PDF files allowed from Google Drive</p>
                <GoogleDriveUpload
                  onUploadComplete={handleGoogleDrivePdfUpload}
                  allowedTypes={["application/pdf"]}
                  multiple={false}
                  buttonLabel="Select PDF from Google Drive"
                />
              </div>
            )}

            {/* PDF Preview */}
            {(pageData.localPdf || pageData.googleDrivePdf) && (
              <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-12 h-12 text-red-500" />
                    <div>
                      <p className="font-medium text-sm">
                        {pageData.localPdf?.name || pageData.googleDrivePdf?.filename}
                      </p>
                      <p className={`text-xs ${pageData.localPdf ? 'text-gray-500' : 'text-red-600'}`}>
                        {pageData.localPdf ? 'Local File' : 'Google Drive'}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={removePdf}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="pt-6 border-t flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isCreating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 text-white hover:bg-green-700"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Page"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
