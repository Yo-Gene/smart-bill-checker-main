import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, RotateCcw, Check, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

const ScanMeter = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);

  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [detectedReading, setDetectedReading] = useState("");
  const [rawText, setRawText] = useState("");

  // 🔥 Image preprocessing (improves OCR accuracy)
  const preprocessImage = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return resolve(imageSrc);

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        // Convert to grayscale + increase contrast
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

          // threshold for better digit clarity
          const value = avg > 140 ? 255 : 0;

          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
        }

        ctx.putImageData(imageData, 0, 0);

        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  const extractBestReading = (text: string): string => {
    // 🔥 Extract all number candidates
    const matches = text.match(/\d{3,6}(\.\d+)?/g);

    if (!matches || matches.length === 0) return "Not detected";

    // Convert to numbers
    const numbers = matches.map((n) => parseFloat(n));

    // Remove unrealistic values
    const filtered = numbers.filter((n) => n > 10 && n < 100000);

    if (filtered.length === 0) return "Not detected";

    // 🔥 Choose the most likely reading
    // Strategy: highest value is usually the meter reading
    const best = Math.max(...filtered);

    return best.toString();
  };

  const handleCapture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setScanning(true);

    try {
      // 🔥 preprocess image
      const processedImage = await preprocessImage(imageSrc);

      const result = await Tesseract.recognize(processedImage, "eng", {
        logger: (m) => console.log(m),
      });

      const text = result.data.text;
      setRawText(text);

      // 🔥 improved extraction
      const bestReading = extractBestReading(text);

      setDetectedReading(bestReading);
      setScanned(true);
    } catch (error) {
      console.error(error);
      setDetectedReading("Scan failed");
      setScanned(true);
    }

    setScanning(false);
  };

  const handleConfirm = () => {
    const units = parseFloat(detectedReading);

    if (isNaN(units)) return;

    // 🔥 Send to prepaid flow (correct architecture)
    navigate("/bill-input", {
      state: {
        scannedUnits: units,
      },
    });
  };

  const handleRetake = () => {
    setScanned(false);
    setDetectedReading("");
    setRawText("");
  };

  return (
    <div className="min-h-screen bg-foreground flex flex-col">

      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between z-10">
        <button
          onClick={() => navigate(-1)}
          className="text-card text-sm font-medium"
        >
          ← Back
        </button>

        <h1 className="text-card font-display font-bold">
          Scan Meter
        </h1>

        <div className="w-12" />
      </div>

      {/* Camera area */}
      <div className="flex-1 relative flex items-center justify-center">

        {!scanned ? (
          <div className="relative z-10 flex flex-col items-center">

            {/* Scan Frame */}
            <div className="w-72 h-44 border-2 border-primary rounded-2xl relative overflow-hidden">

              <Webcam
                ref={webcamRef}
                screenshotFormat="image/png"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full h-full object-cover"
              />

              {/* Frame corners */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />

              {/* Scanning animation */}
              <AnimatePresence>
                {scanning && (
                  <motion.div
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute left-2 right-2 h-0.5 bg-primary"
                  />
                )}
              </AnimatePresence>

            </div>

            {/* Status */}
            {scanning ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 flex items-center gap-2 text-primary"
              >
                <Zap className="animate-pulse" size={18} />
                <span className="text-sm font-medium">
                  Reading meter...
                </span>
              </motion.div>
            ) : (
              <button
                onClick={handleCapture}
                className="mt-8 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg"
              >
                <Camera size={28} className="text-primary-foreground" />
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 bg-card rounded-2xl p-6 mx-5 w-full max-w-sm"
          >
            <div className="text-center mb-4">

              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <Check className="text-success" size={24} />
              </div>

              <h2 className="font-display font-bold text-lg text-foreground">
                Reading Detected
              </h2>

              <p className="text-muted-foreground text-xs mt-1">
                Please confirm the value
              </p>

            </div>

            <div className="bg-muted rounded-xl p-4 text-center mb-4">
              <p className="text-4xl font-display font-bold text-foreground">
                {detectedReading}
              </p>
              <p className="text-xs text-muted-foreground mt-1">kWh</p>
            </div>

            {/* Debug (optional - remove in production) */}
            <p className="text-[10px] text-muted-foreground mb-4">
              OCR: {rawText.slice(0, 80)}...
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleRetake}
                className="flex-1 h-12 rounded-xl border border-border flex items-center justify-center gap-2 text-muted-foreground text-sm"
              >
                <RotateCcw size={16} />
                Retake
              </button>

              <button
                onClick={handleConfirm}
                className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 font-bold text-sm"
              >
                <Check size={16} />
                Confirm
              </button>
            </div>

          </motion.div>
        )}
      </div>

      {!scanned && !scanning && (
        <div className="fixed bottom-24 left-0 right-0 text-center">
          <button
            onClick={() => navigate("/bill-input")}
            className="text-primary/80 text-sm underline"
          >
            Enter manually instead
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanMeter;