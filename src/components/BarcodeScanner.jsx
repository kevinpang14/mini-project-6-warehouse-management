// import { useState } from "react";
// import BarcodeScannerComponent from "react-qr-barcode-scanner"; // Import the barcode scanner package

// const CameraScanner = ({ onScanSuccess, onScanError }) => {
//   const [scanning, setScanning] = useState(true); // state to toggle scanning

//   // Handle the barcode scan result
//   const handleScanResult = (err, result) => {
//     if (err) {
//       onScanError(err); // Pass the error to parent if needed
//     } else if (result && result.text) {
//       onScanSuccess(result.text); // Pass the scanned ID to the parent component
//       setScanning(false); // Stop scanning after successful scan
//     }
//   };

//   return (
//     <div className="scanner-container">
//       <h2 className="text-xl font-bold mb-4 text-center">Scan Barcode</h2>

//       {scanning ? (
//         <BarcodeScannerComponent
//           onUpdate={(err, result) => handleScanResult(err, result)} // Handle scan result
//           width="100%"
//           height="300px"
//         />
//       ) : (
//         <button
//           onClick={() => setScanning(true)} // Reset scanner
//           className="bg-blue-500 text-white p-2 rounded"
//         >
//           Rescan Barcode
//         </button>
//       )}
//     </div>
//   );
// };

// export default CameraScanner;
