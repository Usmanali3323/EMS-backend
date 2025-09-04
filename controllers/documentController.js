import Document from "../models/Document.js";
import path from "path";
import fs from "fs";

// Upload a document
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { employee, kind, title, uploadedBy } = req.body;

    const newDoc = new Document({
      employee,
      kind,
      title,
      storageKey: req.file.path, // local storage path
      mimeType: req.file.mimetype,
      uploadedBy,
    });

    await newDoc.save();

    res.status(201).json({ message: "Document uploaded successfully", document: newDoc });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all documents
export const getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find().populate("employee uploadedBy", "firstName lastName email");
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get single document
export const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate("employee uploadedBy", "firstName lastName email");
    if (!doc) return res.status(404).json({ message: "Document not found" });

    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Download document
export const downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const filePath = path.resolve(doc.storageKey);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, doc.title + path.extname(filePath)); // downloads file
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // delete file from local storage
    if (fs.existsSync(doc.storageKey)) {
      fs.unlinkSync(doc.storageKey);
    }

    await doc.deleteOne();
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
