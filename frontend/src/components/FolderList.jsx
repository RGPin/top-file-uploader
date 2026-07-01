import { useEffect } from "react";
import { useFilesStore } from "../store/useFilesStore";
import { Link } from "react-router";

export default function FolderList() {
  const { userFolders, isFetchingFolders, fetchUserFolders } = useFilesStore();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    fetchUserFolders(signal);
    return () => controller.abort();
  }, []);

  if (isFetchingFolders) {
    return <div className="loading">Fetching folders...</div>;
  }

  return (
    <div className="folder-list">
      <div className="actions">
        <button className="add-folder-btn">Add Folder</button>
      </div>
      <ul className="list">
        {userFolders?.map((folder) => (
          <Link key={folder}>
            <li className="folder">{folder}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
