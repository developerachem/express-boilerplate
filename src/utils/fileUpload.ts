import multer from "multer";
import { join } from "path";

interface FileProps {
  fileName: string;
}
const useFileUpload = (fileName: string) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // * Use join to safely create an absolute path to the 'public' directory
      cb(null, join(__dirname, "../../public"));
    },
    filename: function (req, file, cb) {
      // * Create a unique filename using a timestamp and the original file name
      cb(null, Date.now() + fileName + "-image.jpg");
    },
  });

  const upload = multer({ storage: storage });

  return { upload };
};

export default useFileUpload;
