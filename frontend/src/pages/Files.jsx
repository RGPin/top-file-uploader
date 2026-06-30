import FilesList from "../components/FilesList";
import FolderList from "../components/FolderList";

export default function Files() {
  return (
    <div className="files">
      <FolderList />
      <FilesList />
    </div>
  );
}
