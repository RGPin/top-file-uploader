import { useEffect, useRef, useState } from "react";
import { useFilesStore } from "../store/useFilesStore";

export default function FilesList() {
  const {
    fetchUserFiles,
    userFiles,
    isFetchingFiles,
    uploadFile,
    isUploadingFiles,
  } = useFilesStore();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    uploadFile(file);
  }

  function handleFileInput(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    formRef.current?.requestSubmit();
  }

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    fetchUserFiles(signal);
    return () => controller.abort();
  }, [fetchUserFiles]);

  if (isFetchingFiles) {
    return <div className="loading">Fetching files...</div>;
  }

  return (
    <div className="files-list">
      <div className="container">
        <div className="actions">
          <form ref={formRef} onSubmit={handleSubmit}>
            <button type="button" onClick={() => fileInputRef.current?.click()}>
              {isUploadingFiles ? "Uploading file..." : "Upload File"}
            </button>
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileInput}
            />
          </form>
        </div>
        <div className="label-container">
          <p className="label">File Type</p>
          <p className="label">Name</p>
          <p className="label">Created At</p>
        </div>
        {userFiles?.map((file) => (
          <a
            className="file-wrapper-link"
            key={file.id}
            target="_blank"
            href={file.url}
          >
            <div className="file-item">
              <p className="file-type">{file.mime_type}</p>
              <p className="file-name">{file.original_name}</p>
              <p className="file-created-at">
                {new Date(file.created_at).toLocaleDateString()}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
