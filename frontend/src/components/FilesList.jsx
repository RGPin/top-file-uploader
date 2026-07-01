import { useEffect, useRef, useState } from "react";
import { useFilesStore } from "../store/useFilesStore";
import Delete from "./icons/Delete";
import { useParams } from "react-router";

export default function FilesList() {
  const {
    fetchUserFiles,
    userFiles,
    isFetchingFiles,
    uploadFile,
    isUploadingFiles,
    deleteFile,
    isDeletingFile,
  } = useFilesStore();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const { folderName } = useParams();

  function handleSubmit(e) {
    e.preventDefault();

    if (isUploadingFiles) return;

    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    fileInputRef.current.value = "";

    uploadFile(file, folderName);
  }

  function handleFileInput(e) {
    if (isUploadingFiles) return;

    const file = e.target.files?.[0];
    if (!file) return;
    formRef.current?.requestSubmit();
  }

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    fetchUserFiles(folderName, signal);
    return () => controller.abort();
  }, [fetchUserFiles, folderName]);

  if (isFetchingFiles) {
    return <div className="loading">Fetching files...</div>;
  }

  return (
    <div className="files-list">
      <div className="container">
        <div className="actions">
          <form ref={formRef} onSubmit={handleSubmit}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="upload-btn"
              disabled={isUploadingFiles}
            >
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
        {!userFiles?.length && <p>Folder is empty. Upload a file</p>}
        {userFiles?.map((file) => (
          <div className="file-container" key={file.id}>
            <a className="file-wrapper-link" target="_blank" href={file.url}>
              <div
                className={isDeletingFile ? "file-item deleting" : "file-item"}
              >
                <p className="file-type">{file.mime_type}</p>
                <p className="file-name">{file.original_name}</p>
                <p className="file-created-at">
                  {new Date(file.created_at).toLocaleDateString()}
                </p>
              </div>
            </a>
            <button
              className="delete-btn"
              onClick={() => deleteFile(file.id, file.storage_path)}
              disabled={isDeletingFile}
            >
              <Delete className="delete-icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
