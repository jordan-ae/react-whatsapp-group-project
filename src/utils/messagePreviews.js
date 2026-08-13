import { MESSAGE_TYPES } from "./constants";

function getPreviewText(msg) {
  switch (msg.type) {
    case "image":
      return "📷 Photo";
    case "audio":
      return "🎤 Voice message";
    case "document":
      return `📄 ${msg.fileName}`;
    case "location":
      return "📍 Location";
    case "sticker":
      return "Sticker";
    default:
      return "";
  }
}

export default getPreviewText