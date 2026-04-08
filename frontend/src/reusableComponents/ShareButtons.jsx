import { Facebook, Share2 } from "lucide-react";

const ShareButtons = ({ representative }) => {
  const { name, current_role, district } = representative;
  const shareTitle = `Check out ${name}, ${current_role.title}${
    district ? ` for ${district}` : ""
  } in Nevada`;
  const shareUrl = window.location.href;
  //
  const handleShare = (platform) => {
    // First copy the link to clipboard
    navigator.clipboard
      .writeText(`${shareTitle} ${shareUrl}`)
      .then(() => {
        // Then proceed with platform-specific sharing
        let shareLink = "";

        switch (platform) {
          case "facebook":
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}&quote=${encodeURIComponent(shareTitle)}`;
            window.open(shareLink, "_blank", "width=600,height=400");
            break;
          case "twitter":
            shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareTitle
            )}&url=${encodeURIComponent(shareUrl)}`;
            window.open(shareLink, "_blank", "width=600,height=400");
            break;
          case "tiktok":
            shareLink = `https://www.tiktok.com/share?url=${encodeURIComponent(
              shareUrl
            )}&text=${encodeURIComponent(shareTitle)}`;
            window.open(shareLink, "_blank", "width=600,height=400");
            break;
          case "instagram":
            // Instagram doesn't support direct sharing via URL, so we'll open a new tab to composer
            window.open("https://www.instagram.com/", "_blank");
            break;
          case "whatsapp":
            shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
              `${shareTitle} ${shareUrl}`
            )}`;
            window.open(shareLink, "_blank", "width=600,height=400");
            break;
          case "linkedin":
            shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl
            )}`;
            window.open(shareLink, "_blank", "width=600,height=400");
            break;
          case "reddit":
            shareLink = `https://www.reddit.com/submit?url=${encodeURIComponent(
              shareUrl
            )}&title=${encodeURIComponent(shareTitle)}`;
            window.open(shareLink, "_blank", "width=600,height=400");
            break;
          case "telegram":
            shareLink = `https://t.me/share/url?url=${encodeURIComponent(
              shareUrl
            )}&text=${encodeURIComponent(shareTitle)}`;
            window.open(shareLink, "_blank", "width=600,height=400");
            break;
          default:
            if (navigator.share) {
              navigator
                .share({
                  title: shareTitle,
                  url: shareUrl,
                })
                .catch((err) => console.error("Error sharing:", err));
            } else {
              alert("Link copied to clipboard. You can now paste it anywhere.");
            }
        }
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        // Fallback sharing without copy
        let shareLink = "";
        switch (platform) {
          case "facebook":
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`;
            break;
          case "twitter":
            shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareTitle
            )}&url=${encodeURIComponent(shareUrl)}`;
            break;
          case "whatsapp":
            shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(
              `${shareTitle} ${shareUrl}`
            )}`;
            break;
        }
        if (shareLink) {
          window.open(shareLink, "_blank", "width=600,height=400");
        } else {
          alert("Failed to copy link, but you can still share manually.");
        }
      });
  };

  return (
    <div className="flex flex-row space-x-2">
      <button
        onClick={() => handleShare("facebook")}
        className="bg-[#1877F2] hover:bg-[#166FE5] text-white p-2 rounded-md transition duration-200"
        aria-label="Share on Facebook"
      >
        <Facebook size={20} />
      </button>
      <button
        onClick={() => handleShare("twitter")}
        className="bg-[#202021] hover:bg-[#000000] text-white p-2 rounded-md transition duration-200"
        aria-label="Share on X (Twitter)"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        onClick={() => handleShare("tiktok")}
        className="bg-[#000000] hover:bg-[#333333] text-white p-2 rounded-md transition duration-200"
        aria-label="Share on TikTok"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      </button>
      <button
        onClick={() => handleShare("whatsapp")}
        className="bg-[#25D366] hover:bg-[#128C7E] text-white p-2 rounded-md transition duration-200"
        aria-label="Share on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>
      <button
        onClick={() => handleShare("general")}
        className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-md transition duration-200"
        aria-label="Share via other platforms"
      >
        <Share2 size={20} />
      </button>
    </div>
  );
};

export default ShareButtons;
