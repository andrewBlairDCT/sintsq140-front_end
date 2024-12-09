'use client'

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Fragment, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from './page.module.css';

const Home = () => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const allowedFileTypes = ["text/csv", "application/vnd.ms-excel"]; 
  const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

  const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
    },
  });

  const handleUploadLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const filteredFiles = selectedFiles.filter((file) =>
      allowedFileTypes.includes(file.type)
    );
    console.log('filtered', filteredFiles.length)
    console.log('selected', selectedFiles.length)

    if (filteredFiles.length !== selectedFiles.length) {
      alert("Some file(s) are not the required type. Please choose files again.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setFiles(filteredFiles);
  };

  const handleUploadS3 = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select file(s) to upload.");
      return;
    }

    try {
      const uploadPromises = files.map(async (file) => {
        const uniqueFileName = `${uuidv4()}-${file.name}`;
        const uploadCommand = new PutObjectCommand({
          Bucket: bucketName,
          Key: uniqueFileName,
          Body: file,
        });

        return s3.send(uploadCommand);
      });

      await Promise.all(uploadPromises);
      alert("Files uploaded successfully!");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFiles([]);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert(`Error uploading files: ${error.message}`);
    }
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.buttonContainer}>
          <h1>UPLOAD CSV FILES</h1>
          <p>Acceptable file format: .csv</p>
          <div>
            <input
              type="file"
              id="file-upload"
              accept=".csv"
              onChange={handleUploadLocalFile}
              multiple
              ref={fileInputRef}
            />
          </div>
          <div>
            <button className={styles.buttonStyling} onClick={handleUploadS3}>
              S3 Upload
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
