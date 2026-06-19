import { useEffect } from "react";
import { useFilesStore } from "../store/useFilesStore";

export default function FilesList() {
  const { fetchUserFiles, userFiles, isFetchingFiles } = useFilesStore();

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
          <button>Upload File</button>
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
