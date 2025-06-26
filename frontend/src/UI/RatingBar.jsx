import { Star } from "lucide-react";

const RatingBar = ({ rating, children }) => {
  // Ensure rating is a valid number between 0-100
  const validatedRating = Math.min(100, Math.max(0, Number(rating) || 0));

  // Calculate stars (0-5 scale)
  const fullStars = Math.floor(validatedRating / 20);
  const hasHalfStar = validatedRating % 20 >= 10;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0)); // Prevent negatives

  return (
    <div className="flex items-center">
      <div className="flex mr-2">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className="h-5 w-5 text-yellow-400 fill-yellow-400"
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative h-5 w-5">
            <Star className="h-5 w-5 text-gray-300 fill-gray-300" />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className="h-5 w-5 text-gray-300 fill-gray-300"
          />
        ))}
      </div>
      {children}
    </div>
  );
};

export default RatingBar;
