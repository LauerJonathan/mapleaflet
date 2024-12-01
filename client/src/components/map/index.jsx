import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Résolution du problème d'icônes manquantes dans Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LeafletMap = () => {
  const mapRef = useRef(null); // Référence à la carte

  // Fonction pour télécharger le PDF
  const downloadPDF = async () => {
    if (!mapRef.current) return;

    const mapElement = mapRef.current;

    // Utilisation de html2canvas pour capturer la carte
    const canvas = await html2canvas(mapElement, { useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    // Création du PDF avec jsPDF (orientation portrait)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [595, 842], // Taille de la page en pixels (A4)
    });

    // Titre principal
    pdf.setFontSize(22);
    pdf.text("Découverte des Grandes Villes du Monde", 20, 30);

    // Ajustement de la taille de la carte dans le PDF pour qu'elle ne dépasse pas
    const scaleFactor = 0.6; // Réduire la taille de la carte
    const imgWidth = canvas.width * scaleFactor;
    const imgHeight = canvas.height * scaleFactor;

    // Ajout de la carte dans le PDF
    pdf.addImage(imgData, "PNG", 20, 40, imgWidth, imgHeight);

    // Espace entre la carte et les descriptions
    let yPosition = 40 + imgHeight + 20;

    // Description des villes avec des images de monuments
    const descriptions = [
      {
        city: "Paris, France",
        description:
          "Paris, la capitale de la France, est célèbre pour ses monuments iconiques tels que la Tour Eiffel, le Louvre, et l'Arc de Triomphe. La ville est un centre culturel et artistique majeur.",
        monument: "Tour Eiffel",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/a/a8/Eiffel_Tower_%28Paris%29.jpg", // Image externe (Tour Eiffel)
      },
      {
        city: "London, United Kingdom",
        description:
          "Londres, capitale du Royaume-Uni, est connue pour ses sites emblématiques comme le Palais de Buckingham, le Big Ben et la Tamise. Un lieu où l'histoire et la modernité se rencontrent.",
        monument: "Big Ben",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/c/c2/Big_Ben_2017.jpg", // Image externe (Big Ben)
      },
      {
        city: "Beijing, China",
        description:
          "Pékin, capitale de la Chine, regorge de trésors culturels comme la Cité interdite, le Temple du Ciel et la Grande Muraille. Un mélange fascinant de tradition et de modernité.",
        monument: "Cité Interdite",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/e/e4/Forbidden_City_in_Beijing_-_view_from_the_Jingshan_Park.jpg", // Image externe (Cité Interdite)
      },
    ];

    // Boucle pour ajouter les descriptions et les images des villes
    descriptions.forEach((place) => {
      if (yPosition + 60 > pdf.internal.pageSize.height) {
        pdf.addPage(); // Ajouter une nouvelle page si le texte dépasse
        yPosition = 40; // Réinitialiser la position Y
      }
      pdf.setFontSize(16);
      pdf.text(place.city, 20, yPosition);
      yPosition += 20;
      pdf.setFontSize(12);
      pdf.text(place.description, 20, yPosition);
      yPosition += 40;

      // Ajouter l'image du monument avec une taille réduite
      pdf.addImage(place.image, "JPEG", 20, yPosition, 180, 100);
      yPosition += 120; // Espace après l'image
    });

    // Sauvegarder le PDF
    pdf.save("livret_villes.pdf");
  };

  // Les points pour la carte
  const paris = [48.8566, 2.3522];
  const london = [51.5074, -0.1278];
  const beijing = [39.9042, 116.4074];

  return (
    <div>
      <h1>Carte avec téléchargement PDF</h1>
      <div
        ref={mapRef}
        style={{ height: "500px", width: "100%", marginBottom: "10px" }}>
        <MapContainer
          center={paris}
          zoom={2}
          style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={paris}>
            <Popup>Paris, France</Popup>
          </Marker>
          <Marker position={london}>
            <Popup>London, United Kingdom</Popup>
          </Marker>
          <Marker position={beijing}>
            <Popup>Beijing, China</Popup>
          </Marker>
        </MapContainer>
      </div>
      <button
        onClick={downloadPDF}
        style={{ padding: "10px 20px", fontSize: "16px" }}>
        Télécharger la carte en PDF
      </button>
    </div>
  );
};

export default LeafletMap;
