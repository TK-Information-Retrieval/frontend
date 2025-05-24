// lib/FileContext.tsx

'use client';

import React, { createContext, useContext, useState } from 'react';

type FileContextType = {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: React.ReactNode }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <FileContext.Provider value={{ uploadedFile, setUploadedFile }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFile = () => {
  const context = useContext(FileContext);
  if (!context) throw new Error('useFile must be used within FileProvider');
  return context;
};
