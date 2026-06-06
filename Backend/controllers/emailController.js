const ai = require('../config/gemini');
const transporter = require('../config/mailer');
const Email = require('../models/Email');
const { validateEmailFormat } = require('../utils/validations');

// AI Email Generation Routine
const generateEmail = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ success: false, message: 'Voice text prompt parameter missing.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Transform this voice transcript into a professional email:\n\n"${prompt}"`,
      config: {
        systemInstruction: "You are an AI specialized in transforming messy, informal, or unstructured voice transcripts into clean, error-free business correspondence. Provide a clear subject line and body text. Output nothing but the text of the email.",
        temperature: 0.2
      }
    });

    return res.status(200).json({ email: response.text.trim() });
  } catch (error) {
    next(error);
  }
};

// Storage Systems Logic (History)
const saveHistory = async (req, res, next) => {
  try {
    const { transcript, generatedEmail } = req.body;
    if (!transcript || !generatedEmail) {
      return res.status(400).json({ success: false, message: 'Required data blocks to save history are missing.' });
    }
    const record = await Email.create({ userId: req.user.id, transcript, generatedEmail });
    return res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const data = await Email.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    next(error);
  }
};

const getHistoryById = async (req, res, next) => {
  try {
    const item = await Email.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Record not found.' });
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Resource access restriction violation.' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const deleteHistory = async (req, res, next) => {
  try {
    const item = await Email.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Record not found.' });
    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Resource modification violation.' });
    }
    await item.deleteOne();
    return res.status(200).json({ success: true, message: 'Record purged cleanly.' });
  } catch (error) {
    next(error);
  }
};

// Dispatch Services (Nodemailer Pipeline)
const dispatchEmail = async (req, res, next) => {
  try {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body || !validateEmailFormat(to)) {
      return res.status(400).json({ success: false, message: 'Valid recipient, subject, and body strings are mandatory.' });
    }

    await transporter.sendMail({
      from: `"AI Voice Email Writer" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: body,
      html: body.replace(/\n/g, '<br>'),
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    next(error);
  }
};

// Multi-language Engine Implementation
const translateEmail = async (req, res, next) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ success: false, message: 'Context strings and target language flags are required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Translate the following text into ${targetLanguage}:\n\n"${text}"`,
      config: {
        systemInstruction: "You are a professional business translator. Translate the incoming text carefully, maintaining business structure and tone accurately. Return only the translated results.",
        temperature: 0.3
      }
    });

    return res.status(200).json({ translatedText: response.text.trim() });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateEmail,
  saveHistory,
  getHistory,
  getHistoryById,
  deleteHistory,
  dispatchEmail,
  translateEmail,
};